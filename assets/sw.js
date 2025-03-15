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

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        if (clientList.length > 0) {
            return clientList[0].focus();
        }
        })
    );
});
