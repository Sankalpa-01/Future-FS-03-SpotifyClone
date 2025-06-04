import React, { useEffect, useRef, useState } from "react";
import { SongData } from "../context/Song";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay } from "react-icons/fa";

const Player = () => {
  const {
    song,
    fetchSingleSong,
    selectedSong,
    isPlaying,
    setIsPlaying,
    nextMusic,
    prevMusic,
  } = SongData();

  const audioRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Fetch song when selectedSong changes
  useEffect(() => {
    fetchSingleSong();
  }, [selectedSong]);

  // Control playback based on isPlaying
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((e) => console.warn("Playback failed:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Setup metadata and progress tracking
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetaData = () => setDuration(audio.duration || 0);
    const handleTimeUpdate = () => setProgress(audio.currentTime);

    audio.addEventListener("loadedmetadata", handleLoadedMetaData);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [song]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div>
      {song && song.audio && (
        <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
          {/* Song Info */}
          <div className="lg:flex items-center gap-4">
            <img
              src={
                song.thumbnail ? song.thumbnail.url : "https://via.placeholder.com/50"
              }
              alt="Thumbnail"
              className="w-12 h-12 object-cover rounded"
            />
            <div className="hidden md:block">
              <p className="font-semibold">{song.title}</p>
              <p className="text-sm text-gray-400">
                {song.description ? song.description.slice(0, 30) + "..." : ""}
              </p>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex flex-col items-center gap-1 m-auto">
            <audio ref={audioRef} src={song.audio.url} />

            <input
              type="range"
              min={0}
              max={100}
              value={duration ? (progress / duration) * 100 : 0}
              onChange={handleProgressChange}
              className="progress-bar w-[120px] md:w-[300px] text-green-400"
            />

            <div className="flex items-center gap-4">
              <button onClick={prevMusic} className="text-xl">
                <GrChapterPrevious />
              </button>

              <button
                onClick={handlePlayPause}
                className="bg-white text-black rounded-full p-2"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <button onClick={nextMusic} className="text-xl">
                <GrChapterNext />
              </button>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 md:w-32"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
