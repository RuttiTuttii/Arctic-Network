import { useState, useEffect, useRef, useCallback } from "react";

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

/**
 * Hook for WebSocket real-time data streaming
 * Not currently required - REST polling via useDashboardData is sufficient
 * This is prepared for future optimization to WebSocket
 */
export const useDashboardWebSocket = (url: string, reconnectInterval = 3000) => {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setError(null);

        // Send subscription message
        ws.send(
          JSON.stringify({
            type: "subscribe",
            channel: "dashboard",
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          if (message.type === "dashboard_update") {
            setData(message.data);
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      ws.onerror = () => {
        setError("WebSocket error occurred");
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);

        // Attempt to reconnect
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect WebSocket...");
          connect();
        }, reconnectInterval);
      };

      wsRef.current = ws;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    }
  }, [url, reconnectInterval]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  const send = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, [isConnected]);

  return { isConnected, data, error, send };
};

/**
 * Hook for streaming metric updates with auto-reconnect
 * Alternative to useDashboardData with lower latency
 */
export const useMetricStream = (_metricType: string, _wsUrl: string) => {
  // Placeholder for future WebSocket implementation
  return {
    metric: null,
    isConnected: false,
    error: "WebSocket streaming not yet implemented",
  };
};
