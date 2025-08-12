import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { store } from "../config/db";

// Show notifications in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

async function fetchMedicines() {
  const snapshot = await getDocs(collection(store, "medicine"));
  const meds: any[] = [];
  snapshot.forEach((doc) => {
    meds.push({ id: doc.id, ...doc.data() });
  });
  return meds;
}

async function scheduleMedicineReminders() {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    alert("Permission for notifications not granted!");
    return;
  }

  const medicines = await fetchMedicines();

  for (const med of medicines) {
    if (!med.reminder || !med.endDate) continue;

    const [hour, minute] = med.reminder.split(":").map(Number);

    // Handle Firestore Timestamp or string
    let endDate = med.endDate.toDate ? med.endDate.toDate() : new Date(med.endDate);

    // Start from today
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate <= endDate) {
      const triggerDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        hour,
        minute,
        0
      );

      if (triggerDate > new Date()) {
        console.log(`Scheduling ${med.name} for ${triggerDate}`);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "💊 Medicine Reminder",
            body: `Time to take your ${med.name}`,
            sound: true,
          },
          trigger: triggerDate as unknown as Notifications.NotificationTriggerInput, // works in SDK 48+ standalone builds
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
}

export default function NotificationManager() {
  useEffect(() => {
    scheduleMedicineReminders();
  }, []);

  return null;
}
