import { useState, useEffect, useCallback } from "react";

interface MetricData {
  value: number;
  min: number;
  max: number;
  change_24h: number;
  trend: "up" | "down" | "stable";
}

interface DashboardData {
  temperature: MetricData;
  ice_coverage: MetricData;
  pollution: MetricData;
  wildlife: MetricData;
  wind_speed: MetricData;
  sea_level: MetricData;
}

interface SatelliteStatus {
  active: number;
  status: string;
  coverage: number;
}

interface DashboardResponse {
  timestamp: string;
  data: DashboardData;
  satellites: SatelliteStatus;
}

interface HistoryPoint {
  data_type: string;
  value: number;
  timestamp: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const useDashboardData = (refreshInterval = 2000) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [satellites, setSatellites] = useState<SatelliteStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/dashboard`);
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      const data: DashboardResponse = await response.json();
      setDashboardData(data.data);
      setSatellites(data.satellites);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchDashboard, refreshInterval]);

  return { dashboardData, satellites, loading, error, refetch: fetchDashboard };
};

export const useMetricHistory = (metricType: string, limit = 60) => {
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/dashboard/history?type=${metricType}&limit=${limit}`
        );
        if (!response.ok) throw new Error("Failed to fetch history");
        const data = await response.json();
        setHistory(data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [metricType, limit]);

  return { history, loading, error };
};

export const useMetric = (metricType: string, refreshInterval = 2000) => {
  const [metric, setMetric] = useState<MetricData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetric = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/dashboard/metric/${metricType}`);
      if (!response.ok) throw new Error("Failed to fetch metric");
      const data = await response.json();
      setMetric({
        value: data.value,
        min: data.min_value,
        max: data.max_value,
        change_24h: data.change_24h,
        trend: data.trend,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [metricType]);

  useEffect(() => {
    fetchMetric();
    const interval = setInterval(fetchMetric, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchMetric, refreshInterval]);

  return { metric, loading, error, refetch: fetchMetric };
};
