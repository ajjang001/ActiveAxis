import * as Notifications from 'expo-notifications';

class DisplayNotificationPresenter {
  constructor(view) {
    this.view = view;
  }

  async requestNotificationPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
        throw new Error('Please enable notifications to receive reminders!');
    }
  }

  async notificationHander() {
    try{
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            }),
        });

    }catch(error){
      throw new Error(error);
    }
  }

  async scheduleNotification() {
    try{
        this.requestNotificationPermissions();
        console.log("Notification permission granted!");

        this.notificationHander();
        console.log("Notification handler set!");

        await Notifications.cancelAllScheduledNotificationsAsync();

        const time = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];

        for (let i = 0; i < time.length; i++) {
            const trigger = new Date(Date.now());
            trigger.setHours(parseInt(time[i].split(":")[0]));
            trigger.setMinutes(parseInt(time[i].split(":")[1]));
            trigger.setSeconds(0);

            const content = {
                title: "Balance Your Workout!",
                body: "If you haven't exercised today, it's time to get moving! If you've been active for a while, don't forget to take a break and rest. Find your balance for a healthier you!",
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
            };

            await Notifications.scheduleNotificationAsync({
                content,
                trigger,
            });
        }

        console.log("Notification scheduled successfully!");


    }catch(error){
      throw new Error(error);
    }
  }
  

}

export default DisplayNotificationPresenter;