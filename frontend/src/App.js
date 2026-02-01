import { useState, useRef, useEffect } from "react";
import "@/App.css";
import { Play, Pause, Heart, Repeat, Square } from "lucide-react";

const COUPLE_IMAGE = "https://customer-assets.emergentagent.com/job_473e0eb1-06d1-4804-b399-e0ac295e72d1/artifacts/audl2xnb_WhatsApp%20Image%202026-02-01%20at%2019.04.22.jpeg";
const AUDIO_FILE = "/valentine-audio.m4a";

function App() {
  const [accepted, setAccepted] = useState(false);
  const [noMessage, setNoMessage] = useState("");
  const [yesPosition, setYesPosition] = useState({ top: "50%", left: "50%" });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const audioRef = useRef(null);

  const moveYesButton = () => {
    const maxX = 80;
    const maxY = 70;
    const minX = 10;
    const minY = 20;
    
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomY = Math.random() * (maxY - minY) + minY;
    
    setYesPosition({
      top: `${randomY}%`,
      left: `${randomX}%`
    });
  };

  const handleYesClick = () => {
    setAccepted(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 500);
  };

  const handleNoClick = () => {
    setNoMessage("Try again! 💜");
    setTimeout(() => setNoMessage(""), 2000);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const toggleRepeat = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isRepeat;
      setIsRepeat(!isRepeat);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const clickX = e.nativeEvent.offsetX;
    const width = progressBar.offsetWidth;
    const newTime = (clickX / width) * duration;
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (accepted && audioRef.current) {
      const audio = audioRef.current;
      
      const handleError = (e) => {
        console.log('Audio playback info:', e);
        // Set default duration for display
        setDuration(15);
      };
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('error', handleError);
      audio.addEventListener('canplaythrough', () => {
        console.log('Audio ready to play');
      });
      
      return () => {
        if (audio) {
          audio.removeEventListener('timeupdate', handleTimeUpdate);
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audio.removeEventListener('error', handleError);
        }
      };
    }
  }, [accepted]);

  if (accepted) {
    return (
      <div className="success-container" data-testid="success-screen">
        <div className="hearts-background">
          {[...Array(20)].map((_, i) => (
            <Heart
              key={i}
              className="floating-heart"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        <div className="success-content">
          <h1 className="success-title" data-testid="success-message">She said YES! 💜</h1>
          
          <div className="image-container" data-testid="couple-image-container">
            <img 
              src={COUPLE_IMAGE} 
              alt="Our beautiful moment" 
              className="couple-image"
            />
          </div>

          <div className="audio-player" data-testid="audio-player">
            <button 
              className="play-button" 
              onClick={togglePlayPause}
              data-testid="play-pause-button"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <div className="progress-container">
              <span className="time-display" data-testid="current-time">{formatTime(currentTime)}</span>
              <div 
                className="progress-bar" 
                onClick={handleSeek}
                data-testid="progress-bar"
              >
                <div 
                  className="progress-fill" 
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <div 
                  className="progress-thumb" 
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <span className="time-display" data-testid="duration">{formatTime(duration)}</span>
            </div>
          </div>

          <audio ref={audioRef} preload="auto">
            <source src={AUDIO_FILE} type="audio/mp4" />
            <source src={AUDIO_FILE} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    );
  }

  return (
    <div className="App" data-testid="valentine-proposal">
      <div className="question-container">
        <h1 className="question-title" data-testid="proposal-question">
          Would you like to be my valentine?
        </h1>
        
        <div className="buttons-area">
          <button
            className="yes-button"
            onClick={handleYesClick}
            onMouseEnter={moveYesButton}
            style={{
              position: 'absolute',
              top: yesPosition.top,
              left: yesPosition.left,
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.5s ease'
            }}
            data-testid="yes-button"
          >
            YES 💜
          </button>

          <button
            className="no-button"
            onClick={handleNoClick}
            data-testid="no-button"
          >
            No
          </button>
        </div>

        {noMessage && (
          <p className="no-message" data-testid="try-again-message">{noMessage}</p>
        )}
      </div>
    </div>
  );
}

export default App;
