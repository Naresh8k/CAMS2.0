import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { auth, signInWithEmailAndPassword } from '../firebaseConfig';

const FacultyLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      // Navigate based on user role
      if (userData.role === 'faculty') {
        navigation.navigate('GenerateClassId');
      } else {
        setError('Access denied. Only faculty can log in here.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error.message); // Handle login errors
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faculty Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    width: '100%',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default FacultyLoginScreen;
