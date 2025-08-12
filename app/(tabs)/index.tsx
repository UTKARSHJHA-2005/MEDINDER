import { StyleSheet } from 'react-native';
import Header from '../components/Header';
import { useRouter } from 'expo-router';
import Med from '../components/Med';
import { Stack } from 'expo-router';

export default function TabOneScreen() {
  const route = useRouter();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <Med/>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  img: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 100,
  },
  btn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
