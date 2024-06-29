import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { auth, db, createUserWithEmailAndPassword, doc, setDoc } from '../firebaseConfig';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role is student
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: role,
      });

      // Navigate to the appropriate screen based on role
      if (role === 'faculty') {
        navigation.navigate('GenerateClassId');
      } else {
        navigation.navigate('MarkAttendance');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError(error.message); // Handle registration errors
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <View style={styles.roleSelection}>
        <Text>Select Role:</Text>
        <Button title="Student" onPress={() => setRole('student')} />
        <Button title="Faculty" onPress={() => setRole('faculty')} />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  roleSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default RegisterScreen;
