import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform, Alert,
  SafeAreaView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack } from 'expo-router';
import { getStorage } from '../service/Storage';
import { doc, setDoc } from 'firebase/firestore';
import { store } from '../config/db';
import { useRouter } from 'expo-router';

export default function AddMed() {
  const [medName, setMedName] = useState('');
  const [type, setType] = useState('');
  const [dose, setDose] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const route = useRouter()
  const medTypes = ['Tablet', 'Capsule', 'Drops', 'Syrup', 'Injection'];
  const reminder = new Date(selectedTime.getTime() - 30 * 60000);
  const hours = reminder.getHours().toString().padStart(2, '0');
  const minutes = reminder.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  const handleSave = async () => {
    const docid = Date.now().toString();
    const user = await getStorage('userDetail')
    if (!(medName && type && dose && selectedTime && startDate)) {
      Alert.alert('Please fill all the fields')
      return;
    }
    console.log(user)
    try {
      await setDoc(doc(store, 'medicine', docid), {
        medName,
        type,
        dose,
        selectedTime:selectedTime.getTime(),
        startDate:startDate.toLocaleDateString('en-CA'),
        endDate:endDate.toLocaleDateString('en-CA'),
        userId: user.uid,
        reminder: formattedTime,
        user: user.email
      })
      Alert.alert('Medication saved successfully')
      route.push('/(tabs)')
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>💊 Add Medication</Text>
          <Text style={styles.subtitle}>Keep track of your health</Text>
        </View>

        {/* Medication Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>MEDICATION NAME</Text>
          <TextInput style={styles.input} placeholder="Enter medication name" placeholderTextColor="#a0aec0" value={medName} onChangeText={setMedName} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>TYPE</Text>
          <View style={styles.typeContainer}>
            {medTypes.map((item) => (
              <TouchableOpacity key={item}
                style={[
                  styles.typeBtn,
                  type === item && styles.typeBtnSelected,
                ]} onPress={() => setType(item)} activeOpacity={0.7}>
                <Text style={[
                  styles.typeBtnText,
                  type === item && styles.typeBtnTextSelected
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>DOSAGE</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2 tablets, 15ml"
            placeholderTextColor="#a0aec0"
            value={dose}
            onChangeText={setDose}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>WHEN TO TAKE</Text>
          <View style={styles.timeGroup}>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timeBox} activeOpacity={0.7}>
              <Text style={styles.timeText}>
                {selectedTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.dateRow}>
          <View style={styles.dateGroup}>
            <Text style={styles.label}>START DATE</Text>
            <TouchableOpacity
              onPress={() => setShowStart(true)}
              style={styles.dateBox}
              activeOpacity={0.7}
            >
              <Text style={styles.dateText}>
                {startDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dateGroup}>
            <Text style={styles.label}>END DATE</Text>
            <TouchableOpacity
              onPress={() => setShowEnd(true)}
              style={styles.dateBox}
              activeOpacity={0.7}
            >
              <Text style={styles.dateText}>
                {endDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Pickers */}
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(Platform.OS === 'ios');
              if (selectedTime) setSelectedTime(selectedTime);
            }}
          />
        )}

        {showStart && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStart(Platform.OS === 'ios');
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}

        {showEnd && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEnd(Platform.OS === 'ios');
              if (selectedDate) setEndDate(selectedDate);
            }}
          />
        )}
        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>Save Medication</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4a5568',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#2d3748',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  typeBtnSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
    shadowColor: '#667eea',
    shadowOpacity: 0.3,
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
  },
  typeBtnTextSelected: {
    color: '#ffffff',
  },
  timeGroup: {
    marginTop: 12,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 8,
  },
  timeBox: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timeText: {
    fontSize: 18,
    color: '#667eea',
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  dateGroup: {
    flex: 1,
  },
  dateBox: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  dateText: {
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '500',
  },
  reminderBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#cbd5e0',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  reminderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  saveBtn: {
    backgroundColor: '#667eea',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});