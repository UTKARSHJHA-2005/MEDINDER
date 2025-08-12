import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { getStorage } from '../service/Storage';
import TabOneScreen from '../(tabs)/index';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,  // still required for backwards compat
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true, // ✅ new in recent versions
    shouldShowList: true,
  }),
});

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const getuser = async () => {
    const userinfo = await getStorage('userDetail')
    console.log(userinfo)
    if (!userinfo) {
      router.push('/login/login')
    }
  }
  useEffect(() => {
    getuser()
  }, []);

  return (
    <TabOneScreen />
  );
}