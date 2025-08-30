// src/context/NotificationContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "../../hooks/useAuth";

const BASE_URL = "https://localhost:7242";
const SERVER_URL =
  "https://inkwavelibrary-f3akhdacesa4hgg8.southeastasia-01.azurewebsites.net";

type Notification = {
  message: string;
  type: string;
  createdAt: number;
};

type NotificationContextType = {
  notifications: Notification[];
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { auth } = useAuth();

  useEffect(() => {
    if (!auth?.accessToken) return;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${SERVER_URL}/hubs/notification`, {
        accessTokenFactory: () => auth.accessToken,
        transport:
          signalR.HttpTransportType.WebSockets |
          signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .catch((err: any) => console.error("SignalR connection failed:", err));

    connection.on("ReceiveNotification", (notification: Notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    return () => {
      connection.stop();
    };
  }, [auth?.accessToken]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
