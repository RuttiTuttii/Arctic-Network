import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Download, Share2, Calendar, Satellite, Clock } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useSatelliteRecordings } from "../hooks/useSatelliteRecordings";

export function SatelliteRecordings() {
  const { language } = useLanguage();
  const isRussian = language === "ru";
  const { recordings, isLoading } = useSatelliteRecordings();

  const translateTitle = (title: string) => {
    const translations: Record<string, string> = {
      "Спутниковое наблюдение - Оптический канал 1": "Satellite Observation - Optical Channel 1",
      "Спутниковое наблюдение - Оптический канал 2": "Satellite Observation - Optical Channel 2",
      "Наблюдение с земли - Наземная станция": "Ground Observation - Ground Station",
      "Мониторинг океана - Плавучий буй": "Ocean Monitoring - Floating Buoy",
    };
    return isRussian ? title : (translations[title] || title);
  };
  const [selectedRecording, setSelectedRecording] = useState<(typeof recordings)[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(100);

  useEffect(() => {
    if (recordings.length > 0 && !selectedRecording) {
      setSelectedRecording(recordings[0]);
    }
  }, [recordings, selectedRecording]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!selectedRecording || recordings.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl text-center">
        <p className="text-neutral-400">
          {isRussian ? "Нет доступных записей" : "No recordings available"}
        </p>
      </div>
    );
  }

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("ru-RU");
  };

  const formatTime = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  const formatTimeLength = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Main video player */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl overflow-hidden"
      >
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video player */}
          <div className="lg:col-span-2">
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-video group">
              {isPlaying ? (
                <video
                  src={selectedRecording.videoUrl}
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={selectedRecording.thumbnail}
                  alt="Recording thumbnail"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {/* Play overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors"
                  >
                    <Play className="w-10 h-10 text-white ml-1" />
                  </motion.button>
                </div>
              )}

              {/* Video info overlay */}
              {!isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-xs text-orange-400 uppercase tracking-wider">
                      {selectedRecording.satellite}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{translateTitle(selectedRecording.title)}</h3>
                </div>
              )}

              {/* Resolution badge */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-sm font-semibold">
                {selectedRecording.resolution}
              </div>
            </div>

            {/* Player controls */}
            <div className="mt-4 space-y-4">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer group"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percentage = (e.clientX - rect.left) / rect.width;
                      setCurrentTime(percentage * duration);
                    }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                      whileHover={{ height: 4 }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>{formatTimeLength(currentTime)}</span>
                  <span>{selectedRecording.duration}</span>
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title={isRussian ? "Воспроизведение" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title={isRussian ? "Звук" : "Volume"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </motion.button>

                  <span className="text-xs text-neutral-500 ml-2">
                    {selectedRecording.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title={isRussian ? "Поделиться" : "Share"}
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title={isRussian ? "Скачать" : "Download"}
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title={isRussian ? "На весь экран" : "Fullscreen"}
                  >
                    <Maximize className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Recording details sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-2xl p-4 mb-4">
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                    {isRussian ? "Спутник" : "Satellite"}
                  </div>
                  <div className="flex items-center gap-2 text-lg">
                    <Satellite className="w-5 h-5 text-orange-500" />
                    {selectedRecording.satellite}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                    {isRussian ? "Дата записи" : "Recording Date"}
                  </div>
                  <div className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    {formatDate(selectedRecording.createdAt)}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                    {isRussian ? "Время" : "Time"}
                  </div>
                  <div className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-orange-500" />
                    {formatTime(selectedRecording.createdAt)}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                    {isRussian ? "Статус" : "Status"}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="capitalize">
                      {selectedRecording.status === "live"
                        ? isRussian ? "В ПРЯМОМ ЭФИРЕ" : "LIVE"
                        : isRussian ? "АРХИВ" : "ARCHIVED"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info box */}
            <div className="bg-gradient-to-br from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-2xl p-4">
              <h4 className="text-sm font-semibold mb-2">
                {isRussian ? "Параметры записи" : "Recording Details"}
              </h4>
              <ul className="text-xs text-neutral-400 space-y-2">
                <li>• {isRussian ? "Разрешение:" : "Resolution:"} {selectedRecording.resolution}</li>
                <li>• {isRussian ? "Формат:" : "Format:"} MP4</li>
                <li>• {isRussian ? "Кодек видео:" : "Video codec:"} H.264</li>
                <li>• {isRussian ? "Кодек аудио:" : "Audio codec:"} AAC</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recordings list */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl">
        <h3 className="text-xl mb-6">
          {isRussian ? "Последние записи" : "Recent Recordings"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recordings.map((recording, idx) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedRecording(recording)}
              className={`group cursor-pointer rounded-2xl overflow-hidden transition-all ${
                selectedRecording?.id === recording.id
                  ? "ring-2 ring-orange-500 scale-105"
                  : ""
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={recording.thumbnail}
                  alt={recording.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors"
                  >
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </motion.button>
                </div>

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-xs text-neutral-300 mb-1 truncate">
                    {translateTitle(recording.title)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>{recording.duration}</span>
                    <span>{formatDate(recording.createdAt)}</span>
                  </div>
                </div>

                {/* Status badge */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-semibold">
                  {recording.satellite}
                </div>

                {/* Resolution badge */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-semibold">
                  {recording.resolution}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
