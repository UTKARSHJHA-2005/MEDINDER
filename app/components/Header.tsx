import { StyleSheet, Text, Modal, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getStorage } from '../service/Storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import Options from '../components/Options';

const Header = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getUserDetail();
  }, []);

  const getUserDetail = async () => {
    const userInfo = await getStorage('userDetail');
    setUser(userInfo);
    console.log("User det:",userInfo)
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>👋 Welcome</Text>
        <TouchableOpacity onPress={() => setDrawerVisible(true)}>
          <Ionicons name="settings-outline" size={26} color="#f52828ff" />
        </TouchableOpacity>
        <Modal
          visible={drawerVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setDrawerVisible(false)}
        >
          <Options onClose={() => setDrawerVisible(false)} />
        </Modal>
      </View>
      {user ? (
        <Text style={styles.userText}>Hi, {user.displayName || user.name || user.givenName || 'User'}!</Text>
      ) : (
        <Text style={styles.loadingText}>Loading user...</Text>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 26,
    fontWeight: '600',
    color: 'black',
  },
  userText: {
    fontSize: 18,
    color: 'black',
  },
  loadingText: {
    fontSize: 16,
    color: 'black',
  },
});
