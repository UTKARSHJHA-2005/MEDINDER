import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { auth } from '../config/db';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { getStorage } from '../service/Storage';
import TabOneScreen from '../(tabs)/index';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const getuser=async()=>{
    const userinfo=await getStorage('userDetail')
    console.log(userinfo)
    if(!userinfo){
      router.push('/login/login')
    }
  }
  useEffect(() => {
    getuser()
  }, []);

  return (
    <TabOneScreen/>
  );
}