import { useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext.jsx';

export const useSocketEvent = (event, callback) => {
  const { on, off } = useSocket();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (...args) => callbackRef.current(...args);
    on(event, handler);
    return () => off(event, handler);
  }, [event, on, off]);
};

export const useSocketConnection = () => {
  const { isConnected, socket } = useSocket();
  return { isConnected, socket };
};