"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { subscribeUser } from "@/server/actions/webpush.action";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export default function PushNotification() {
  const [permission, setPermission] = useState<string | null>(null);
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);

  useEffect(() => {
    const handleNotificationPermission = async () => {
      if (typeof Notification !== 'undefined') {
        const currentPermission = Notification.permission;
        setPermission(currentPermission);

        if (currentPermission === 'default') {
          const newPermission = await Notification.requestPermission();
          setPermission(newPermission);

          if (newPermission === 'granted') {
            await registerServiceWorker();
          } else {
            console.error('Notification permission denied');
          }
        } else if (currentPermission === 'granted') {
          await registerServiceWorker();
        }
      }
    };

    handleNotificationPermission();
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      if (navigator.serviceWorker.controller) {
        setIsServiceWorkerReady(true);
      } else {
        // Wait for service worker to be installed
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setIsServiceWorkerReady(true);
              }
            };
          }
        };
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  useEffect(() => {
    const subscribeToPush = async () => {
      if (isServiceWorkerReady) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: VAPID_PUBLIC_KEY,
          });

          const res = await subscribeUser(sub.toJSON());
          console.log('Subscription successful:', res.success);
        } catch (error) {
          console.error('Push subscription failed:', error);
        }
      }
    };

    subscribeToPush();
  }, [isServiceWorkerReady]);

  return (
    <div>
      {permission === 'denied' ? (
        <div style={{ color: 'red' }}>
          <p>Notifications are blocked. Please enable them in your browser settings.</p>
          <p>To enable notifications, go to your browser settings and allow notifications for this site.</p>
        </div>
      ) : permission === 'default' ? (
        <Button onClick={() => Notification.requestPermission().then(setPermission)}>
          Allow Notifications
        </Button>
      ) : null}
    </div>
  );
}
