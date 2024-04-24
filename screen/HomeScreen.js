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

const App = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState(null); 
  const [selectedTopic, setSelectedTopic] = useState('All'); 
  const [popupVisible, setPopupVisible] = useState(false); 
  const [selectedModel, setSelectedModel] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    setCurrentUser('dummy_user');
  }, []);

  const uniqueTopicsFromModel = Array.from(new Set(Model.map(item => item.topic)));

  const allTopics = ['All', ...uniqueTopicsFromModel];

  const filteredModels = selectedTopic === 'All' 
    ? Model.filter(item => item.modelName.toLowerCase().includes(searchQuery.toLowerCase())) 
    : Model.filter(item => item.topic === selectedTopic && item.modelName.toLowerCase().includes(searchQuery.toLowerCase()));

  const togglePopup = (model) => {
    setSelectedModel(model);
    setPopupVisible(!popupVisible);
  }

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    navigation.replace("Login");
  }

  const handleARSimulation = () => {
    navigation.navigate('ARScreen', { modelSource: selectedModel.source });
    setPopupVisible(false); // Close the pop-up after navigation
  }

  const handleUserPress = () => {
    navigation.navigate('Community');
  }

  return (
    <View style={styles.container}>
      {/* MetaVerse header */}
      <View style={styles.header}>
        <Text style={styles.metaText}>META</Text>
        <Text style={styles.verseText}>VERSE</Text>
      </View>

      {/* Header */}
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
        {/* Topics */}
        {allTopics.map(topic => (
          <TouchableOpacity
            key={topic}
            style={[styles.topicButton, { backgroundColor: selectedTopic === topic ? '#0366d6' : '#25292e' }]}
            onPress={() => setSelectedTopic(topic)}>
            <Text style={styles.topicButtonText}>{topic}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Image grid */}
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
    color: '#ffffff', // White color for "VERSE"
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
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    backgroundColor: '#ffffff', // GitHub dark theme input background color
    borderRadius: 5,
  },
  topicContainer: {
    alignItems: 'center',
    paddingVertical: 10,
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
