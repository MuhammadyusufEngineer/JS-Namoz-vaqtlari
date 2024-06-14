// chrome.alarms.create("10MinuteNotification", {
//   periodInMinutes: 1
// });

// chrome.alarms.onAlarm.addListener(function() {
//   if (alarm.name === "10MinuteNotification") {
//     let options = {
//       type: "basic",
//       title: "10 Minute Notification",
//       message: "It's been 10 minutes!",
//       iconUrl: "./assets/img/mat3.png"
//     };
//   }

//       let audio = new Audio('Takbir.mp3')
//       audio.play()
// });
function createNotification() {
  // Define the notification options
  const options = {
    type: 'basic',
    title: 'My Notification',
    message: 'This is my notification message!',
    iconUrl: './assets/img/mat3.png',
    requireInteraction: true,
    silent: false
  };

  // Play a notification sound
  const audio = new Audio('./assets/Takbir.mp3');
  audio.play();

  // Create the notification
  chrome.notifications.create('myNotification', options);
}

// Call createNotification initially to create the first notification
createNotification();

// Call createNotification every minute to create subsequent notifications
setInterval(createNotification, 60000); // 60000 milliseconds = 1 minute