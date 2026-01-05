// WEBEXP Music Player - Enhanced JavaScript Module
(function() {
  // WEBEXP Music Player Object
  const WEBEXP_MUSIC_PLAYER = {
    // State
    state: {
      currentTrackIndex: 0,
      isPlaying: false,
      currentTime: 0,
      volume: 1,
      playlist: null,
      currentTrack: null,
      settings: null,
      isMuted: false,
      isEnabled: false,
      originalPlaylistOrder: null,
      savedPlaybackState: null,
      resizeTimeout: null,
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
      isAndroid: /Android/.test(navigator.userAgent),
      isMobile: false,
      lastVolume: 1
    },
    
    // Initialize the music player
    init: function() {
      console.log('🚀 Initializing WEBEXP Music Player...');
      
      // Check localStorage for user pause preference FIRST
      const userPaused = localStorage.getItem('webexp_user_paused');
      if (userPaused === 'true') {
        console.log('⏸️ User pause preference found in localStorage - autoplay will be disabled');
        this.state.userPausedFromStorage = true;
      } else {
        console.log('▶️ No user pause preference found - will use database settings');
        this.state.userPausedFromStorage = false; // User hasn't paused, so allow autoplay based on database
      }
      
      // Initialize mobile detection
      this.state.isMobile = this.state.isIOS || this.state.isAndroid;
      console.log('📱 Mobile detection:', {
        isIOS: this.state.isIOS,
        isAndroid: this.state.isAndroid,
        isMobile: this.state.isMobile
      });
      
      // Hide volume control on mobile devices
      if (this.state.isMobile) {
        this.hideVolumeControlOnMobile();
      }
      
      // Load settings first
      this.loadSettings().then(() => {
        console.log('⚙️ Settings loaded, checking if player should be shown...');
        
        // Check if player should be shown on this page (free plan: homepage only)
        if (!this.shouldShowPlayer()) {
          console.log('🚫 Player should not be shown on this page (free plan restriction)');
          return;
        }
        
        console.log('✅ Player should be shown, continuing initialization...');
        
        // Load playback state from localStorage
        this.loadPlaybackState();
        
        // Inject the player HTML
        this.injectMusicPlayer();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load playlists
        this.loadPlaylist();
        
        // For free plan users, ensure player starts in paused state
        this.ensureFreePlanState();
        
        // Apply settings
        this.applySettings();
        
        // Initialize marquees after everything is loaded
        setTimeout(() => {
          this.forceReinitializeMarquees();
        }, 500);
        
        console.log('🎉 Music player initialization complete!');
      }).catch(error => {
        console.error('❌ Error initializing music player:', error);
      });
    },
    
    // Check if user is on free plan
    isFreePlan: function() {
      if (!this.state.settings) {
        return true; // Default to free plan if no settings
      }
      // Check for Pro Plan (Full Experience) - the exact name from API
      return !this.state.settings.subscriptionStatus || 
             this.state.settings.subscriptionStatus !== 'ACTIVE' ||
             this.state.settings.subscriptionName !== 'Pro Plan (Full Experience)';
    },
    
    // Check if player should be shown on current page
    shouldShowPlayer: function() {
      console.log('🔍 Checking if player should be shown...');
      
      // If no settings loaded, show player (fallback)
      if (!this.state.settings) {
        console.log('⚠️ No settings loaded, showing player as fallback');
        return true;
      }
      
      // Check if user is on free plan
      const isFreePlan = this.isFreePlan();
      console.log('📋 Plan check:', {
        subscriptionStatus: this.state.settings.subscriptionStatus,
        subscriptionName: this.state.settings.subscriptionName,
        isFreePlan: isFreePlan
      });
      
      if (isFreePlan) {
        // Free plan: only show on homepage
        const isHomepage = this.isHomepage();
        console.log('🏠 Homepage check:', isHomepage);
        
        if (!isHomepage) {
          console.log('🚫 Free plan user not on homepage - hiding player');
          return false;
        }
      }
      
      // Pro plan: show on all pages
      console.log('✅ Player should be shown');
      return true;
    },
    
    // Check if current page is homepage
    isHomepage: function() {
      // Check various homepage indicators
      const path = window.location.pathname;
      const isRoot = path === '/' || path === '/index' || path === '/home';
      const hasHomepageClass = document.body.classList.contains('template-index') || 
                              document.body.classList.contains('template-home');
      const hasHomepageId = document.body.id === 'template-index' || 
                           document.body.id === 'template-home';
      
      return isRoot || hasHomepageClass || hasHomepageId;
    },
    
    // Load settings from app proxy
    loadSettings: async function() {
      try {
        const response = await fetch(`/apps/web-exp-music-app-001/music-player/settings?shop=${window.shopDomain}`);
        const data = await response.json();
        
        if (data.success) {
          this.state.settings = data.data;
          console.log('✅ Settings loaded successfully:', this.state.settings);
          console.log('🔍 Plan detection:', {
            subscriptionStatus: this.state.settings.subscriptionStatus,
            subscriptionName: this.state.settings.subscriptionName,
            isFreePlan: this.isFreePlan()
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    },
    
    // Inject the music player HTML into the page
    injectMusicPlayer: function() {
      const container = document.createElement('div');
      container.className = 'audio-player-container disc-mode';
      container.setAttribute('data-section-id', 'audio-player-playlist');
      container.setAttribute('data-section-type', 'audio-player-section');
      
      // Show loading state immediately
      this.showLoadingState();
      
      // Create floating button (will be shown/hidden based on display mode)
      const floatingButton = `
        <button class="music-toggle-btn bottom-right" style="display: none;">
            <div class="disc-container disc-hidden">
                <img class="disc-background" src="https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262" alt="">
                <img class="disc-overlay" src="https://cdn.shopify.com/s/files/1/0707/3821/5234/files/Disc_1-min_webexp_top.png?v=1746221701" alt="">
                <img class="current-track-image-btn disc-cover-image" src="" alt="">
                <div class="disc-center"></div>
            </div>
            <svg class="music-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
            <svg class="close-icon" style="display: none;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      `;

      // Create mini music bar (will be shown/hidden based on display mode)
      const miniMusicBar = `
      <div class="mini-music-bar" style="display: none;">
          <div class="mini-bar-content">
              <div class="mini-left-group">
                  <div class="mini-thumbnail">
                    <img class="current-track-image-mini standard-cover-image" src="https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262" alt="Album Art">
                    <div class="mini-disc-container disc-hidden">
                      <img class="mini-disc-background" src="https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262" alt="Disc Background">
                      <img class="mini-disc-overlay" src="https://cdn.shopify.com/s/files/1/0707/3821/5234/files/Disc_1-min_webexp_top.png?v=1746221701" alt="Disc Overlay">
                        <img class="mini-disc-cover-image current-track-image-mini" src="https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262" alt="Album Art">
                      <div class="mini-disc-center"></div>
                    </div>
                  </div>
                  <div class="mini-track-info">
                      <div class="mini-track-details">
                          <span class="mini-track-title"><span class="loading-dots">Loading<span>.</span><span>.</span><span>.</span></span></span>
                          <span class="mini-artist-name"></span>
                      </div>
                  </div>
              </div>
              <div class="mini-right-group">
                  <div class="mini-controls">
                      <button class="mini-prev-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                      </button>
                      <button class="mini-play-btn">
                          <svg class="mini-play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          <svg class="mini-pause-icon" style="display: none;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                      </button>
                      <button class="mini-next-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                      </button>
                  </div>
                  <div class="mini-expand-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
                  </div>
              </div>
          </div>
          <div class="mini-progress-container">
              <div class="mini-progress-bar">
                  <div class="mini-progress"></div>
              </div>
          </div>
      </div>
      `;

      // Create modal (same for both modes)
      const modal = `
          <div class="audio-player-modal" aria-hidden="true">
            <div class="audio-player-playlist">
                <button class="close-modal-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
                
                <div class="player-header">
                    <div class="album-art">
                        <img class="current-track-image standard-cover-image" src="" alt="Album Art">
                        <div class="modal-disc-container disc-hidden">
                            <img class="modal-disc-background" src="https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262" alt="Disc Background">
                            <img class="modal-disc-overlay" src="https://cdn.shopify.com/s/files/1/0707/3821/5234/files/Disc_1-min_webexp_top.png?v=1746221701" alt="Disc Overlay">
                            <img class="modal-disc-cover-image current-track-image" src="" alt="Album Art">
                            <div class="modal-disc-center"></div>
                        </div>
                    </div>
                    
                    <div class="player-info">
                        <h3 class="track-title">Track Name</h3>
                        <p class="artist-name">Artist</p>
                        
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress"></div>
                            </div>
                            <div class="time-display">
                                <span class="current-time">0:00</span>
                                <span class="time-separator">/</span>
                                <span class="remaining-time">0:00</span>
                            </div>
                        </div>
                        
                        <div class="control-buttons">
                            <div class="main-controls">
                                <button class="prev-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                                </button>
                                <button class="play-btn">
                                    <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    <svg class="pause-icon" style="display: none;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                </button>
                                <button class="next-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                                </button>
                                <div class="volume-control">
                                    <button class="volume-btn">
                                        <svg class="volume-high-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                                        <svg class="volume-mute-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="display: none;"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                                    </button>
                                    <div class="volume-slider-container">
                                        <input type="range" class="volume-slider" min="0" max="1" step="0.01" value="1">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="playlist">
                    <h3 class="playlist-title">My Playlist</h3>
                    <ul class="track-list" id="trackList">
                        <!-- Tracks will be added here dynamically -->
                    </ul>
                </div>
            </div>
        </div>
      `;
      
      // Create audio element
      const audio = '<audio src="" preload="metadata"></audio>';
      
      // Combine all elements
      container.innerHTML = floatingButton + miniMusicBar + modal + audio;
      
      // Append to body
      document.body.appendChild(container);
      
      // Store reference
      this.container = container;
      
      // Update play button state immediately
      setTimeout(() => {
        this.updatePlayButton();
      }, 100);
    },

    // Enhanced marquee functions with improved performance and smoothness
    setupPerfectMarquee: function(element) {
      if (!element) return;
      
      const originalText = element.textContent.trim();
      if (!originalText) return;
      
      element.dataset.originalText = originalText;
      element.textContent = '';
      element.classList.add('marquee-processed');
      
      const marqueeContainer = document.createElement('div');
      marqueeContainer.className = 'marquee-container';
      marqueeContainer.style.position = 'relative';
      marqueeContainer.style.width = '100%';
      marqueeContainer.style.height = '100%';
      marqueeContainer.style.overflow = 'hidden';
      element.appendChild(marqueeContainer);
      
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'marquee-content';
      contentWrapper.style.display = 'inline-block';
      contentWrapper.style.whiteSpace = 'nowrap';
      contentWrapper.style.willChange = 'transform';
      contentWrapper.style.transform = 'translateZ(0)';
      
      const textSpan1 = document.createElement('span');
      textSpan1.textContent = originalText;
      textSpan1.style.display = 'inline-block';
      // iOS Safari font size fix
      textSpan1.style.webkitTextSizeAdjust = '100%';
      textSpan1.style.textSizeAdjust = '100%';
      textSpan1.style.fontSize = 'inherit';
      contentWrapper.appendChild(textSpan1);
      
      const spacer = document.createElement('span');
      spacer.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;';
      spacer.style.display = 'inline-block';
      contentWrapper.appendChild(spacer);
      
      marqueeContainer.appendChild(contentWrapper);
      
      setTimeout(() => {
        const textWidth = textSpan1.offsetWidth;
        const containerWidth = marqueeContainer.offsetWidth;
        
        if (textWidth > containerWidth * 0.8) {
          const textSpan2 = document.createElement('span');
          textSpan2.textContent = originalText;
          textSpan2.style.display = 'inline-block';
          // iOS Safari font size fix
          textSpan2.style.webkitTextSizeAdjust = '100%';
          textSpan2.style.textSizeAdjust = '100%';
          textSpan2.style.fontSize = 'inherit';
          contentWrapper.appendChild(textSpan2);
          
          const spacer2 = document.createElement('span');
          spacer2.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;';
          spacer2.style.display = 'inline-block';
          contentWrapper.appendChild(spacer2);
          
          const textSpan3 = document.createElement('span');
          textSpan3.textContent = originalText;
          textSpan3.style.display = 'inline-block';
          // iOS Safari font size fix
          textSpan3.style.webkitTextSizeAdjust = '100%';
          textSpan3.style.textSizeAdjust = '100%';
          textSpan3.style.fontSize = 'inherit';
          contentWrapper.appendChild(textSpan3);
          
          const uniqueId = 'marquee-' + Math.random().toString(36).substr(2, 9);
          const animateWidth = textWidth + spacer.offsetWidth;
          
          const keyframes = `
            @keyframes ${uniqueId} {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-${animateWidth}px, 0, 0); }
            }
          `;
          
          const style = document.createElement('style');
          style.textContent = keyframes;
          document.head.appendChild(style);
          
          const duration = Math.max(8, animateWidth / 25);
          contentWrapper.style.animation = `${uniqueId} ${duration}s infinite linear`;
        }
      }, 50);
    },

    clearAllMarquees: function() {
      const elements = document.querySelectorAll('.marquee-processed');
      
      elements.forEach(element => {
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        element.classList.remove('marquee-processed');
        
        if (element.dataset.originalText) {
          element.textContent = element.dataset.originalText;
        }
      });
    },

    updateMarqueeText: function(element, newText) {
      if (!element) return;
      
      element.textContent = newText;
      element.dataset.originalText = newText;
      this.setupPerfectMarquee(element);
    },

    // Enhanced audio playback with error handling
    playAudioWithErrorHandling: function() {
      const audio = document.querySelector('audio');
      if (!audio) {
        console.error('Audio element not found');
        return;
      }
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.state.isPlaying = true;
          this.updatePlayButton();
          this.updatePlayingState();
          this.savePlaybackState();
        }).catch(error => {
          console.error('Error playing audio:', error);
          this.state.isPlaying = false;
          this.updatePlayButton();
          this.updatePlayingState();
        });
      }
    },

    // Play track (only clears localStorage if called from user interaction)
    playTrack: function() {
      this.playAudioWithErrorHandling();
    },

    // Pause track
    pauseTrack: function() {
      const audio = document.querySelector('audio');
      if (audio) {
        audio.pause();
        this.state.isPlaying = false;
        
        // Save user pause preference to localStorage and state
        localStorage.setItem('webexp_user_paused', 'true');
        this.state.userPausedFromStorage = true;
        console.log('⏸️ User paused - saved to localStorage and state');
        
        this.updatePlayButton();
        this.updatePlayingState();
        this.savePlaybackState(); // Save state when pausing
      }
    },

    // Toggle play/pause
    togglePlay: function() {
      if (this.state.isPlaying) {
        this.pauseTrack();
      } else {
        // Clear user pause preference when user manually clicks play
        this.clearUserPausePreference();
        this.playTrack();
      }
    },

    // Update play button state
    updatePlayButton: function() {
      const playBtn = document.querySelector('.play-btn');
      const miniPlayBtn = document.querySelector('.mini-play-btn');
      
      if (playBtn) {
        const playIcon = playBtn.querySelector('.play-icon');
        const pauseIcon = playBtn.querySelector('.pause-icon');
        if (playIcon && pauseIcon) {
          if (this.state.isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
          } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
          }
        } else {
          // console.log('🎵 Main play button icons not found:', { playIcon, pauseIcon });
        }
      }
      
      if (miniPlayBtn) {
        const miniPlayIcon = miniPlayBtn.querySelector('.mini-play-icon');
        const miniPauseIcon = miniPlayBtn.querySelector('.mini-pause-icon');
        if (miniPlayIcon && miniPauseIcon) {
          if (this.state.isPlaying) {
            miniPlayIcon.style.display = 'none';
            miniPauseIcon.style.display = 'block';
          } else {
            miniPlayIcon.style.display = 'block';
            miniPauseIcon.style.display = 'none';
          }
        }
      }
    },

    // Force button state to ensure only one shows (only when not playing)
    forceButtonState: function() {
      const miniPlayBtn = document.querySelector('.mini-play-btn');
      if (miniPlayBtn) {
        const miniPlayIcon = miniPlayBtn.querySelector('.mini-play-icon');
        const miniPauseIcon = miniPlayBtn.querySelector('.mini-pause-icon');
        
        if (miniPlayIcon && miniPauseIcon) {
          // Only force play state if we're not currently playing
          if (!this.state.isPlaying) {
            miniPlayIcon.style.display = 'block';
            miniPauseIcon.style.display = 'none';
          }
        }
      }
    },

    // Update playing state for disc animations
    updatePlayingState: function() {
      const container = document.querySelector('.audio-player-container');
      if (container) {
        container.classList.toggle('playing', this.state.isPlaying);
      }
      
      // Update floating button icon visibility
      const floatingButton = document.querySelector('.music-toggle-btn');
      if (floatingButton) {
        const musicIcon = floatingButton.querySelector('.music-icon');
        const discContainer = floatingButton.querySelector('.disc-container');
        
        if (musicIcon && discContainer) {
          if (this.state.isPlaying) {
            // Hide music icon, show disc when playing
            musicIcon.style.display = 'none';
            discContainer.classList.remove('disc-hidden');
          } else {
            // Show music icon, hide disc when not playing
            musicIcon.style.display = 'block';
            discContainer.classList.add('disc-hidden');
          }
        }
      }
    },

    // Format time in MM:SS format
    formatTime: function(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    // Save playback state to localStorage
    savePlaybackState: function() {
      try {
        const audio = document.querySelector('audio');
        const state = {
          currentTrackIndex: this.state.currentTrackIndex,
          currentTime: audio ? audio.currentTime : 0,
          volume: this.state.volume,
          isPlaying: this.state.isPlaying,
          isMuted: this.state.isMuted,
          timestamp: Date.now()
        };
        
        // Only save if we have a valid playlist
        if (this.state.playlist && this.state.playlist.tracks && this.state.playlist.tracks.length > 0) {
          localStorage.setItem('webexp_music_player_state', JSON.stringify(state));
        }
      } catch (error) {
        console.error('Error saving playback state:', error);
      }
    },

    // Load playback state from localStorage
    loadPlaybackState: function() {
      try {
        const saved = localStorage.getItem('webexp_music_player_state');
        if (saved) {
          const state = JSON.parse(saved);
          const now = Date.now();
          
          // Only restore if state is less than 30 minutes old (increased from 5 minutes)
          if (now - state.timestamp < 30 * 60 * 1000) {
            // Restore basic state
            this.state.currentTrackIndex = state.currentTrackIndex || 0;
            this.state.volume = state.volume || 1;
            this.state.isPlaying = state.isPlaying || false;
            this.state.isMuted = state.isMuted || false;
            
            // Store the saved state for later use after playlist loads
            this.state.savedPlaybackState = {
              currentTime: state.currentTime || 0,
              shouldResume: state.isPlaying || false,
              timestamp: state.timestamp
            };
          } else {
            // Playback state expired, starting fresh
          }
        }
      } catch (error) {
        console.error('Error loading playback state:', error);
      }
    },

    // Check if autoplay should be allowed (considers user pause preference)
    shouldAutoplay: function() {
      // Check if user paused (single source of truth)
      if (this.state.userPausedFromStorage) {
        console.log('🎯 User paused - autoplay disabled');
        return false;
      }
      
      // Otherwise, use database setting
      const databaseAutoplay = this.state.settings && this.state.settings.autoplay === true;
      console.log('🎯 Using database setting for autoplay:', databaseAutoplay);
      return databaseAutoplay;
    },

    // Clear user pause preference (when user manually plays)
    clearUserPausePreference: function() {
      localStorage.removeItem('webexp_user_paused');
      this.state.userPausedFromStorage = false; // Clear initialization flag too
      console.log('▶️ User played - cleared pause preference');
    },

    // Debug function to check autoplay state
    debugAutoplay: function() {
      console.log('🔍 Autoplay Debug Info:');
      console.log('======================');
      console.log('🎯 User Paused (State):', this.state.userPausedFromStorage);
      console.log('📦 User Paused (localStorage):', localStorage.getItem('webexp_user_paused'));
      console.log('⚙️ Database Setting:', this.state.settings ? this.state.settings.autoplay : 'unknown');
      console.log('✅ Should Autoplay:', this.shouldAutoplay());
      console.log('🎵 Current State:', {
        isPlaying: this.state.isPlaying
      });
    },

    // Hide volume control on mobile devices
    hideVolumeControlOnMobile: function() {
      const volumeControl = document.querySelector('.volume-control');
      if (volumeControl) {
        volumeControl.style.display = 'none';
        console.log('📱 Volume control hidden on mobile device');
      }
    },

    // Initialize when DOM is ready
    initPlayer: function() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.init();
        });
      } else {
        this.init();
      }
    }
  };

  // Make WEBEXP_MUSIC_PLAYER globally available
  window.WEBEXP_MUSIC_PLAYER = WEBEXP_MUSIC_PLAYER;
  
  // Initialize the player
  WEBEXP_MUSIC_PLAYER.initPlayer();
})();
