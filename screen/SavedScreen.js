import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import Model from './Model';

const SavedScreen = () => {
  const navigation = useNavigation();
  const [bookmarkedModels, setBookmarkedModels] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchBookmarkedModels();
    fadeIn();
  }, []);

  const fetchBookmarkedModels = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const userSnapshot = await firestore().collection('users').doc(currentUser.user.email).get();
        const savedModels = userSnapshot.data().savedModels || [];
        const filteredModels = Model.filter(model => savedModels.includes(model.modelName));
        setBookmarkedModels(filteredModels);
      }
    } catch (error) {
      console.error('Error fetching bookmarked models:', error);
    }
  };

  const getCurrentUser = async () => {
    try {
      const user = await GoogleSignin.getCurrentUser();
      if (!user) {
        navigation.navigate('Login'); // Redirect to login if user not logged in
      }
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Saved Models</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modelContainer}>
        {bookmarkedModels.map((model, index) => (
          <Animated.View key={index} style={[styles.modelCard, { opacity: fadeAnim }]}>
            <Image source={model.imageUri} style={styles.modelImage} />
            <Text style={styles.modelName}>{model.modelName}</Text>
          </Animated.View>
        ))}
      </ScrollView>
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}><Text style={styles.italic}>“Education is not the filling of a pail, but the lighting of a fire.”</Text> - William Butler Yeats</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  modelContainer: {
    alignItems: 'flex-start',
    marginTop: 10,
  },
  modelCard: {
    marginRight: 10,
  },
  modelImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  modelName: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 5,
  },
  quoteContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  quoteText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  italic: {
    fontStyle: 'italic',
    color: 'purple',
    paddingBottom: 20,
  },
});

export default SavedScreen;
