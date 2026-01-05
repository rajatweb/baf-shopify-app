import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Button,
  Text,
  BlockStack,
  InlineStack,
  Thumbnail,
  ProgressBar,
  Box,
} from "@shopify/polaris";
import {
  PlayIcon,
  PageIcon,
  TextIcon,
  HomeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@shopify/polaris-icons";
import type { Playlist, Track } from "../../store/api/music-player/types";

interface MusicPlayerProps {
  playlist: Playlist;
  onTrackChange?: (track: Track) => void;
  theme?: 'light' | 'dark';
  variant?: 'full' | 'mini';
  onClose?: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  playlist,
  onTrackChange,
  theme = 'light',
  variant = 'full',
  onClose,
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isExpanded, setIsExpanded] = useState(variant === 'full');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = playlist.tracks[currentTrackIndex]?.track;

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      onTrackChange?.(currentTrack);
    }
  }, [currentTrack, onTrackChange]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentTrackIndex < playlist.tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };



  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // const handleTrackClick = (index: number) => {
  //   setCurrentTrackIndex(index);
  // };

  // WEBEXP Logo Component
  const WebexpLogo = () => (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: `2px solid ${theme === 'light' ? '#000' : '#fff'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '8px',
        fontWeight: 'bold',
        background: theme === 'light' ? '#fff' : '#000',
        color: theme === 'light' ? '#000' : '#fff',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <div style={{ position: 'absolute', top: '2px', left: '50%', transform: 'translateX(-50%)' }}>E</div>
        <div style={{ position: 'absolute', right: '2px', top: '50%', transform: 'translateY(-50%)' }}>W</div>
        <div style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)' }}>B</div>
        <div style={{ position: 'absolute', left: '2px', top: '50%', transform: 'translateY(-50%)' }}>P</div>
      </div>
    </div>
  );

  if (variant === 'mini') {
    return (
      <Card>
        <Box padding="300">
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="300" blockAlign="center">
              <WebexpLogo />
              <BlockStack gap="100">
                <Text variant="bodyMd" fontWeight="semibold" as="p">
                  {currentTrack?.title || "Your Track Name"}
                </Text>
                <Text variant="bodySm" tone="subdued" as="p">
                  WEBEXP
                </Text>
              </BlockStack>
            </InlineStack>
            
            <InlineStack gap="200">
              <Button
                icon={TextIcon}
                onClick={handlePrevious}
                variant="tertiary"
                size="slim"
              />
              <Button
                icon={isPlaying ? PageIcon : PlayIcon}
                onClick={handlePlayPause}
                variant="tertiary"
                size="slim"
              />
              <Button
                icon={TextIcon}
                onClick={handleNext}
                variant="tertiary"
                size="slim"
              />
              <Button
                icon={isExpanded ? ChevronDownIcon : ChevronUpIcon}
                onClick={() => setIsExpanded(!isExpanded)}
                variant="tertiary"
                size="slim"
              />
            </InlineStack>
          </InlineStack>
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <Box padding="500">
        <BlockStack gap="400">
          {/* Header */}
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="300" blockAlign="center">
              <WebexpLogo />
              <BlockStack gap="100">
                <Text variant="headingMd" fontWeight="semibold" as="p">
                  {currentTrack?.title || "Your Track Name"}
                </Text>
                <Text variant="bodySm" tone="subdued" as="p">
                  WEBEXP
                </Text>
              </BlockStack>
            </InlineStack>
            
            {onClose && (
              <Button
                onClick={onClose}
                variant="tertiary"
                size="slim"
              >
                ×
              </Button>
            )}
          </InlineStack>

          {/* Progress Bar */}
          <BlockStack gap="200">
            <ProgressBar
              progress={(currentTime / duration) * 100}
            />
            <InlineStack align="space-between">
              <Text variant="bodySm" tone="subdued" as="p">
                {formatTime(currentTime)}
              </Text>
              <Text variant="bodySm" tone="subdued" as="p">
                {formatTime(duration)}
              </Text>
            </InlineStack>
          </BlockStack>

          {/* Playback Controls */}
          <InlineStack align="center" gap="300">
            <Button
              icon={TextIcon}
              onClick={handlePrevious}
              variant="tertiary"
              size="slim"
            />
            <Button
              icon={isPlaying ? PageIcon : PlayIcon}
              onClick={handlePlayPause}
              variant="primary"
              size="large"
            />
            <Button
              icon={TextIcon}
              onClick={handleNext}
              variant="tertiary"
              size="slim"
            />
            <Button
              icon={HomeIcon}
              onClick={() => setVolume(volume === 0 ? 1 : 0)}
              variant="tertiary"
              size="slim"
            />
          </InlineStack>

          {/* Playlist */}
          <BlockStack gap="300">
            <Text variant="headingSm" fontWeight="semibold" as="p">
              WEBEXP's Playlist
            </Text>
            
            <BlockStack gap="200">
              {playlist.tracks.map((playlistTrack, index) => {
                const track = playlistTrack.track;
                const isCurrentTrack = index === currentTrackIndex;
                
                return (
                  <Box
                    key={track.id}
                    padding="300"
                    background={isCurrentTrack ? 'bg-surface-selected' : undefined}
                    borderRadius="100"
                    // onClick={() => handleTrackClick(index)}
                    // style={{ cursor: 'pointer' }}
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <InlineStack gap="300" blockAlign="center">
                        <Thumbnail
                          source={track.albumArt || "https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262"}
                          alt={track.title}
                          size="small"
                        />
                        <BlockStack gap="100">
                          <Text 
                            variant="bodyMd" 
                            fontWeight={isCurrentTrack ? "semibold" : "medium"}
                            as="p"
                          >
                            {track.title}
                          </Text>
                          <Text variant="bodySm" tone="subdued" as="p">
                            {track.artist || "WEBEXP"}
                          </Text>
                        </BlockStack>
                      </InlineStack>
                      
                      <Text variant="bodySm" tone="subdued" as="p"  >
                        {track.duration ? formatTime(track.duration) : "---"}
                      </Text>
                    </InlineStack>
                  </Box>
                );
              })}
            </BlockStack>
          </BlockStack>
        </BlockStack>
      </Box>
      
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onLoadedMetadata={handleTimeUpdate}
        style={{ display: 'none' }}
      />
    </Card>
  );
};

export default MusicPlayer;
