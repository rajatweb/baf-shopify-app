// WEBEXP Music Player - Event Handlers and Additional Functions
// This file contains event handlers and additional utility functions

// Extend the WEBEXP_MUSIC_PLAYER object with additional methods
if (window.WEBEXP_MUSIC_PLAYER) {
  Object.assign(WEBEXP_MUSIC_PLAYER, {
    
    // Update active track in playlist
    updateActiveTrack: function() {
      const trackItems = document.querySelectorAll('.track-item');
      const isDark = this.state.settings?.colorScheme === 'dark';
      
      trackItems.forEach((item, index) => {
        const isActive = index === this.state.currentTrackIndex;
        item.classList.toggle('active', isActive);
        // Toggle thumbnail presentation: active -> circular disc, inactive -> standard square
        const standardThumb = item.querySelector('.standard-thumbnail');
        const discContainer = item.querySelector('.playlist-disc-container');
        if (discContainer) {
          discContainer.classList.toggle('disc-hidden', !isActive);
          // Ensure border radius matches presentation regardless of global rounded setting
          discContainer.style.borderRadius = isActive ? '50%' : '0';
        }
        if (standardThumb) {
          standardThumb.style.display = isActive ? 'none' : 'block';
          // When visible, respect roundedCorners setting
          if (!isActive) {
            if (this.state.settings?.roundedCorners) {
              standardThumb.style.borderRadius = '4px';
            } else {
              standardThumb.style.borderRadius = '0';
            }
          }
        }
        
        // Apply theme-appropriate active state styling
        if (isActive) {
          if (isDark) {
            item.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          } else {
            item.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
          }
        } else {
          item.style.backgroundColor = 'transparent';
        }
      });
      
      // Update playlist album art classes after active track changes
      this.updatePlaylistAlbumArtClasses();
    },

    // Update playlist track album art classes
    updatePlaylistAlbumArtClasses: function() {
      if (!this.state.playlist || !this.state.playlist.tracks) return;
      
      this.state.playlist.tracks.forEach((playlistTrack, index) => {
        const track = playlistTrack.track;
        const trackItem = document.querySelector(`[data-index="${index}"]`);
        
        if (trackItem) {
          const playlistDiscContainer = trackItem.querySelector('.playlist-disc-container');
          if (playlistDiscContainer) {
            const hasAlbumArt = track.albumArt && track.albumArt !== 'https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262';
            playlistDiscContainer.classList.toggle('has-album-art', hasAlbumArt);
          }
        }
      });
    },

    // Apply theme styles to track items
    applyThemeToTrackItems: function() {
      if (!this.state.settings || !this.state.settings.colorScheme) return;
      
      const isDark = this.state.settings.colorScheme === 'dark';
      const trackItems = document.querySelectorAll('.track-item');
      
      trackItems.forEach(el => {
        // Apply hover effects
        el.addEventListener('mouseenter', () => {
          if (isDark) {
            el.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          } else {
            el.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
          }
        });
        
        el.addEventListener('mouseleave', () => {
          if (!el.classList.contains('active')) {
            el.style.backgroundColor = 'transparent';
          }
        });
        
        // Apply active state
        if (el.classList.contains('active')) {
          if (isDark) {
            el.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          } else {
            el.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
          }
        }
      });
      
      // Apply theme colors to playlist text elements
      const playlistTrackTitles = document.querySelectorAll('.playlist-track-title');
      const playlistArtistNames = document.querySelectorAll('.playlist-artist-name');
      
      playlistTrackTitles.forEach(el => {
        if (isDark) {
          el.style.setProperty('color', '#ffffff', 'important');
        } else {
          el.style.setProperty('color', '#000000', 'important');
        }
      });
      
      playlistArtistNames.forEach(el => {
        if (isDark) {
          el.style.setProperty('color', 'rgba(255, 255, 255, 0.8)', 'important');
        } else {
          el.style.setProperty('color', 'rgba(0, 0, 0, 0.8)', 'important');
        }
      });
      
      // Apply theme colors to playlist disc centers
      const playlistDiscCenters = document.querySelectorAll('.playlist-disc-center');
      playlistDiscCenters.forEach(el => {
        if (isDark) {
          el.style.backgroundColor = '#000000';
        } else {
          el.style.backgroundColor = '#ffffff';
        }
      });
    },

    // Apply rounded corners to track items
    applyRoundedCornersToTrackItems: function() {
      if (!this.state.settings || this.state.settings.roundedCorners === undefined) return;
      
      const trackItems = document.querySelectorAll('.track-item');
      trackItems.forEach(item => {
        const thumbnail = item.querySelector('.track-thumbnail img');
        const thumbnailContainer = item.querySelector('.track-thumbnail');
        const standardThumbnail = item.querySelector('.standard-thumbnail');
        const discContainer = item.querySelector('.playlist-disc-container');
        
        if (this.state.settings.roundedCorners) {
          // Enable rounded corners
          item.style.borderRadius = '8px';
          if (thumbnail) {
            thumbnail.style.borderRadius = '4px';
          }
          if (thumbnailContainer) {
            thumbnailContainer.style.borderRadius = '4px';
          }
          if (standardThumbnail) {
            standardThumbnail.style.borderRadius = '4px';
          }
          if (discContainer) {
            discContainer.style.borderRadius = '50%';
          }
        } else {
          // Disable rounded corners
          item.style.borderRadius = '0';
          if (thumbnail) {
            thumbnail.style.borderRadius = '0';
          }
          if (thumbnailContainer) {
            thumbnailContainer.style.borderRadius = '0';
          }
          if (standardThumbnail) {
            standardThumbnail.style.borderRadius = '0';
          }
          if (discContainer) {
            discContainer.style.borderRadius = '0';
          }
        }
      });
    },

    // Fetch duration for a track by loading its audio metadata
    fetchTrackDuration: function(trackUrl, trackIndex) {
      return new Promise((resolve) => {
        const tempAudio = new Audio();
        tempAudio.preload = 'metadata';
        
        tempAudio.addEventListener('loadedmetadata', () => {
          const duration = tempAudio.duration;
          tempAudio.remove();
          
          if (duration && !isNaN(duration) && duration > 0) {
            // Update the track duration in the playlist
            if (this.state.playlist && this.state.playlist.tracks[trackIndex]) {
              this.state.playlist.tracks[trackIndex].track.duration = duration;
              
              // Update the duration display in the track list
              const trackItems = document.querySelectorAll('.track-item');
              if (trackItems[trackIndex]) {
                const durationElement = trackItems[trackIndex].querySelector('.track-duration');
                if (durationElement) {
                  durationElement.textContent = this.formatTime(duration);
                  durationElement.title = this.formatTime(duration);
                }
              }
            }
            resolve(duration);
          } else {
            resolve(0);
          }
        });
        
        tempAudio.addEventListener('error', () => {
          tempAudio.remove();
          resolve(0);
        });
        
        tempAudio.src = trackUrl;
        tempAudio.load();
      });
    },

    // Fetch durations for all tracks that don't have duration data
    fetchMissingDurations: function() {
      if (!this.state.playlist || !this.state.playlist.tracks) return;
      
      this.state.playlist.tracks.forEach((playlistTrack, index) => {
        const track = playlistTrack.track;
        const duration = track.duration || 0;
        
        // Only fetch duration if it's not already available
        if (duration <= 0 && track.audioUrl) {
          // Add a small delay between requests to avoid overwhelming the server
          setTimeout(() => {
            this.fetchTrackDuration(track.audioUrl, index);
          }, index * 200); // 200ms delay between each request
        }
      });
    },

    // Shuffle playlist
    shufflePlaylist: function() {
      if (!this.state.playlist || !this.state.playlist.tracks) {
        console.log('🔀 shufflePlaylist: No playlist or tracks available');
        return;
      }
      // Store original order if not already stored
      if (!this.state.originalPlaylistOrder) {
        this.state.originalPlaylistOrder = [...this.state.playlist.tracks];
      }
      
      // Create a copy of tracks for shuffling
      const tracks = [...this.state.playlist.tracks];
      
      // Fisher-Yates shuffle algorithm
      for (let i = tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
      }
      
      // Update playlist with shuffled tracks
      this.state.playlist.tracks = tracks;
      
      // Reset to first track
      this.state.currentTrackIndex = 0;
      
      // Re-render playlist
      this.renderPlaylist();
      
      // Load the first track
      this.loadCurrentTrack();
      
      console.log('🔀 shufflePlaylist: Shuffle complete');
    },

    // Unshuffle playlist (restore original order)
    unshufflePlaylist: function() {
      if (!this.state.originalPlaylistOrder) {
        console.log('🔀 unshufflePlaylist: No original order stored');
        return;
      }
      
      console.log('🔀 unshufflePlaylist: Starting unshuffle process...');
      console.log('🔀 Current track order:', this.state.playlist.tracks.map(t => t.track.title));
      console.log('🔀 Original track order:', this.state.originalPlaylistOrder.map(t => t.track.title));
      
      // Find current track in original order
      const currentTrack = this.state.playlist.tracks[this.state.currentTrackIndex];
      const originalIndex = this.state.originalPlaylistOrder.findIndex(
        track => track.track.id === currentTrack.track.id
      );
      
      console.log('🔀 Current track:', currentTrack.track.title, 'at index:', this.state.currentTrackIndex);
      console.log('🔀 Original index:', originalIndex);
      
      // Restore original order
      this.state.playlist.tracks = [...this.state.originalPlaylistOrder];
      
      // Set current track index to the original position
      this.state.currentTrackIndex = originalIndex >= 0 ? originalIndex : 0;
      
      console.log('🔀 Restored to original order, current index:', this.state.currentTrackIndex);
      
      // Re-render playlist
      this.renderPlaylist();
      
      // Load the current track
      this.loadCurrentTrack();
      
      console.log('🔀 unshufflePlaylist: Unshuffle complete');
    },

    // Restore saved playback state after playlist is loaded
    restorePlaybackState: function() {
      if (!this.state.savedPlaybackState) return;
      
      const savedState = this.state.savedPlaybackState;
      const audio = document.querySelector('audio');
      
      if (!audio) return;
      
      // Check if user is on free plan
      const isFreePlan = this.isFreePlan();
      
      // Restore volume
      if (this.state.volume !== undefined) {
        audio.volume = this.state.isMuted ? 0 : this.state.volume;
        
        // Update volume slider
        const volumeSlider = document.querySelector('.volume-slider');
        if (volumeSlider) {
          volumeSlider.value = this.state.volume;
        }
      }
      
      // Restore track position
      if (savedState.currentTime > 0) {
        audio.addEventListener('loadedmetadata', () => {
          audio.currentTime = savedState.currentTime;
        }, { once: true });
      }
      
      // For free plan users, always force paused state when returning to homepage
      if (isFreePlan) {
        // Ensure audio is paused and state is reset
        audio.pause();
        this.state.isPlaying = false;
        this.updatePlayButton();
        this.updatePlayingState();
        this.updateVolumeIcon();
      } else {
        // Pro plan: Restore playing state if it was playing
        if (this.state.settings && this.state.settings.persistentPlayback) {
          // Small delay to ensure everything is loaded
          setTimeout(() => {
            if (this.state.isPlaying) {
              this.playTrack();
            }
          }, 1000);
        } else {
          // Update UI to reflect current state
          this.updatePlayButton();
          this.updatePlayingState();
          this.updateVolumeIcon();
        }
      }
      
      // Clear saved state after restoration
      this.state.savedPlaybackState = null;
    },

    // Setup event listeners
    setupEventListeners: function() {
      const modal = document.querySelector('.audio-player-modal');
      const closeBtn = document.querySelector('.close-modal-btn');
      const miniExpandBtn = document.querySelector('.mini-expand-btn');
      const floatingButton = document.querySelector('.music-toggle-btn');
      const miniBar = document.querySelector('.mini-music-bar');
      
      // Open modal from floating button with enhanced state management
      if (floatingButton) {
        floatingButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (modal) {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Update button state
            const musicIcon = floatingButton.querySelector('.music-icon');
            const closeIcon = floatingButton.querySelector('.close-icon');
            
            if (musicIcon && closeIcon) {
              musicIcon.style.display = 'none';
              closeIcon.style.display = 'block';
            }
            
            // Setup marquee after modal opens
            setTimeout(() => {
              this.updateAllMarquees();
              this.forceReinitializeMarquees();
            }, 100);
          }
        });
      }
      
      // Open modal from mini bar with enhanced state management
      if (miniBar) {
        miniBar.addEventListener('click', (e) => {
          // Don't open modal if clicking on controls
          if (e.target.closest('.mini-controls')) {
            return;
          }
          
          e.preventDefault();
          e.stopPropagation();
          if (modal) {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Setup marquee after modal opens
            setTimeout(() => {
              this.updateAllMarquees();
              this.forceReinitializeMarquees();
            }, 100);
          }
        });
      }
      
      // Open modal from expand button with enhanced state management
      if (miniExpandBtn) {
        miniExpandBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent triggering mini bar click
          if (modal) {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Setup marquee after modal opens
            setTimeout(() => {
              this.updateAllMarquees();
              this.forceReinitializeMarquees();
            }, 100);
          }
        });
      }
      
      // Close modal with enhanced state management
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (modal) {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            // Update floating button state
            const floatingButton = document.querySelector('.music-toggle-btn');
            if (floatingButton) {
              const musicIcon = floatingButton.querySelector('.music-icon');
              const closeIcon = floatingButton.querySelector('.close-icon');
              
              if (closeIcon) {
                closeIcon.style.display = 'none';
              }
              
              if (musicIcon) {
                const audio = document.querySelector('audio');
                if (audio && audio.paused) {
                  musicIcon.style.display = 'block';
                  musicIcon.style.opacity = '1';
                  musicIcon.style.visibility = 'visible';
                } else {
                  musicIcon.style.display = 'block';
                  musicIcon.style.opacity = '0';
                  musicIcon.style.visibility = 'hidden';
                }
              }
            }
          }
        });
      }
      
      // Enhanced modal click outside handling
      if (modal) {
        const closeModalOnClickOutside = (e) => {
          // Close when clicking on the modal background or flex container
          if (e.target === modal || e.target.classList.contains('modal-flex-container')) {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            // Update floating button state
            const floatingButton = document.querySelector('.music-toggle-btn');
            if (floatingButton) {
              const musicIcon = floatingButton.querySelector('.music-icon');
              const closeIcon = floatingButton.querySelector('.close-icon');
              
              if (closeIcon) {
                closeIcon.style.display = 'none';
              }
              
              if (musicIcon) {
                const audio = document.querySelector('audio');
                if (audio && audio.paused) {
                  musicIcon.style.display = 'block';
                  musicIcon.style.opacity = '1';
                  musicIcon.style.visibility = 'visible';
                } else {
                  musicIcon.style.display = 'block';
                  musicIcon.style.opacity = '0';
                  musicIcon.style.visibility = 'hidden';
                }
              }
            }
            
            // Remove the event listener after closing
            modal.removeEventListener('click', closeModalOnClickOutside);
          }
        };
        
        modal.addEventListener('click', closeModalOnClickOutside);
      }
      
      // Set up audio controls
      this.setupAudioControls();
      
      // Add modal transition end listener for marquee updates
      if (modal) {
        modal.addEventListener('transitionend', (e) => {
          if (e.propertyName === 'opacity' && modal.classList.contains('open')) {
            // Modal is fully open, update marquees
            setTimeout(() => {
              this.updateAllMarquees();
              this.forceReinitializeMarquees(); // Force reinitialize for modal
            }, 100);
          }
        });
      }
      
      // Add window resize listener for responsive badge positioning and marquee updates
      window.addEventListener('resize', () => {
        // Debounce resize events for better performance
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
          // Update marquees when viewport changes
          this.updateAllMarquees();
        }, 250);
      });
      
      // Add page navigation detection for free plan users
      this.setupPageNavigationDetection();
      
      // Add page visibility change listener
      document.addEventListener('visibilitychange', () => {
        this.saveStateBeforeUnload();
      });
      
      // Add beforeunload listener
      window.addEventListener('beforeunload', () => {
        this.saveStateBeforeUnload();
      });
    },

    // Setup page navigation detection for free plan users
    setupPageNavigationDetection: function() {
      // Detect SPA navigation (for single-page applications)
      let currentUrl = window.location.href;
      
      // Override history methods to detect navigation
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      history.pushState = function(...args) {
        originalPushState.apply(history, args);
        this.handlePageNavigation();
      }.bind(this);
      
      history.replaceState = function(...args) {
        originalReplaceState.apply(history, args);
        this.handlePageNavigation();
      }.bind(this);
      
      // Listen for popstate events (back/forward navigation)
      window.addEventListener('popstate', () => {
        this.handlePageNavigation();
      });
      
      // Check for URL changes periodically (fallback for non-SPA navigation)
      setInterval(() => {
        if (window.location.href !== currentUrl) {
          currentUrl = window.location.href;
          this.handlePageNavigation();
        }
      }, 1000);
    },

    // Setup audio controls (play, pause, next, prev)
    setupAudioControls: function() {
      const playBtn = document.querySelector('.play-btn');
      const miniPlayBtn = document.querySelector('.mini-play-btn');
      const prevBtn = document.querySelector('.prev-btn');
      const nextBtn = document.querySelector('.next-btn');
      const miniPrevBtn = document.querySelector('.mini-prev-btn');
      const miniNextBtn = document.querySelector('.mini-next-btn');
      const volumeSlider = document.querySelector('.volume-slider');
      const volumeBtn = document.querySelector('.volume-btn');
      const volumeControl = document.querySelector('.volume-control');
      const audio = document.querySelector('audio');
      const progressBarContainer = document.querySelector('.progress-bar');
      const miniProgressBarContainer = document.querySelector('.mini-progress-bar');

      if (playBtn) {
        playBtn.addEventListener('click', () => {
          this.togglePlay();
        });
      }
      if (miniPlayBtn) {
        miniPlayBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.togglePlay();
        });
      }
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          this.prevTrack();
        });
      }
      if (miniPrevBtn) {
        miniPrevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.prevTrack();
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.nextTrack();
        });
      }
      if (miniNextBtn) {
        miniNextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.nextTrack();
        });
      }
      
      // Volume control with mobile handling
      if (volumeSlider && !this.state.isMobile) {
        volumeSlider.addEventListener('input', (e) => {
          e.stopPropagation();
          this.state.volume = parseFloat(e.target.value);
          if (audio) {
            audio.volume = this.state.volume;
          }
          
          if (audio.volume === 0) {
            this.state.isMuted = true;
          } else {
            this.state.isMuted = false;
            this.state.lastVolume = this.state.volume;
          }
          
          this.updateVolumeIcon();
          this.savePlaybackState();
        });
      }
      
      if (volumeBtn && !this.state.isIOS) {
        volumeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleMute();
        });
      }
      
      // Volume slider hover
      if (volumeControl) {
        volumeControl.addEventListener('mouseenter', () => {
          volumeControl.classList.add('active');
        });
        
        volumeControl.addEventListener('mouseleave', () => {
          volumeControl.classList.remove('active');
        });
      }
      
      // Audio events
      if (audio) {
        audio.addEventListener('timeupdate', () => {
          this.state.currentTime = audio.currentTime;
          this.updateProgress();
          this.savePlaybackState();
        });
        
        audio.addEventListener('ended', () => {
          console.log('🎵 Track ended, moving to next track...');
          console.log('🎵 Current playing state:', this.state.isPlaying);
          
          // When track ends naturally, temporarily clear user pause preference for next track
          const wasUserPaused = this.state.userPausedFromStorage;
          this.state.userPausedFromStorage = false;
          
          // When a track ends naturally, we should always continue playing the next track
          // The 'ended' event means the track was playing and finished, so continue playback
          this.nextTrackWithAutoplay();
          
          // Restore user pause preference after next track starts (if it was set)
          // This ensures that if user manually paused before, it only affects initial autoplay, not track progression
          setTimeout(() => {
            if (wasUserPaused && localStorage.getItem('webexp_user_paused') === 'true') {
              this.state.userPausedFromStorage = true;
            }
          }, 1000);
        });
        
        audio.addEventListener('loadedmetadata', () => {
          this.updateProgress();
          // Update duration display when metadata is loaded
          this.updateDurationDisplay();
        });
        
        audio.addEventListener('play', () => {
          this.state.isPlaying = true;
          this.updatePlayButton();
          this.updatePlayingState();
          this.savePlaybackState(); // Save state when audio starts playing
        });
        
        audio.addEventListener('pause', () => {
          this.state.isPlaying = false;
          this.updatePlayButton();
          this.updatePlayingState();
          this.savePlaybackState(); // Save state when audio pauses
        });
      }

      // Seek helper
      const attachSeekHandler = (container, isMini = false) => {
        if (!container) return;
        const handleSeek = (clientX) => {
          if (!audio || !audio.duration || isNaN(audio.duration)) return;
          const rect = container.getBoundingClientRect();
          const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
          const ratio = rect.width > 0 ? x / rect.width : 0;
          audio.currentTime = ratio * audio.duration;
          // Update UI fills immediately
          const fill = document.querySelector(isMini ? '.mini-progress' : '.progress');
          if (fill) fill.style.width = (ratio * 100) + '%';
        };
        // Mouse
        container.addEventListener('click', (e) => {
          e.stopPropagation();
          handleSeek(e.clientX);
        });
        // Touch
        container.addEventListener('touchstart', (e) => {
          e.stopPropagation();
          const touch = e.touches && e.touches[0];
          if (touch) handleSeek(touch.clientX);
        }, { passive: true });
      };

      // Attach seek on both progress bars
      attachSeekHandler(progressBarContainer, false);
      attachSeekHandler(miniProgressBarContainer, true);
    },

    // Toggle mute with enhanced mobile handling
    toggleMute: function() {
      const audio = document.querySelector('audio');
      const volumeSlider = document.querySelector('.volume-slider');
      const volumeControl = document.querySelector('.volume-control');
      
      if (this.state.isMuted) {
        // Unmute
        this.state.isMuted = false;
        if (audio) {
          audio.volume = this.state.lastVolume;
        }
        if (volumeSlider) {
          volumeSlider.value = this.state.lastVolume;
        }
        this.updateVolumeIcon();
      } else {
        // Mute
        this.state.isMuted = true;
        this.state.lastVolume = this.state.volume;
        if (audio) {
          audio.volume = 0;
        }
        if (volumeSlider) {
          volumeSlider.value = 0;
        }
        this.updateVolumeIcon();
      }
      
      // Handle volume control active state for mobile
      if (volumeControl && !this.state.isMobile) {
        if (volumeControl.classList.contains('active')) {
          volumeControl.classList.remove('active');
        } else {
          volumeControl.classList.add('active');
          setTimeout(() => {
            document.addEventListener('click', this.hideVolumeControl.bind(this));
          }, 10);
        }
      }
      
      this.savePlaybackState(); // Save state when muting/unmuting
    },

    // Hide volume control when clicking outside
    hideVolumeControl: function(e) {
      const volumeControl = document.querySelector('.volume-control');
      if (volumeControl && !volumeControl.contains(e.target)) {
        volumeControl.classList.remove('active');
        document.removeEventListener('click', this.hideVolumeControl.bind(this));
      }
    },
    
    // Update volume icon
    updateVolumeIcon: function() {
      const volumeBtn = document.querySelector('.volume-btn');
      if (!volumeBtn) return;
      
      const highIcon = volumeBtn.querySelector('.volume-high-icon');
      const muteIcon = volumeBtn.querySelector('.volume-mute-icon');
      
      if (highIcon && muteIcon) {
        const isMuted = this.state.isMuted || this.state.volume === 0;
        highIcon.style.display = isMuted ? 'none' : 'block';
        muteIcon.style.display = isMuted ? 'block' : 'none';
      }
    },

    // Handle page navigation for free plan users
    handlePageNavigation: function() {
      // Check if user is on free plan
      const isFreePlan = this.isFreePlan();
      
      if (isFreePlan) {
        const isHomepage = this.isHomepage();
        
        if (!isHomepage) {
          // User navigated away from homepage - pause audio
          const audio = document.querySelector('audio');
          if (audio && this.state.isPlaying) {
            audio.pause();
            this.state.isPlaying = false;
            this.updatePlayButton();
            this.updatePlayingState();
            this.savePlaybackState();
          }
        } else {
          // User returned to homepage - ensure paused state
          const audio = document.querySelector('audio');
          if (audio && this.state.isPlaying) {
            audio.pause();
            this.state.isPlaying = false;
            this.updatePlayButton();
            this.updatePlayingState();
            this.savePlaybackState();
          }
        }
      }
    },
    
    // Save state before page unload
    saveStateBeforeUnload: function() {
      // Save current state immediately
      this.savePlaybackState();
      
      // Also save on page visibility change
      if (document.hidden) {
        this.savePlaybackState();
      }
    },

    // Clear playback state from localStorage
    clearPlaybackState: function() {
      try {
        localStorage.removeItem('webexp_music_player_state');
      } catch (error) {
        console.error('Error clearing playback state:', error);
      }
    }
  });
}
