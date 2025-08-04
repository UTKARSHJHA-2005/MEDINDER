import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from "../config/db";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from 'expo-router';
import { setstorage } from '../service/Storage';

export default function SignUpScreen() {
  const router = useRouter();
  const Google = new GoogleAuthProvider();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isDoctor, setIsDoctor] = useState(false);

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      setstorage('userDetail', userCredential.user);
      console.log("User signed up successfully:", userCredential.user);
      alert("Sign-up successful!");
    } catch (error) {
      console.error("Signup error:", error);
    }
    router.push('/login/login');
  };

  const googlesignin = async () => {
    try {
      const result = await signInWithPopup(auth, Google);
      console.log("Google sign-in successful:", result.user);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>
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
      <View style={styles.switchContainer}>
        <Text>Are you a doctor?</Text>
        <Switch value={isDoctor} onValueChange={setIsDoctor} />
      </View>
      <Button title="Create Account" onPress={handleSignUp} />
      <TouchableOpacity style={styles.googleBtn} onPress={googlesignin}>
        <Text style={styles.googleText}>Signup with Google</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'space-between',
  },
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
