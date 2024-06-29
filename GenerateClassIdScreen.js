import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique IDs
import { firebase } from '../firebaseConfig'; // Import Firebase

const GenerateClassIdScreen = ({ navigation }) => {
  const [classId, setClassId] = useState('');

  const generateClassId = async () => {
    // Generate a unique class ID
    const newClassId = uuidv4();

    // Store the class ID in Firebase Realtime Database (optional)
    const database = firebase.database();
    const classIdRef = database.ref('classIds/' + newClassId);
    await classIdRef.set({ generatedAt: Date.now() }); // Optional: Store timestamp

    setClassId(newClassId);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Generate Class ID</Text>
      <Button title="Generate Class ID" onPress={generateClassId} />
      {classId && (
        <Text style={{ fontSize: 18, marginTop: 20 }}>Generated Class ID: {classId}</Text>
      )}
    </View>
  );
};

export default GenerateClassIdScreen;
