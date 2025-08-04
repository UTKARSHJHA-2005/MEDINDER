import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { auth } from '../config/db';
import { setstorage } from '../service/Storage';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Entypo } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const Login = () => {
  const router = useRouter();
  const [isBiometric, setIsBiometric] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const Google = new GoogleAuthProvider();

  const handleBiometric = async () => {
    const isAvailable = await LocalAuthentication.hasHardwareAsync();
    const savedBiometric = await LocalAuthentication.isEnrolledAsync();
    if (!isAvailable || !savedBiometric) {
      Alert.alert('Biometric login not available or set up');
      return;
    }
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometrics',
      cancelLabel: 'Cancel',
      disableDeviceFallback: true,
    });
    if (biometricAuth.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Biometric login failed');
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      router.replace('/(tabs)');
      await setstorage('userDetail', userCredential.user);
      console.log("Logged in successfully:", userCredential.user);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }

  const googlesignin = async () => {
    try {
      const result = await signInWithPopup(auth, Google);
      console.log("Google sign-in successful:", result.user);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometric(compatible);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none"/>
      <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry/>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleBtn} onPress={googlesignin}>
        <Text style={styles.googleText}>Login with Google</Text>
      </TouchableOpacity>
      <View style={styles.linkRow}>
        <TouchableOpacity onPress={() => router.push('/signup/signup')}>
          <Text style={styles.link}>Create your account</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.link}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      {isBiometric && (
        <TouchableOpacity style={styles.fingerprint} onPress={handleBiometric}>
          <Entypo name="fingerprint" size={50} color="black" />
        </TouchableOpacity>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  loginBtn: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
  },
  googleBtn: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  googleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  linkRow: {
    marginTop: 15,
    alignItems: 'center',
  },
  link: {
    color: '#007AFF',
    marginTop: 8,
  },
  fingerprint: {
    marginTop: 40,
    alignItems: 'center',
  },
});
