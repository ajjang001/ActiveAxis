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

  async scheduleNotification(calories, calTarget, steps, stepsTarget) {
    try{
        this.requestNotificationPermissions();
        console.log("Notification permission granted!");

        this.notificationHander();
        console.log("Notification handler set!");

        await Notifications.cancelAllScheduledNotificationsAsync();

        const time = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
        const title = (calories < calTarget) || (steps < stepsTarget) ? "Let's Exercise!" : "Great Work!";
        const body = (calories < calTarget) || (steps < stepsTarget) ? "You have not reached your daily target. Keep exercise and stay healthy!" : "You have reached your daily target! Please take a break and enjoy your day!";

        for (let i = 0; i < time.length; i++) {
            const trigger = new Date(Date.now());
            trigger.setHours(parseInt(time[i].split(":")[0]));
            trigger.setMinutes(parseInt(time[i].split(":")[1]));
            trigger.setSeconds(0);

            const content = {
                title: title,
                body: body,
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
  

//   async scheduleNotification(calories, calTarget, steps, stepsTarget) {
//     try{
//         const times = ["09:00", "12:00", "15:00", "18:00", "23:00"];

//         const title = calories < calTarget ? "Let's Exercise!" : "Great Work!";
//         const body = calories < calTarget ? "You have not reached your daily target. Keep exercise and stay healthy!" : "You have reached your daily target! Please take a break and enjoy your day!";

//         for (let i = 0; i < times.length; i++) {
//             const trigger = new Date(Date.now());
//             trigger.setHours(parseInt(times[i].split(":")[0]));
//             trigger.setMinutes(parseInt(times[i].split(":")[1]));
//             trigger.setSeconds(0);
    
//             const content = {
//                 title: title,
//                 body: body,
//                 sound: true,
//                 priority: Notifications.AndroidNotificationPriority.HIGH,
//             };
    
//             await Notifications.scheduleNotificationAsync({
//                 content,
//                 trigger,
//             });
//         }

//         console.log("Notification scheduled successfully!");
        
//     }catch(error){
//       throw new Error(error);
//     }
//   }

    
}

export default DisplayNotificationPresenter;