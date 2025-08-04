// components/NotificationManager.tsx
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { getStorage } from '../service/Storage';
function getDatesBetween(start: string, end: string): Date[] {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates: Date[] = [];

    while (startDate <= endDate) {
        dates.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
    }

    return dates;
}

export default function NotificationManager() {
    useEffect(() => {
        const setup = async () => {
            const user = await getStorage('userDetail');
            const medicine: any = [];
            if (user) {
                const { collection, getDocs, query, where } = await import('firebase/firestore');
                const { store } = await import('../config/db');
                const q = query(collection(store, 'medicine'), where('userId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    medicine.push({
                        id: doc.id,
                        ...(doc.data() as Omit<any, 'id'>),
                    });
                });
            }
            for (const med of medicine) {
                const reminderTime = new Date(med.reminder);
                const dates = getDatesBetween(med.startDate, med.endDate);
                const hours = reminderTime.getHours();
                const minutes = reminderTime.getMinutes();
                for (let date of dates) {
                    const notifDate = new Date(date);
                    notifDate.setHours(hours);
                    notifDate.setMinutes(minutes);
                    notifDate.setSeconds(0);

                    if (notifDate > new Date()) {
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: `Take ${med.medName}`,
                                body: `Dose: ${med.dose || ''}`,
                            },
                            trigger: {
                                type: 'calendar',
                                year: notifDate.getFullYear(),
                                month: notifDate.getMonth() + 1,
                                day: notifDate.getDate(),
                                hour: notifDate.getHours(),
                                minute: notifDate.getMinutes(),
                                repeats: false,
                            } as Notifications.NotificationTriggerInput,
                        });
                    }
                }
            }
        };

        setup();
    }, []);

    return null;
}