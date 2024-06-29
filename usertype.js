import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const UserTypeSelectionScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/unilogo.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to SAMS</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('FacultyLogin')}
        >
          <Text style={styles.buttonText}>Faculty Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('StudentLogin')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Student Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  secondaryButtonText: {
    color: '#2196F3',
  },
});

export default UserTypeSelectionScreen;
