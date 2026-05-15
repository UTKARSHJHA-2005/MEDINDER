import * as Notifications from "expo-notifications";

export async function scheduleMedicineNotification(med: any) {
  const [hour, minute] = med.reminder.split(":").map(Number);

  let currentDate = new Date(med.startDate);
  const endDate = new Date(med.endDate);

  currentDate.setHours(0, 0, 0, 0);

  while (currentDate <= endDate) {
    const trigger = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      hour,
      minute,
    );

    if (trigger > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "💊 Medicine Reminder",
          body: `Time to take ${med.medName}`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: trigger,
        },
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
}
