import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import Model from './Model';
import { useNavigation } from '@react-navigation/core';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

const App = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState(null); 
  const [selectedTopic, setSelectedTopic] = useState('All'); 
  const [popupVisible, setPopupVisible] = useState(false); 
  const [selectedModel, setSelectedModel] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [isBookmarked, setIsBookmarked] = useState(false); // Added state for bookmark status
  const [isNewToAR, setIsNewToAR] = useState(true); // State to track if the user is new to AR

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const user = await GoogleSignin.getCurrentUser();
    console.log("Current user:", user); // Add this line
    setCurrentUser(user);
  };

  const uniqueTopicsFromModel = Array.from(new Set(Model.map(item => item.topic)));

  const allTopics = ['All', ...uniqueTopicsFromModel];

  const filteredModels = selectedTopic === 'All' 
    ? Model.filter(item => item.modelName.toLowerCase().includes(searchQuery.toLowerCase())) 
    : Model.filter(item => item.topic === selectedTopic && item.modelName.toLowerCase().includes(searchQuery.toLowerCase()));

  const togglePopup = (model) => {
    setSelectedModel(model);
    setPopupVisible(!popupVisible);
    setIsBookmarked(false); // Reset bookmark status when opening popup
  }

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      setCurrentUser(null);
      navigation.replace("Login");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  const handleBookmark = async () => {
    if (currentUser && selectedModel) { // Ensure currentUser and selectedModel are not null
      console.log("Current user email:", currentUser.user.email);
      try {
        if (!isBookmarked) { // If not bookmarked, add to Firestore
          await firestore().collection('users').doc(currentUser.user.email).update({
            savedModels: firestore.FieldValue.arrayUnion(selectedModel.modelName)
          });
        } else { // If bookmarked, remove from Firestore
          await firestore().collection('users').doc(currentUser.user.email).update({
            savedModels: firestore.FieldValue.arrayRemove(selectedModel.modelName)
          });
        }
        // Update bookmark status in UI
        setIsBookmarked(!isBookmarked);
      } catch (error) {
        console.error('Error bookmarking model:', error);
        // Handle error
      }
    } else {
      // Handle case when currentUser or selectedModel is null
    }
  }
  

  const handleARSimulation = () => {
    navigation.navigate('ARScreen', { modelSource: selectedModel.source });
    setPopupVisible(false); // Close the pop-up after navigation
  }

  const handleUserPress = () => {
    navigation.navigate('Community');
  }

  const handleExploreAR = () => {
    setIsNewToAR(false);
    navigation.navigate('Try');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.metaText}>META</Text>
        <Text style={styles.verseText}>VERSE</Text>
      </View>
      <View style={styles.subHeader}>
        <Text style={styles.headerText}>Explore</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#6a737d"
          onChangeText={handleSearchChange}
        />

        {isLoading && (
          <ActivityIndicator size="small" color="#ffffff" />
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topicContainer}>
        {allTopics.map(topic => (
          <TouchableOpacity
            key={topic}
            style={[styles.topicButton, { backgroundColor: selectedTopic === topic ? '#0366d6' : '#25292e' }]}
            onPress={() => setSelectedTopic(topic)}>
            <Text style={styles.topicButtonText}>{topic}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.imageGridContainer}>
        <View style={styles.imageGrid}>
          {/* Render models based on selected topic */}
          {filteredModels.map((item, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => togglePopup(item)}>
              <View style={styles.modelContainer}>
                <Image
                  source={item.imageUri}
                  style={styles.image}
                  resizeMode="contain"
                />
                <View style={styles.modelOverlay} />
                <View style={styles.modelInfoContainer}>
                  <Text style={styles.imageText}>{item.modelName}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </ScrollView>

      {isNewToAR && (
        <View style={styles.arPrompt}>
          <Text style={styles.arPromptText}>New to AR? Try this 🌟</Text>
          <TouchableOpacity style={styles.exploreARButton} onPress={handleExploreAR}>
            <Text style={styles.exploreARButtonText}>Explore AR</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={popupVisible}
        onRequestClose={() => setPopupVisible(false)}
      >
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setPopupVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.popupModelName}>{selectedModel?.modelName}</Text>
            <Text style={styles.popupDescription}>{selectedModel?.description}</Text>
            <Text style={styles.popupCreator}>Created by: {selectedModel?.creator}</Text>
            <TouchableOpacity 
              style={[styles.popupButton, isBookmarked ? styles.bookmarked : null]} 
              onPress={handleBookmark}
            >
              <Text style={styles.popupButtonText}>{isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popupButton} onPress={handleARSimulation}>
              <Text style={styles.popupButtonText}>Simulate AR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconButton} onPress={handleUserPress}>
          <Image source={require('../globe.png')} style={styles.iconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('SavedScreen')}>
          <Image source={require('../bookmark.png')} style={styles.iconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.contributeButton} onPress={handleSignOut}>
          <Text style={styles.contributeButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117', // GitHub dark theme background color
  },
  arPrompt: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0366d6', // Blue color for AR prompt background
    paddingVertical: 3,
  },
  arPromptText: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
  },
  exploreARButton: {
    backgroundColor: '#ffffff',
    padding: 5,
    borderRadius: 5,
  },
  exploreARButtonText: {
    color: '#0366d6',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    backgroundColor: '#24292e', // GitHub dark theme header background color
  },
  metaText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#6E3EBD', // Green color for "META"
    textShadowColor: '#6E3EBD',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  verseText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff', 
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: '#24292e', // GitHub dark theme subheader background color
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 40,
    marginRight: 30,
    paddingLeft: 10,
    backgroundColor: '#242988', // GitHub dark theme input background color
    borderRadius: 10,
  },
  topicContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    height: 100,
  },
  topicButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 30,
    backgroundColor: '#6E3EBD', // Green color for topics button
  },
  topicButtonText: {
    color: '#ffffff',
  },
  imageGridContainer: {
    flex: 1,
    padding: 25,
    marginTop: -500,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modelContainer: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 4, // Add elevation for shadow effect
    backgroundColor: '#000000', // Background color of the model container
    overflow: 'hidden', // Ensure child views are clipped within the container
  },
  modelOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent overlay for elevation effect
  },
  modelInfoContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },
  imageText: {
    fontSize: 16,
    color: '#ffffff',
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  popup: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: '#0366d6',
  },
  popupModelName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  popupDescription: {
    marginBottom: 10,
    color: '#000000',
  },
  popupCreator: {
    fontStyle: 'italic',
    marginBottom: 10,
    color: '#000000',
  },
  popupButton: {
    backgroundColor: '#6E3EBD', // Green color for popup buttons
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  popupButtonText: {
    color: '#ffffff',
  },
  bookmarked: {
    backgroundColor: '#FFA500', // Orange color for bookmarked button
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#24292e', // GitHub dark theme bottom bar background color
    paddingVertical: 10,
  },
  iconButton: {
    paddingHorizontal: 20,
  },
  iconImage: {
    width: 33,
    height: 33,
    tintColor: '#ffffff',
  },
  contributeButton: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 15,
  },
  contributeButtonText: {
    fontSize: 16,
    color: '#0366d6',
  },
});

export default App;