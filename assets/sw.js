self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated.');
});

self.addEventListener('push', (event) => {
    const options = {
        body: 'Your timer has reached 0.',
        icon: '/assets/icon.png', // Replace with your actual icon path
        badge: '/assets/badge.png', // Optional badge icon for notifications
        vibrate: [200, 100, 200], // Vibration pattern
        tag: 'timer-notification', // Ensures only one notification per timer
    };

    event.waitUntil(
        self.registration.showNotification('Countdown Finished!', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Close the notification
    // Open the app or navigate to a specific URL
    event.waitUntil(
      clients.openWindow('/your-path') // This could be your app's main page or a specific route
    );
});
