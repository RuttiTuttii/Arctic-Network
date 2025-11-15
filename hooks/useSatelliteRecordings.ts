import { useState, useEffect } from "react";

export interface Recording {
  id: string;
  satellite: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  resolution: string;
  duration: string;
  status: "live" | "archived";
  createdAt: string;
}

export function useSatelliteRecordings() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        // Use local API proxy
        const response = await fetch(`/api/recordings`);

        if (!response.ok) {
          throw new Error("Failed to fetch recordings");
        }

        const data = await response.json();
        setRecordings(data.recordings);
      } catch (err) {
        console.error("Error fetching recordings:", err);
        setError(err instanceof Error ? err.message : "Unknown error");

        // Fallback to mock data with local video paths
        const mockRecordings: Recording[] = [
          {
            id: "1",
            satellite: "ARCTIC-1",
            title: "Спутниковое наблюдение - Оптический канал 1",
            videoUrl: "/videos/optic1.mp4",
            thumbnail: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop",
            resolution: "4K",
            duration: "23:45",
            status: "archived",
            createdAt: new Date(Date.now() - 0 * 60000).toISOString(),
          },
          {
            id: "2",
            satellite: "POLAR-2",
            title: "Спутниковое наблюдение - Оптический канал 2",
            videoUrl: "/videos/optic2.mp4",
            thumbnail: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=200&fit=crop",
            resolution: "4K",
            duration: "18:30",
            status: "archived",
            createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
          },
          {
            id: "3",
            satellite: "CLIMATE-3",
            title: "Наблюдение с земли - Наземная станция",
            videoUrl: "/videos/earthrobot.mp4",
            thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop",
            resolution: "4K",
            duration: "15:22",
            status: "archived",
            createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
          },
          {
            id: "4",
            satellite: "MONITOR-4",
            title: "Мониторинг океана - Плавучий буй",
            videoUrl: "/videos/waterdron.mp4",
            thumbnail: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=200&fit=crop",
            resolution: "4K",
            duration: "21:15",
            status: "archived",
            createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
          },
        ];
        setRecordings(mockRecordings);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecordings();
  }, []);

  return { recordings, isLoading, error };
}
