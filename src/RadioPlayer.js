import React, { useState, useRef, useEffect } from 'react'; 
const stations = {
  Antyradio: 'http://redir.atmcdn.pl/sc/o2/Eurozet/live/antyradio.livx',
  RMF_FM: 'http://www.miastomuzyki.pl/n/rmffm.pls',
  Radio_ZET: 'https://n-16-10.dcs.redcdn.pl/sc/o2/Eurozet/live/audio.livx'
};

const RadioPlayer = () => { 
const [isPlaying, setIsPlaying] = useState(false); 
const [volume, setVolume] = useState(1); 
  const [currentStation, setCurrentStation] = useState(Object.keys(stations)[0]); 
  const [currentDateTime, setCurrentDateTime] = useState(new Date()); 
  const audioRef = useRef(null); 
 
  useEffect(() => { 
    audioRef.current = new Audio(stations[currentStation]); 
    audioRef.current.volume = volume; 
 
    const timer = setInterval(() => { 
      setCurrentDateTime(new Date()); 
    }, 1000); 
 
    return () => clearInterval(timer); 
  }, []); 
 
  useEffect(() => { 
    if (audioRef.current) { 
      audioRef.current.pause(); 
      audioRef.current = new Audio(stations[currentStation]); 
      audioRef.current.volume = volume; 
      if (isPlaying) { 
        audioRef.current.play(); 
      } 
    } 
  }, [currentStation]); 
 
  const togglePlayPause = () => { 
    if (isPlaying) { 
      audioRef.current.pause(); 
    } else { 
      audioRef.current.play(); 
    } 
    setIsPlaying(!isPlaying); 
  }; 
 
  const handleVolumeChange = (e) => { 
    const newVolume = parseFloat(e.target.value); 
    setVolume(newVolume); 
    if (audioRef.current) { 
      audioRef.current.volume = newVolume; 
    } 
  }; 
 
  return ( 
    <div className="radio-player"> 
      <h2>Odtwarzacz Radiowy</h2> 
      <select value={currentStation} onChange={(e) => setCurrentStation(e.target.value)}> 
        {Object.keys(stations).map((station) => ( 
          <option key={station} value={station}> 
            {station} 
          </option> 
        ))} 
      </select> 
      <button onClick={togglePlayPause}> 
        {isPlaying ? 'Pauza' : 'Odtwórz'} 
      </button> 
      <div> 
        <label>Głośność: </label> 
        <input type="range" min="0" max="1" step="0.01" value={volume} 
onChange={handleVolumeChange} /> 
      </div> 
      <div className="date-time"> 
        <p>Data: {currentDateTime.toLocaleDateString()}</p> 
        <p>Godzina: {currentDateTime.toLocaleTimeString()}</p> 
      </div> 
    </div> 
  ); 
}; 
 
export default RadioPlayer; 