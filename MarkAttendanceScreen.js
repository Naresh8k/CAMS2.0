
import { View, Text, TextInput, Button, PermissionsAndroid, Platform, Image } from 'react-native';
 // Import class ID validation function
import * as ImagePicker from 'expo-image-picker'; // For image picking
import * as Location from 'expo-location'; // For location
 // Import for authentication
import { firebase } from '../firebaseConfig';
import { validateClassId } from '../utils/validateClassId';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { StyleSheet } from 'react-native';

 // Assuming you're using most functionalities
// or for specific functions

 // Import Firebase configuration

const FIXED_LOCATION_COORDS = { // Optional: Define fixerd location coordinates (latitude, longitude)
  latitude: 12.345678,
  longitude: -98.765432,
};

const MAX_ALLOWED_DISTANCE = 50; // Optional: Define maximum allowed distance from fixed location (in meters)

const MarkAttendanceScreen = ({ navigation }) => {
  const [classId, setClassId] = useState('');
  const [isValidClassId, setIsValidClassId] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [imageUri, setImageUri] = useState(null); // Stores the captured image URI (if any)
  const [isCameraOpen, setIsCameraOpen] = useState(false); // Flag for camera modal

  // Get currently logged-in user (replace with your error handling)
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const auth = getAuth(firebase);
    onAuthStateChanged(auth, (user) => setCurrentUser(user));
  }, []);

  const requestPermissions = async () => {
    // Handle Android-specific permissions if necessary
    if (Platform.OS === 'android') {
      const grantedPermissions = await PermissionsAndroid.requestMultiplePermissions([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
      setLocationGranted(grantedPermissions['android.permission.ACCESS_FINE_LOCATION'] === 'granted');
      setCameraPermissionGranted(grantedPermissions['android.permission.CAMERA'] === 'granted');
    } else {
      // Request permissions for iOS or other platforms (if applicable)
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync(); // Request location permission
      setLocationGranted(locationStatus === 'granted');

      const { status: cameraStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Request camera permission
      setCameraPermissionGranted(cameraStatus === 'granted');
    }
  };

  const handleClassIdChange = (text) => {
    setClassId(text);
    setIsValidClassId(validateClassId(text)); // Call validation function
  };

  // Fixed error: Missing `async` keyword for `handleMarkAttendance`
  const handleMarkAttendance = async () => {
    if (!isValidClassId || !locationGranted || !cameraPermissionGranted) {
      console.error('Missing permissions or invalid class ID');
      return;
    }

    // Fixed error: Incorrect `await` placement for `Location.requestForegroundPermissionsAsync` (if necessary based on platform)
    let location;
    let locationValid = true; // Flag for location check (optional)

    try {
      if (Platform.OS === 'android' && !(locationGranted && cameraPermissionGranted)) {
        // Request permissions again if not already granted on Android
        await requestPermissions();
      }

      location = await Location.getCurrentPositionAsync({});

      // Optional location comparison with fixed coordinates
      if (FIXED_LOCATION_COORDS) {
        const distance = calculateDistance(location.coords, FIXED_LOCATION_COORDS); // Replace with your distance calculation function (e.g., Haversine formula)
        if (distance > MAX_ALLOWED_DISTANCE) {
          console.error('User location is outside the designated area');
          locationValid = false;
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
      return;
    }

    // Retrieve student ID based on logged-in user's email (assuming structure)
    let studentId;
    if (currentUser) { // Check if user is logged in
      const email = currentUser.email;
      const database = firebase.database();
      const usersRef = database.ref('users');
      const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');
      if (snapshot.exists()) {
        const data = snapshot.val();
        const userKey = Object.keys(data)[0]; // Assuming unique emails and single user per key
        studentId = data[userKey].studentId; // Replace with your student ID field name
      } else {
        console.error('Student ID not found for logged-in user');
        return;
      }
    } else {
      console.error('User not logged in. Please sign in first.');
      return;
    }

    // Optionally capture a selfie (using Expo Image Picker)
    let selfieUri = null;
    if (cameraPermissionGranted) {
      const response = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!response.cancelled) {
        selfieUri = response.uri;
        setImageUri(selfieUri); // Update state for display (optional)
      }
    }

    // Store attendance data in Firebase Realtime Database (replace with your structure)
    const attendanceRef = firebase.database().ref(`attendance/${classId}/${Date.now()}`);
    await attendanceRef.set({
      studentId, // Use retrieved student ID
      timestamp: Date.now(),
      location: location.coords, // Example using
      selfieUri, // Include selfie URI if available
    });

    // Optionally display success message or navigate to a different screen
    console.log('Attendance marked successfully');
    // navigation.navigate(/* navigate to a different screen */);
  };

  return (
    <View style={styles.container}>
      <Text>Class ID:</Text>
      <TextInput
        value={classId}
        onChangeText={handleClassIdChange}
        placeholder="Enter class ID"
        keyboardType="numeric"
      />
      <Button
        title="Mark Attendance"
        onPress={handleMarkAttendance}
        disabled={!isValidClassId || !locationGranted || !cameraPermissionGranted}
      />
      {/* Optionally display the captured image */}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
});

export default MarkAttendanceScreen;

