import { io, Socket } from 'socket.io-client';
import { useAuthStore } from './store/auth';

const wsURL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3333';

let socket: Socket | null = null;
const subscriptions = new Set<string>();

export const initSocket = () => {
  const authStore = useAuthStore.getState();
  if (!authStore.accessToken) return null;

  if (socket?.connected) return socket;

  socket = io(wsURL, {
    auth: {
      token: authStore.accessToken,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    subscriptions.forEach((locationId) => {
      socket?.emit('subscribeLocation', locationId);
    });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const subscribeToLocation = (locationId: string) => {
  subscriptions.add(locationId);
  if (socket?.connected) {
    socket.emit('subscribeLocation', locationId);
  }
};

export const unsubscribeFromLocation = (locationId: string) => {
  subscriptions.delete(locationId);
  if (socket?.connected) {
    socket.emit('unsubscribeLocation', locationId);
  }
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
