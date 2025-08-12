import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Auth } from '../config/db';
const { width } = Dimensions.get('window');

interface Props {
  onClose: () => void;
}

GoogleSignin.configure({
  webClientId: "70506501293-b2pi75ees1234u0bb6ls9iac3g7iuoej.apps.googleusercontent.com",
})


export default function Options({ onClose }: Props) {
  const slideAnim = useRef(new Animated.Value(width)).current;
  const route = useRouter()
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  const handleLogout = async () => {
    try {
      await Auth.signOut(); 
      console.log("Firebase sign-out successful");
      route.replace('/login/login')
    } catch (error) {
      console.error("Error signing out from Firebase:", error);
    }

    try {
      await GoogleSignin.signOut();
      console.log("Google sign-out successful");
      route.replace('/login/login')
    } catch (error) {
      console.error("Error signing out from Google:", error);
    }
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <Text onPress={() => route.push('/(tabs)')} style={styles.item}>Home</Text>
        <Text onPress={() => route.push('/pages/History')} style={styles.item}>History</Text>
        <Text onPress={handleLogout} style={styles.item}>Logout</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backdrop: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '70%',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  item: {
    fontSize: 18,
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
});
