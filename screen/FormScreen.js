import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Animated, Easing, Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore'; 

const FormScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [mode, setMode] = useState('Student'); // Default mode is Student
  const [linkedinId, setLinkedinId] = useState('');
  const fadeIn = new Animated.Value(0);

  const handleUsernameChange = (text) => {
    setUsername(text);
  };

  const handleClassLevelSelect = (level) => {
    setClassLevel(level);
  };

  const handleTopicSelect = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((selectedTopic) => selectedTopic !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSubmit = async () => {
    if (!username) {
      Alert.alert('Please enter your username.');
    } else if (mode === 'Student' && !classLevel) { // Check mode before class validation
      Alert.alert('Please select your class level.');
    } else if (selectedTopics.length === 0) {
      Alert.alert('Please select at least one interested topic.');
    } else {
      try {
        if (!currentUser) {
          throw new Error('No user is currently logged in.');
        }

        // Use the Gmail ID of the current user as the document ID
        const docId = currentUser.user.email;

        await firestore().collection("users").doc(docId).set({
          username: username,
          class: mode === 'Student' ? classLevel : null,
          interestedTopics: selectedTopics,
          gmailId: currentUser.user.email,
          mode: mode,
          linkedinId: mode === 'Creator' ? linkedinId : null,
          savedModels: [],
          communities: [], // Include the communities parameter as an empty array
        });

        Alert.alert(
          'Personalized Recommendations',
          'Would you like to receive personalized recommendations based on your interests and usage history?',
          [
            {
              text: 'Yes',
              onPress: () => {
                navigation.navigate('HomeScreen');
              },
            },
            {
              text: 'No',
              onPress: () => {
                navigation.navigate('HomeScreen');
              },
            },
          ],
          { cancelable: false }
        );
      } catch (error) {
        console.error('Error adding user data to Firestore:', error);
        Alert.alert('Error', 'Failed to submit user data. Please try again later.');
      }
    }
  };

  const animateFadeIn = () => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut();
      setCurrentUser(null);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await GoogleSignin.getCurrentUser();
      setCurrentUser(user);

      if (user) {
        const docId = user.user.email;

        try {
          const docSnapshot = await firestore().collection("users").doc(docId).get();
          
          if (docSnapshot.exists) {
            // If user document exists, navigate to HomeScreen
            navigation.navigate('HomeScreen');
          }
        } catch (error) {
          console.error('Error checking user document:', error);
          // Handle error
        }
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    animateFadeIn();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]}>
      <Text style={styles.title}>User Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={handleUsernameChange}
      />
      <View style={styles.togglerContainer}>
        <TouchableOpacity
          style={[styles.togglerButton, mode === 'Student' && styles.selectedButton]}
          onPress={() => setMode('Student')}>
          <Text style={styles.togglerText}>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.togglerButton, mode === 'Creator' && styles.selectedButton]}
          onPress={() => setMode('Creator')}>
          <Text style={styles.togglerText}>Creator</Text>
        </TouchableOpacity>
      </View>
      {mode === 'Student' ? (
        <View style={styles.classLevelContainer}>
          <Text style={styles.classLevelTitle}>Class Level:</Text>
          <TouchableOpacity
            style={[styles.classLevelButton, classLevel === 'Class 4 - 8' && styles.selectedClassLevelButton]}
            onPress={() => handleClassLevelSelect('Class 4 - 8')}>
            <Text style={styles.classLevelButtonText}>Class 4 - 8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.classLevelButton, classLevel === 'Class 8 - 12' && styles.selectedClassLevelButton]}
            onPress={() => handleClassLevelSelect('Class 8 - 12')}>
            <Text style={styles.classLevelButtonText}>Class 8 - 12</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          style={styles.input}
          placeholder="LinkedIn ID"
          value={linkedinId}
          onChangeText={setLinkedinId}
        />
      )}
      <View style={styles.topicContainer}>
        <Text style={styles.topicTitle}>Interested Topics:</Text>
        {['Biology', 'Zoology', 'Chemistry', 'Automobiles', 'Engineering'].map((topic) => (
          <TouchableOpacity
            key={topic}
            style={[
              styles.topicButton,
              selectedTopics.includes(topic) && styles.selectedTopicButton,
            ]}
            onPress={() => handleTopicSelect(topic)}>
            <Text style={styles.topicButtonText}>{topic}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>SUBMIT</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>LOGOUT</Text>
      </TouchableOpacity>
      {currentUser && (
        <Text style={styles.currentUserText}>Currently logged in as: {currentUser.user.email}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0D1117',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#161B22',
    color: '#FFFFFF',
  },
  togglerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  togglerButton: {
    backgroundColor: '#6E3EBD',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedButton: {
    backgroundColor: '#FFA500',
  },
  togglerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  classLevelContainer: {
    marginBottom: 20,
    justifyContent: 'center',
  },
  classLevelTitle: {
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  classLevelButton: {
    backgroundColor: '#6E3EBD',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedClassLevelButton: {
    backgroundColor: '#FFA500',
  },
  classLevelButtonText: {
    color: '#FFFFFF',
  },
  topicContainer: {
    marginBottom: 20,
    justifyContent: 'center',
  },
  topicTitle: {
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  topicButton: {
    backgroundColor: '#6E3EBD',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedTopicButton: {
    backgroundColor: '#FFA500',
  },
  topicButtonText: {
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#6E3EBD',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  currentUserText: {
    marginTop: 20,
    color: '#FFFFFF',
  },
});

export default FormScreen;
