import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { firebase } from '../firebaseConfig'; // Import Firebase

const AttendanceListScreen = ({ navigation }) => {
  const [classId, setClassId] = useState(''); // Replace with class ID retrieval logic (e.g., from navigation params)
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (classId) {
        const database = firebase.database();
        const attendanceRef = database.ref('attendance/' + classId);

        const snapshot = await attendanceRef.once('value');
        if (snapshot.exists()) {
          const data = snapshot.val();
          setAttendanceData(Object.values(data || {})); // Convert object to array
        }
      }
    };

    fetchData();
  }, [classId]); // Re-fetch data when class ID changes

  const renderItem = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <Text>Student ID: {item.studentId}</Text>
      {item.timestamp && <Text>Marked at: {new Date(item.timestamp).toLocaleString()}</Text>}
      {item.selfieUrl && <Text>Selfie: {item.selfieUrl}</Text>}  {/* Optional: Display selfie URL */}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Attendance List (Class ID: {classId})</Text>
      {attendanceData.length > 0 ? (
        <FlatList
          data={attendanceData}
          renderItem={renderItem}
          keyExtractor={(item) => item.studentId || Math.random().toString()} // Handle potential missing student ID
        />
      ) : (
        <Text>No attendance data found for this class.</Text>
      )}
      <Button title="Download Attendance Data" onPress={() => console.log('Download not implemented')} disabled /> {/* Optional download button (not implemented) */}
    </View>
  );
};

export default AttendanceListScreen;
