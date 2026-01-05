import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import type { Track, Playlist } from '../../store/api/music-player/types';

interface MusicPlayerProps {
  playlist: Playlist;
  onTrackChange?: (track: Track) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ playlist, onTrackChange }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); //eslint-disable-line
  const [duration, setDuration] = useState(0); //eslint-disable-line
  const [volume, setVolume] = useState(1); //eslint-disable-line
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = playlist.tracks[currentTrackIndex]?.track;

  useEffect(() => {
    if (currentTrack && onTrackChange) {
      onTrackChange(currentTrack);
    }
  }, [currentTrack, onTrackChange]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentTrackIndex < playlist.tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return <div>No tracks available</div>;
  }

  return (
    <PlayerContainer>
      <PlayerHeader>Section Demo:</PlayerHeader>
      
      <MainPlayer>
        <PlayerTitle>PLAYLIST MODAL</PlayerTitle>
        
        <CurrentTrackSection>
          <AlbumArt src={currentTrack.albumArt || '/default-album-art.jpg'} alt="Album Art" />
          
          <TrackInfo>
            <TrackTitle>{currentTrack.title}</TrackTitle>
            <TrackArtist>{currentTrack.artist}</TrackArtist>
            
            <TimeDisplay>
              {formatTime(currentTime)} / {formatTime(duration)}
            </TimeDisplay>
            
            <Controls>
              <ControlButton onClick={handlePrevious}>
                <SkipBack size={20} />
              </ControlButton>
              
              <PlayButton onClick={togglePlay}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </PlayButton>
              
              <ControlButton onClick={handleNext}>
                <SkipForward size={20} />
              </ControlButton>
              
              <VolumeButton onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </VolumeButton>
            </Controls>
          </TrackInfo>
        </CurrentTrackSection>
        
        <PlaylistSection>
          <PlaylistTitle>{playlist.name || "WEBEXP's Playlist"}</PlaylistTitle>
          <TrackList>
            {playlist.tracks.map((playlistTrack, index) => (
              <TrackItem 
                key={playlistTrack.id}
                isActive={index === currentTrackIndex}
                onClick={() => handleTrackSelect(index)}
              >
                <TrackAlbumArt src={playlistTrack.track.albumArt || '/default-album-art.jpg'} alt="Track Art" />
                <TrackItemInfo>
                  <TrackItemTitle>{playlistTrack.track.title}</TrackItemTitle>
                  <TrackItemArtist>{playlistTrack.track.artist}</TrackItemArtist>
                </TrackItemInfo>
                <TrackDuration>
                  {playlistTrack.track.duration ? formatTime(playlistTrack.track.duration) : '--:--'}
                </TrackDuration>
              </TrackItem>
            ))}
          </TrackList>
        </PlaylistSection>
      </MainPlayer>
      
      <MiniPlayerBar>
        <MiniPlayerText>MINI MUSIC BAR</MiniPlayerText>
      </MiniPlayerBar>
      
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </PlayerContainer>
  );
};

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const PlayerHeader = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #000;
  margin: 0;
`;

const MainPlayer = styled.div`
  background: #f5f5f5;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const PlayerTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: #000;
  margin: 0 0 20px 0;
  text-align: center;
`;

const CurrentTrackSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
`;

const AlbumArt = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const TrackInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TrackTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #000;
  margin: 0;
`;

const TrackArtist = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const TimeDisplay = styled.span`
  font-size: 12px;
  color: #666;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  
  &:hover {
    background: #e0e0e0;
    color: #000;
  }
`;

const PlayButton = styled.button`
  background: #007bff;
  border: none;
  cursor: pointer;
  padding: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  width: 48px;
  height: 48px;
  
  &:hover {
    background: #0056b3;
  }
`;

const VolumeButton = styled(ControlButton)`
  margin-left: auto;
`;

const PlaylistSection = styled.div`
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
`;

const PlaylistTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin: 0 0 16px 0;
`;

const TrackList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const TrackItem = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  background: ${props => props.isActive ? '#e8f4fd' : 'transparent'};
  
  &:hover {
    background: ${props => props.isActive ? '#e8f4fd' : '#f0f0f0'};
  }
`;

const TrackAlbumArt = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
`;

const TrackItemInfo = styled.div`
  flex: 1;
`;

const TrackItemTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #000;
`;

const TrackItemArtist = styled.div`
  font-size: 12px;
  color: #666;
`;

const TrackDuration = styled.div`
  font-size: 12px;
  color: #666;
  font-family: monospace;
`;

const MiniPlayerBar = styled.div`
  background: #f0f0f0;
  padding: 12px 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const MiniPlayerText = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #000;
`;

export default MusicPlayer;
