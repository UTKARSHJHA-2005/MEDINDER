import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Auth } from '../config/db';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import { getApp } from 'firebase/app';
import { setstorage } from '../service/Storage';
import { signInWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Entypo } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as LocalAuthentication from 'expo-local-authentication'
// import auth from '@react-native-firebase/auth';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: "70506501293-b2pi75ees1234u0bb6ls9iac3g7iuoej.apps.googleusercontent.com",
})
const Login = () => {
  // const app = getApp();
  // const auth = getAuth(app);
  const router = useRouter();
  const [isBiometric, setIsBiometric] = useState(false);
  const [username, setUsername] = useState('');
  const route = useRouter()
  const [userinfo, setuserinfo] = useState<any>(null);
  const [password, setPassword] = useState('');
  const CLIENT_ID = "521789138294-lg66qlkesrnevf1crb3n8a9sbfaihq1v.apps.googleusercontent.com";

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
      const userCredential = await signInWithEmailAndPassword(Auth, username, password);
      await setstorage('userDetail', userCredential.user);
      console.log("Logged in successfully:", userCredential.user);
      router.replace('/(tabs)');
    } else {
      Alert.alert('Biometric login failed');
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(Auth, username, password);
      router.replace('/(tabs)');
      await setstorage('userDetail', userCredential.user);
      console.log("Logged in successfully:", userCredential.user);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
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
    color: 'black',
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
