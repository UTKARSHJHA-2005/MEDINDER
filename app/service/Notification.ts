import * as Notifications from "expo-notifications";

export async function scheduleMedicineNotification(med: {
  medName: string;
  selectedTime: number; // store as getTime()
  startDate: number;
  endDate: number;
}) {
  const medTime = new Date(med.selectedTime);
  const hour = medTime.getHours();
  const minute = medTime.getMinutes();

  let current = new Date(med.startDate);
  const end = new Date(med.endDate);
  current.setHours(0, 0, 0, 0);

  while (current <= end) {
    const trigger = new Date(
      current.getFullYear(),
      current.getMonth(),
      current.getDate(),
      hour,
      minute,
      0,
    );
    if (trigger > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `💊 ${med.medName}`,
          body: `Time to take your medication`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: trigger,
        },
      });
    }
    current.setDate(current.getDate() + 1);
  }
}
