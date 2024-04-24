import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </View>
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
  input: {
    backgroundColor: '#0D1117', // GitHub dark theme background color
    color: '#FFFFFF', // White color for text
    borderWidth: 2,
    borderColor: '#6E3EBD', // White color for border
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: '70%',
  },
  button: {
    backgroundColor: '#6E3EBD', // Purple color for the button
    paddingHorizontal: 40,
    paddingVertical: 15, // Increased padding to make the button taller
    borderRadius: 25, // Increased borderRadius to make the button rounder
    elevation: 3, // Add elevation for a subtle shadow effect (Android only)
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold', // Make button text bold
  },
});

export default LoginScreen;
