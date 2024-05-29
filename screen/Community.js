import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Animated, Easing, Image, KeyboardAvoidingView } from 'react-native'; // Import Image component
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Linking } from 'react-native';

const CommunityScreen = () => {
  const [communityName, setCommunityName] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [description, setDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [welcomeOpacity] = useState(new Animated.Value(0));
  const [communities, setCommunities] = useState([]);
  const [subscribedCommunities, setSubscribedCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [shakeAnimation] = useState(new Animated.Value(0)); // Add shake animation value
  const [modelName, setModelName] = useState('');
  const [modelTopic, setModelTopic] = useState('');
  const [modelSource, setModelSource] = useState('');
  const [modelDescription, setModelDescription] = useState('');
  const [selectedCommunityForModel, setSelectedCommunityForModel] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    GoogleSignin.configure();

    Animated.timing(welcomeOpacity, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    // Continuous slight shake animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const unsubscribe = firestore().collection('community').onSnapshot(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setCommunities(data);
    });

    return () => unsubscribe();
  }, [welcomeOpacity, shakeAnimation]);

  const createCommunity = async () => {
    try {
      if (!communityName) {
        throw new Error('Please enter a community name.');
      }
      
      const currentUser = await GoogleSignin.getCurrentUser();
      const creatorId = currentUser.user.email;

      const communityRef = firestore().collection('community').doc(communityName);
      await communityRef.set({
        name: communityName,
        creator: creatorId,
        imageUri: imageUri,
        description: description,
        members: [creatorId],
      });
      
      setCommunityName('');
      setImageUri('');
      setDescription('');
      
      alert('Community created successfully!');
    } catch (error) {
      alert('Error creating community: ' + error.message);
    }
  };

  const subscribeCommunity = async (communityId, communityName) => {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
  
      if (!currentUser) {
        throw new Error('User not signed in.');
      }
  
      const userEmail = currentUser.user.email;
  
      const communityDoc = await firestore().collection('community').doc(communityId).get();
      const foundCommunityName = communityDoc.exists ? communityDoc.data().name : null;
  
      if (foundCommunityName) {
        const userDoc = await firestore().collection('users').doc(userEmail).get();
        const userData = userDoc.exists ? userDoc.data() : null;
  
        if (userData) {
          const userCommunities = userData.communities || [];
  
          if (userCommunities.includes(foundCommunityName)) {
            await firestore().collection('community').doc(communityId).update({
              members: firestore.FieldValue.arrayRemove(userEmail),
            });
  
            await firestore().collection('users').doc(userEmail).update({
              communities: userCommunities.filter((c) => c !== foundCommunityName),
            });
  
            alert('Unsubscribed from community successfully!');
          } else {
            await firestore().collection('community').doc(communityId).update({
              members: firestore.FieldValue.arrayUnion(userEmail),
            });
  
            await firestore().collection('users').doc(userEmail).update({
              communities: [...userCommunities, foundCommunityName],
            });
  
            alert('Subscribed to community successfully!');
          }
        } else {
          alert('User document not found.');
        }
      } else {
        alert('Community not found.');
      }

      setSubscribedCommunities(prevCommunities => {
        if (prevCommunities.includes(communityName)) {
          return prevCommunities.filter(c => c !== communityName);
        } else {
          return [...prevCommunities, communityName];
        }
      });
    } catch (error) {
      console.error('Error subscribing to community:', error);
      alert('Error subscribing to community: ' + error.message);
    }
  };

  const openCommunityDetails = (community) => {
    setSelectedCommunity(community);
  };

  const handleTryNow = (sourceUrl) => {
    // Open the provided source URL in the browser
    Linking.openURL(sourceUrl);
  };
  const [uploadedModels, setUploadedModels] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore().collection('models').onSnapshot(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => {
        data.push(doc.data());
      });
      setUploadedModels(data);
    });

    return () => unsubscribe();
  }, []);
  const handleUpload = async () => {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      const creatorId = currentUser.user.email;

      if (!modelName || !modelTopic || !modelSource || !selectedCommunityForModel) {
        throw new Error('Please fill in all fields.');
      }

      const modelRef = firestore().collection('models').doc(modelName);
      await modelRef.set({
        modelName: modelName,
        topic: modelTopic,
        creator: creatorId,
        source: modelSource,
        description: modelDescription,
        community: selectedCommunityForModel,
      });

      setModelName('');
      setModelTopic('');
      setModelSource('');
      setModelDescription('');
      setSelectedCommunityForModel('');

      setShowUploadModal(false);

      alert('Model uploaded successfully!');
    } catch (error) {
      alert('Error uploading model: ' + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.metaText}>META</Text>
        <Text style={styles.verseText}>VERSE</Text>
        <Text style={styles.subHeaderText}>COMMUNITY</Text>
      </View>
      <Animated.View style={[styles.welcomeContainer, { opacity: welcomeOpacity }]}>
        <Text style={styles.welcomeTitle}>Welcome to Communities</Text>
        <Text style={styles.welcomeText}>Here you can collaborate, contribute, and become a part of the first open-source AR React Native community!</Text>
      </Animated.View>
      
      <View style={styles.horizontalScrollViewContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {communities.map(community => (
            <View key={community.id} style={styles.communityBox}>
              <Text style={styles.communityName}>{community.name}</Text>
              <TouchableOpacity 
                style={styles.exploreButton} 
                onPress={() => openCommunityDetails(community)}
              >
                <Text style={styles.exploreButtonText}>Explore</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  {
                    backgroundColor: subscribedCommunities.includes(community.name) ? '#ff4d4f' : '#3498db',
                  },
                ]}
                onPress={() => subscribeCommunity(community.id, community.name)}
              >
                <Text style={styles.subscribeButtonText}>
                  {subscribedCommunities.includes(community.name) ? 'Unsubscribe' : 'Subscribe'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      
      <TouchableOpacity style={styles.createButton} onPress={() => setShowCreateForm(true)}>
        <Text style={styles.createButtonText}>Create Community</Text>
      </TouchableOpacity>
      
      <View style={styles.quotesContainer}>
        <Animated.Image 
          source={require('../comm.png')} 
          style={[styles.image, { transform: [{ translateX: shakeAnimation }] }]} // Apply animation to image
        />
        <Text style={styles.quoteText}>"Alone we can do so little, together we can do so much."</Text>
        <Text style={styles.quoteAuthor}>- Helen Keller</Text>

        {/* Add the new content */}
        <Text style={styles.newContentBoldText}>From Community</Text>
        <Text style={styles.newContentItalicText}>Coming soon!</Text>
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={() => setShowUploadModal(true)}>
        <Text style={styles.uploadButtonText}>Upload Model</Text>
      </TouchableOpacity>
      <View style={styles.uploadedModelsContainer}>
        <Text style={styles.sectionTitle}>Uploaded Models</Text>
        {uploadedModels.map((model, index) => (
          <View key={index} style={styles.modelBox}>
            <Text style={styles.modelName}>{model.modelName}</Text>
            <Text style={styles.modelCreator}>Creator: {model.creator}</Text>
            <Text style={styles.modelDescription}>Description: {model.description}</Text>
            <TouchableOpacity
              style={styles.tryNowButton}
              onPress={() => handleTryNow(model.source)}
            >
              <Text style={styles.tryNowButtonText}>Try Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal visible={showCreateForm} animationType="slide">
        <View style={styles.popupContainer}>
          <Text style={styles.popupTitle}>Create New Community</Text>
          <Text style={styles.label}>Community Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter community name"
            value={communityName}
            onChangeText={setCommunityName}
          />
          <Text style={styles.label}>Image URI:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter image URI"
            value={imageUri}
            onChangeText={setImageUri}
          />
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TouchableOpacity style={styles.createButton} onPress={createCommunity}>
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCreateForm(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      
      <Modal visible={selectedCommunity !== null} animationType="slide">
        <View style={styles.popupContainer}>
          <Text style={styles.popupTitle}>{selectedCommunity?.name}</Text>
          <Text style={styles.label}>Creator: {selectedCommunity?.creator}</Text>
          <Text style={styles.label}>Description: {selectedCommunity?.description}</Text>
          <Text style={styles.label}>Members Count: {selectedCommunity?.members.length}</Text>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => setSelectedCommunity(null)}
          >
            <Text style={styles.cancelButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={showUploadModal} animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Adjust vertical offset based on platform
        >
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Upload Model</Text>
            <Text style={styles.label}>Model Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter model name"
              value={modelName}
              onChangeText={setModelName}
            />
            <Text style={styles.label}>Topic:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter topic"
              value={modelTopic}
              onChangeText={setModelTopic}
            />
            
            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Enter description"
              value={modelDescription}
              onChangeText={setModelDescription}
              multiline
            />
            <Text style={styles.label}>Community:</Text>
            <TextInput
              style={styles.input}
              placeholder="Choose community"
              value={selectedCommunityForModel}
              onChangeText={setSelectedCommunityForModel}
            />
            <Text style={styles.label}>Source (URL):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter source URL"
              value={modelSource}
              onChangeText={setModelSource}
            />
            <TouchableOpacity style={styles.createButton} onPress={handleUpload}>
              <Text style={styles.createButtonText}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowUploadModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add the line below */}
      <View style={{ paddingTop: 50, alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 16 }}>
    Need help uploading the files on our app? Check the official documentation of the App on the{' '}
    <Text style={styles.metaText}> META</Text>
    <Text style={styles.verseText}>VERSE </Text>
    website
  </Text>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  metaText: {
    color: '#6b3eff',
    fontSize: 24,
    textShadowColor: '#6b3eff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    backgroundColor: '#6b3eff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  verseText: {
    color: '#fff',
    fontSize: 24,
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadedModelsContainer: {
    marginTop: 20,
  },
  modelBox: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modelName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modelCreator: {
    color: '#ccc',
    marginBottom: 5,
  },
  modelDescription: {
    color: '#fff',
    marginBottom: 10,
  },
  welcomeTitle:{
    color: '#ffff',
  },
  welcomeText:{
    color: '#ffff',
  },
  tryNowButton: {
    backgroundColor: '#6cc644',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  tryNowButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8a2be2',
    textShadowColor: '#8a2be2',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginRight: 5,
  },
  verseText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subHeaderText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#00ff00', // Green color
    textTransform: 'uppercase', // Transform text to uppercase
    marginLeft: 5,
    textShadowColor: '#00ff00', // Green color for glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    // Adding gradient effect
    backgroundClip: 'text',
    backgroundImage: 'linear-gradient(45deg, #00ff00, #32cd32)', // Green gradient
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  horizontalScrollViewContainer: {
    flexDirection: 'row',
    overflow: 'scroll', // Enable horizontal scrolling
  },
  communityBox: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
    height: 150, // Set a fixed height
  },
  communityName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exploreButton: {
    backgroundColor: '#6cc644',
    padding: 8,
    borderRadius: 5,
    marginTop: 'auto',
    marginBottom: 5,
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subscribeButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 5,
  },
  subscribeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#ff4500',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  quotesContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  quoteText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
  },
  quoteAuthor: {
    color: '#ccc',
    fontStyle: 'italic',
  },
  newContentBoldText: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
    color: '#fff',
  },
  newContentItalicText: {
    fontStyle: 'italic',
    color: '#00ff00',
    textShadowColor: '#00ff00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  uploadButton: {
    backgroundColor: '#ff4500',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  popupContainer: {
    backgroundColor: '#121212',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 200,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  cancelButton: {
    backgroundColor: '#777',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CommunityScreen;
