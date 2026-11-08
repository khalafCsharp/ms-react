import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import {getAuthItem} from '@/common/interceptors'

export function useHubConnection(hubPath, handlers, onReconnected) {
  const handlersRef = useRef(handlers); // initialization is allowed
  const onReconnectedRef = useRef(onReconnected);

  // sync refs after each render, in an effect
  useEffect(() => {
    handlersRef.current = handlers;
    onReconnectedRef.current = onReconnected;
  });

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${hubPath}`, {
        accessTokenFactory: () => getAuthItem()?.accessToken ?? "",
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    Object.keys(handlersRef.current).forEach((eventName) => {
      connection.on(eventName, (...args) =>{
          console.log("📡 SIGNALR EVENT:", eventName, args);
          handlersRef.current[eventName]?.(...args);
      }
        ,
      );
    });

    connection.onreconnected(() => onReconnectedRef.current?.());

    let cancelled = false;
    connection.start().then(()=>{
       console.log("🟢 SIGNALR CONNECTED");
    }).catch((err) => {
      if (!cancelled) console.error("SignalR connection failed:", err);
    });

    return () => {
      cancelled = true;
      connection.stop();
    };
  }, [hubPath]);
}
