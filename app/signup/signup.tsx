import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, TouchableOpacity, Alert, Image, Platform, PermissionsAndroid } from 'react-native';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { Auth } from "../config/db";
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { setstorage } from '../service/Storage';

export default function SignUpScreen() {
  const router = useRouter();
  const Google = new GoogleAuthProvider();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isDoctor, setIsDoctor] = useState(false);
  const [imageUri, setImageUri] = useState<string | null | undefined>(null);

  const pickImage = async () => {
     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission denied!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, 
      aspect: [1, 1], 
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };


  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }
    Alert.alert('Account created successfully!');
    try {
      const userCredential = await createUserWithEmailAndPassword(Auth, email, password);
      await updateProfile(userCredential.user, { displayName: name, photoURL: imageUri });
      setstorage('userDetail', userCredential.user);
      console.log("User signed up successfully:", userCredential.user);
      alert("Sign-up successful!");
    } catch (error) {
      console.error("Signup error:", error);
    }
    router.push('/login/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Button title="Pick an Image" onPress={pickImage} />
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}
      </View>
      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Create Account" onPress={handleSignUp} />
      <TouchableOpacity onPress={() => router.push('/login/login')}>
        <Text style={styles.loginLink}>
          Already have an account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color:'black',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  image: { width: 200, height: 200, borderRadius: 100, marginTop: 20, marginBottom: 30 },
  loginLink: {
    marginTop: 16,
    color: '#007bff',
    textAlign: 'center',
  },
  googleBtn: {
    backgroundColor: '#4285F4',
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  googleText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
