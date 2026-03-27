const REMINDER_OFFSET_MS = 30 * 60 * 1000;

/** Check if the browser supports notifications */
export function supportsNotifications(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/** Request notification permission from the user */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!supportsNotifications()) return false;

  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const result = await Notification.requestPermission();
  return result === 'granted';
}

/** Show an immediate notification */
export function showNotification(title: string, body: string): void {
  if (!supportsNotifications() || Notification.permission !== 'granted') return;

  // Prefer service worker notifications (work when app is in background)
  if (navigator.serviceWorker?.ready) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification(title, {
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
      });
    });
    return;
  }

  // Fallback to regular notification
  new Notification(title, {
    body,
    icon: '/icons/icon-192x192.png',
  });
}

/** Show a booking confirmation notification */
export function showBookingConfirmation(facilityLabel: string, date: string, startTime: string): void {
  showNotification(
    'Rezervacija Poslana!',
    `${facilityLabel} — ${date} u ${startTime}. Čeka odobrenje.`,
  );
}

/** Schedule a reminder notification before a reservation */
export function scheduleReservationReminder(
  facilityLabel: string,
  date: string,
  startTime: string,
): void {
  if (!supportsNotifications() || Notification.permission !== 'granted') return;

  const [hours, minutes] = startTime.split(':').map(Number);
  const reservationDate = new Date(`${date}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
  const reminderTime = reservationDate.getTime() - REMINDER_OFFSET_MS;
  const delay = reminderTime - Date.now();

  // Only schedule if the reminder is in the future
  if (delay <= 0) return;

  setTimeout(() => {
    showNotification(
      'Podsjetnik za rezervaciju',
      `${facilityLabel} počinje za 30 minuta (${startTime})`,
    );
  }, delay);
}

/** Register the service worker for PWA notifications */
export async function registerServiceWorker(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  try {
    await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });
  } catch {
    // Service worker registration failed — notifications will use fallback
  }
}
