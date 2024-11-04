// Listen for messages from content or popup scripts
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "setPrayerAlarms" && message.prayerTimes) {
      setPrayerAlarms(message.prayerTimes);
  }
});

// Create alarms for each prayer time
function setPrayerAlarms(prayerTimes) {
  // Clear existing alarms
  chrome.alarms.clearAll();

  // Loop through prayer times to set alarms
  prayerTimes.forEach((time, index) => {
      const prayerName = ["Bomdod", "Quyosh", "Peshin", "Asr", "Shom", "Xufton"][index];

      // Set alarm time based on prayer time
      const alarmTime = new Date();
      const [hour, minute] = time.split(":");
      alarmTime.setHours(parseInt(hour), parseInt(minute), 0);

      // Calculate time left until the prayer time
      const timeLeft = alarmTime.getTime() - Date.now();
      if (timeLeft > 0) {
          chrome.alarms.create(prayerName, { when: Date.now() + timeLeft });
      }
  });
}

// Trigger notifications when an alarm goes off
chrome.alarms.onAlarm.addListener((alarm) => {
  const prayerName = alarm.name;
  const options = {
      type: 'basic',
      title: `${prayerName} Vaqti Keldi!`,
      message: `${prayerName} namozi vaqti kirib keldi.`,
      iconUrl: './assets/img/mat3.png',
      requireInteraction: true,
      silent: false
  };
  chrome.notifications.create(`${prayerName}Notification`, options);

  // Play sound for each prayer time
  const audio = new Audio('./assets/Takbir.mp3');
  audio.play();
});
