import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Animated } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '843393192159-jvp9n1qop3jf4l5te81t3aq78b7tep76.apps.googleusercontent.com',
});

const LoginScreen = ({ navigation }) => {
  const [animation] = useState(new Animated.Value(0));

  // Animation effect
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000, // Adjust duration as needed
      useNativeDriver: false, // This should be set to false for animated views with Images
    }).start();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign-In Success:', userInfo);
      navigation.navigate('FormScreen'); // Navigate to FormScreen upon successful Google Sign-In
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  const handleLogin = () => {
    navigation.navigate('FormScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../vr.png')} style={styles.vrIcon} />
        <Text style={styles.appName}>
          <Text style={styles.meta}>META</Text>
          <Text style={styles.verse}>VERSE</Text>
        </Text>
      </View>

      {/* Username Input */}
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#777" />
      
      {/* Password Input */}
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#777" secureTextEntry={true} />
      
      {/* Login Button */}
      <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </View>
      </TouchableOpacity>

      {/* OR Line */}
      <View style={styles.orContainer}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.orLine} />
      </View>

      {/* Sign in with Google Button */}
      <TouchableOpacity onPress={handleGoogleSignIn} activeOpacity={0.7}>
  <Animated.View style={[styles.googleButton, { opacity: animation }]}>
    <Image source={require('../google.png')} style={styles.googleIcon} />
    <Text style={styles.buttonText}>Sign in with Google</Text>
  </Animated.View>
</TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117', // GitHub dark theme background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
  },
  vrIcon: {
    width: 250, // Adjust width according to your PNG dimensions
    height: 250, // Adjust height according to your PNG dimensions
    marginBottom: 10,
    marginTop: -100,
  },
  appName: {
    fontSize: 36,
    marginBottom: 30,
    flexDirection: 'row',
  },
  googleIcon: {
    width: 30, // Adjust the width as needed
    height: 30, // Adjust the height as needed
    marginRight: 10, // Add some margin to separate the icon from the text
  },
  meta: {
    color: '#6E3EBD', // Purple color for "META"
    fontWeight: 'bold', // Make "META" text bold
    textShadowColor: '#6E3EBD', // Purple color for text shadow
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 10,
  },
  verse: {
    color: '#FFFFFF', // White color for "VERSE"
    fontWeight: 'bold', // Make "VERSE" text bold
    textShadowColor: '#FFFFFF', // White color for text shadow
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 10,
  },
  button: {
    backgroundColor: '#6E3EBD', // Purple color for the button
    paddingHorizontal: 40,
    paddingVertical: 15, // Increased padding to make the button taller
    borderRadius: 25, // Increased borderRadius to make the button rounder
    elevation: 3, // Add elevation for a subtle shadow effect (Android only)
    marginBottom: 10, // Added margin bottom to separate buttons
  },
  googleButton: {
    paddingTop:10,
    backgroundColor: 'rgba(110, 62, 189, 0.9)', // Google red color for the button
    paddingHorizontal: 35,
    paddingVertical: 15, // Increased padding to make the button taller
    borderRadius: 25, // Increased borderRadius to make the button rounder
    elevation: 3,
    flexDirection: 'row', // Ensure contents are aligned horizontally
    alignItems: 'center', // Center the contents vertically
    justifyContent: 'center', // Add elevation for a subtle shadow effect (Android only)
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold', // Make button text bold
  },
  input: {
    backgroundColor: '#0D1117', // Dark background color
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    width: 300, // Adjust width according to your layout
    fontSize: 16, // Font size for input text
    color: '#FFFFFF', // Text color
    borderWidth: 2, // Add border
    borderColor: '#6E3EBD', // Purple color for border
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFFFFF',
  },
  orText: {
    color: '#FFFFFF',
    marginHorizontal: 10,
  },
});

export default LoginScreen;
