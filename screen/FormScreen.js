import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Animated, Easing } from 'react-native';

const FormScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
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

  const handleSubmit = () => {
    // Navigate to the homepage
    navigation.navigate('HomeScreen');
  };

  const animateFadeIn = () => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  // Start animation when component mounts
  React.useEffect(() => {
    animateFadeIn();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]}>
      <Text style={styles.title}>User Details</Text>
      {/* Username input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={handleUsernameChange}
      />
      {/* Class level toggler */}
      <View style={styles.togglerContainer}>
        <TouchableOpacity
          style={[styles.togglerButton, classLevel === 'Class 4 - 8' && styles.selectedButton]}
          onPress={() => handleClassLevelSelect('Class 4 - 8')}>
          <Text style={styles.togglerText}>Class 4 - 8</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.togglerButton, classLevel === 'Class 8 - 12' && styles.selectedButton]}
          onPress={() => handleClassLevelSelect('Class 8 - 12')}>
          <Text style={styles.togglerText}>Class 8 - 12</Text>
        </TouchableOpacity>
      </View>
      {/* Interested topics checkboxes */}
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
      {/* Submit button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>SUBMIT</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0D1117', // GitHub dark theme background color
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
    backgroundColor: '#161B22', // GitHub dark theme input background color
    color: '#FFFFFF', // GitHub dark theme text color
  },
  togglerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  togglerButton: {
    backgroundColor: '#6E3EBD',
    paddingVertical: 12, // Increase padding
    paddingHorizontal: 20, // Increase padding
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
    paddingVertical: 8, // Adjust padding
    paddingHorizontal: 12, // Adjust padding
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10, // Add margin bottom
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
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default FormScreen;
