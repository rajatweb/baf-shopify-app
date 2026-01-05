// WEBEXP Music Player - Extended Functions
// This file contains additional functions that extend the main music player functionality

// Extend the WEBEXP_MUSIC_PLAYER object with additional methods
if (window.WEBEXP_MUSIC_PLAYER) {
  Object.assign(WEBEXP_MUSIC_PLAYER, {
    // Apply settings from app proxy
    applySettings: function () {
      if (!this.state.settings) return;

      console.log("🎨 Applying settings:", this.state.settings);

      const settings = this.state.settings; // Settings are flattened, not nested
      const container = document.querySelector(".audio-player-container");
      const miniBar = document.querySelector(".mini-music-bar");
      const floatingButton = document.querySelector(".music-toggle-btn");
      const modal = document.querySelector(".audio-player-playlist");

      if (!container || !miniBar || !floatingButton) return;

      // Enforce plan-specific restrictions
      this.enforcePlanRestrictions();

      // Apply display mode (floating button vs mini bar)
      if (this.isFreePlan()) {
        // Free plan: Force mini-bar layout
        console.log("🔒 Free plan: Forcing mini-bar layout");
        floatingButton.style.display = "none";
        miniBar.style.display = "block";
      } else {
        // Pro plan: Allow both options
        console.log(
          "✨ Pro plan: Applying display mode:",
          settings.displayMode
        );
        if (settings.displayMode) {
          if (settings.displayMode === "button") {
            // Show floating button, hide mini bar
            floatingButton.style.display = "flex";
            miniBar.style.display = "none";
          } else if (settings.displayMode === "mini-bar") {
            // Show mini bar, hide floating button
            floatingButton.style.display = "none";
            miniBar.style.display = "block";
          }
        } else {
          // Default to mini bar
          floatingButton.style.display = "none";
          miniBar.style.display = "block";
        }
      }

      // Apply button size for floating button
      if (settings.buttonSize) {
        console.log("📏 Applying button size:", settings.buttonSize);
        floatingButton.style.width = settings.buttonSize + "px";
        floatingButton.style.height = settings.buttonSize + "px";

        // Also update the disc container size
        const discContainer = floatingButton.querySelector(".disc-container");
        if (discContainer) {
          discContainer.style.width = settings.buttonSize + "px";
          discContainer.style.height = settings.buttonSize + "px";
        }
      }

      // Apply button position for floating button
      if (settings.buttonPosition) {
        console.log("📍 Applying button position:", settings.buttonPosition);

        // Reset all position properties first
        floatingButton.style.top = "auto";
        floatingButton.style.bottom = "auto";
        floatingButton.style.left = "auto";
        floatingButton.style.right = "auto";

        // Apply position based on setting
        switch (settings.buttonPosition) {
          case "top-left":
            floatingButton.style.top = "20px";
            floatingButton.style.left = "20px";
            break;
          case "top-right":
            floatingButton.style.top = "20px";
            floatingButton.style.right = "20px";
            break;
          case "bottom-left":
            floatingButton.style.bottom = "20px";
            floatingButton.style.left = "20px";
            break;
          case "bottom-right":
            floatingButton.style.bottom = "20px";
            floatingButton.style.right = "20px";
            break;
          default:
            // Default to bottom-right
            floatingButton.style.bottom = "20px";
            floatingButton.style.right = "20px";
        }
      }

      // Apply color scheme (dark/light theme)
      if (this.isFreePlan()) {
        // Free plan: Force light theme
        console.log("🔒 Free plan: Forcing light theme");
        container.setAttribute("data-theme", "light");
        this.applyLightTheme();
      } else {
        // Pro plan: Allow both themes
        if (settings.colorScheme) {
          console.log("🎨 Applying color scheme:", settings.colorScheme);
          container.setAttribute("data-theme", settings.colorScheme);

          // Force a reflow to ensure CSS changes take effect
          container.offsetHeight;

          // Apply theme-specific styles directly as backup
          if (settings.colorScheme === "dark") {
            this.applyDarkTheme();
          } else {
            this.applyLightTheme();
          }
        }
      }

      // Apply rounded corners setting
      if (settings.roundedCorners !== undefined) {
        console.log("🔲 Applying rounded corners:", settings.roundedCorners);

        if (settings.roundedCorners) {
          // Enable rounded corners
          miniBar.style.borderRadius = "12px 12px 0px 0px";
          if (modal) {
            modal.style.borderRadius = "8px";
          }
          
          // Enable rounded corners for progress bars
          const progressBars = document.querySelectorAll(".progress-bar, .mini-progress-container");
          progressBars.forEach((bar) => {
            bar.style.borderRadius = "2px";
          });
        } else {
          // Disable rounded corners
          miniBar.style.borderRadius = "0px";
          if (modal) {
            modal.style.borderRadius = "0px";
          }
          
          // Disable rounded corners for progress bars
          const progressBars = document.querySelectorAll(".progress-bar, .mini-progress-container");
          progressBars.forEach((bar) => {
            bar.style.borderRadius = "0px";
          });
        }
      }

      // Apply album art visibility setting
      if (settings.showAlbumArt !== undefined) {
        console.log("🖼️ Applying showAlbumArt:", settings.showAlbumArt);
        const albumArts = document.querySelectorAll(
          ".mini-thumbnail, .album-art, .current-track-image, .current-track-image-mini"
        );
        albumArts.forEach((art) => {
          art.style.display = settings.showAlbumArt ? "block" : "none";
        });
      }

      // Apply track info visibility setting
      if (settings.showTrackInfo !== undefined) {
        console.log("📝 Applying showTrackInfo:", settings.showTrackInfo);
        const trackTitles = document.querySelectorAll(
          ".track-title, .mini-track-title"
        );
        trackTitles.forEach((title) => {
          title.style.display = settings.showTrackInfo ? "block" : "none";
        });
      }

      // Apply artist name visibility setting
      if (settings.showArtistName !== undefined) {
        console.log("👤 Applying showArtistName:", settings.showArtistName);
        const artistNames = document.querySelectorAll(
          ".artist-name, .mini-artist-name, .playlist-artist-name"
        );
        artistNames.forEach((artist) => {
          artist.style.display = settings.showArtistName ? "block" : "none";
        });
      }

      // Apply track duration visibility setting
      if (settings.showTrackDuration !== undefined) {
        console.log(
          "⏱️ Applying showTrackDuration:",
          settings.showTrackDuration
        );
        const durations = document.querySelectorAll(
          ".track-duration, .time-display"
        );
        durations.forEach((duration) => {
          duration.style.display = settings.showTrackDuration ? "flex" : "none";
        });
      }

      // Apply player opacity setting
      if (settings.playerOpacity !== undefined) {
        console.log("👁️ Applying playerOpacity:", settings.playerOpacity);
        const opacity = settings.playerOpacity / 100;
        miniBar.style.opacity = opacity;
        if (modal) {
          modal.style.opacity = opacity;
        }
      }

      // Apply max visible tracks setting
      if (
        settings.maxVisibleTracks !== undefined &&
        settings.maxVisibleTracks > 0
      ) {
        console.log("📊 Applying maxVisibleTracks:", settings.maxVisibleTracks);
        // This will be applied when rendering the playlist
        this.state.maxVisibleTracks = settings.maxVisibleTracks;
      }

      // Apply audio settings (loop, autoplay, shuffle)
      this.applyAudioSettings();

      console.log("✅ Settings applied successfully");
    },

    // Load playlist from app proxy
    loadPlaylist: async function () {
      // Show loading state while fetching
      this.showMessage("");

      try {
        const response = await fetch(
          `/apps/web-exp-music-app-001/music-player/playlists?shop=${window.shopDomain}`
        );
        const data = await response.json();

        if (data.success && data.data.selectedPlaylist) {
          // Use the selected playlist from the database
          this.state.playlist = data.data.selectedPlaylist;

          // Check if playlist has tracks
          if (
            !this.state.playlist.tracks ||
            this.state.playlist.tracks.length === 0
          ) {
            this.showNoContentMessage("No tracks in playlist");
            return;
          }

          // Apply shuffle if enabled
          if (this.state.settings && this.state.settings.shuffle === true) {
            this.shufflePlaylist();
          } else {
            this.renderPlaylist();
            this.loadCurrentTrack();
          }

          // Restore saved playback state if available
          this.restorePlaybackState();

          // Update play button state after playlist is loaded
          this.updatePlayButton();

          // Trigger autoplay after playlist is loaded (if enabled and no saved state)
          if (
            this.shouldAutoplay() &&
            (!this.state.savedPlaybackState ||
              !this.state.savedPlaybackState.shouldResume)
          ) {
            // Small delay to ensure track is loaded
            setTimeout(() => {
              const audio = document.querySelector("audio");
              if (audio && !this.state.isPlaying) {
                this.attemptAutoplay(audio);
              }
            }, 500);
          }
        } else if (
          data.success &&
          data.data.playlists &&
          data.data.playlists.length > 0
        ) {
          // Fallback: use first playlist if no selected playlist
          this.state.playlist = data.data.playlists[0];

          // Check if playlist has tracks
          if (
            !this.state.playlist.tracks ||
            this.state.playlist.tracks.length === 0
          ) {
            this.showNoContentMessage("No tracks in playlist");
            return;
          }

          // Apply shuffle if enabled
          if (this.state.settings && this.state.settings.shuffle === true) {
            this.shufflePlaylist();
          } else {
            this.renderPlaylist();
            this.loadCurrentTrack();
          }

          // Restore saved playback state if available
          this.restorePlaybackState();

          // Update play button state after playlist is loaded
          this.updatePlayButton();

          // Trigger autoplay after playlist is loaded (if enabled and no saved state)
          if (
            this.shouldAutoplay() &&
            (!this.state.savedPlaybackState ||
              !this.state.savedPlaybackState.shouldResume)
          ) {
            // Small delay to ensure track is loaded
            setTimeout(() => {
              const audio = document.querySelector("audio");
              if (audio && !this.state.isPlaying) {
                this.attemptAutoplay(audio);
              }
            }, 500);
          }
        } else {
          this.showNoContentMessage("No playlists available");
        }
      } catch (error) {
        console.error("Error loading playlist:", error.message);
        this.showNoContentMessage("Failed to load playlist");
      }

      // Apply audio settings (loop, autoplay, shuffle)
      this.applyAudioSettings();
    },

    // Apply audio-specific settings
    applyAudioSettings: function () {
      const audio = document.querySelector("audio");
      if (!audio || !this.state.settings) return;

      const settings = this.state.settings;

      // Apply loop setting
      if (settings.loop !== undefined) {
        console.log("🔄 Applying loop setting:", settings.loop);
        audio.loop = settings.loop;
      }

      // Apply autoplay setting (note: autoplay is handled separately in loadCurrentTrack)
      if (settings.autoplay !== undefined) {
        console.log("▶️ Autoplay setting:", settings.autoplay);
        // Autoplay is handled in loadCurrentTrack function
      }

      // Apply shuffle setting
      if (settings.shuffle !== undefined) {
        console.log("🔀 Shuffle setting:", settings.shuffle);

        if (
          settings.shuffle &&
          this.state.playlist &&
          this.state.playlist.tracks
        ) {
          // Enable shuffle - shuffle the playlist
          this.shufflePlaylist();
        } else if (!settings.shuffle && this.state.originalPlaylistOrder) {
          // Disable shuffle - restore original order
          this.unshufflePlaylist();
        }
      }
    },

    // Show loading state in mini bar
    showLoadingState: function () {
      const miniTitle = document.querySelector(".mini-track-title");
      const miniArtist = document.querySelector(".mini-artist-name");
      const miniCover = document.querySelector(".current-track-image-mini");

      if (miniTitle) {
        miniTitle.innerHTML =
          '<span class="loading-dots">Loading<span>.</span><span>.</span><span>.</span></span>';
      }

      if (miniArtist) {
        miniArtist.textContent = "Initializing player...";
      }

      // Hide the cover image during loading to show only the blank disc
      if (miniCover) {
        miniCover.style.display = "none";
        miniCover.src = ""; // Clear the src to prevent broken image icon
      }
    },

    // Clear loading state
    clearLoadingState: function () {
      const miniTitle = document.querySelector(".mini-track-title");
      const miniArtist = document.querySelector(".mini-artist-name");
      const miniCover = document.querySelector(".current-track-image-mini");

      if (miniTitle) {
        miniTitle.innerHTML = "";
        miniTitle.removeAttribute("data-original-text");
      }

      if (miniArtist) {
        miniArtist.textContent = "";
      }

      // Restore cover image display when loading is complete
      if (miniCover) {
        miniCover.style.display = "block";
        // Set a default blank disc image if no track is loaded yet
        if (!miniCover.src || miniCover.src === window.location.href) {
          miniCover.src =
            "https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262";
        }
      }
    },

    // Show message in playlist area and mini bar
    showMessage: function (message) {
      // Show in modal track list
      const trackList = document.querySelector(".track-list");
      if (trackList) {
        trackList.innerHTML = `<li class="loading">${message}</li>`;
      }

      // Show in mini bar
      const miniTitle = document.querySelector(".mini-track-title");
      const miniArtist = document.querySelector(".mini-artist-name");

      if (miniTitle) {
        miniTitle.innerHTML =
          '<span class="loading-dots">Loading<span>.</span><span>.</span><span>.</span></span>';
      }

      if (miniArtist) {
        miniArtist.textContent = message;
      }
    },

    // Show no content message in mini bar
    showNoContentMessage: function (message) {
      // Clear loading state first
      this.clearLoadingState();

      // Update mini bar content to show the message
      const miniTitle = document.querySelector(".mini-track-title");
      const miniArtist = document.querySelector(".mini-artist-name");
      const miniCover = document.querySelector(".current-track-image-mini");
      const miniControls = document.querySelector(".mini-controls");
      const miniExpandBtn = document.querySelector(".mini-expand-btn");
      if (miniTitle) {
        miniTitle.textContent = message;
        miniTitle.setAttribute("data-original-text", message);
      }

      if (miniArtist) {
        miniArtist.textContent = "Add tracks to get started";
      }

      // Hide cover image to show only the blank disc background
      if (miniCover) {
        miniCover.style.display = "none";
        miniCover.src = ""; // Clear the src to prevent broken image icon
      }

      // Disable controls when no content
      if (miniControls) {
        miniControls.style.opacity = "0.5";
        miniControls.style.pointerEvents = "none";
      }

      if (miniExpandBtn) {
        miniExpandBtn.style.opacity = "0.5";
        miniExpandBtn.style.pointerEvents = "none";
      }

      // Update modal content as well
      const trackList = document.querySelector(".track-list");
      if (trackList) {
        trackList.innerHTML = `
          <li class="no-content-message">
            <div style="text-align: center; padding: 40px 20px; color: rgba(0,0,0,0.6);">
              <div style="font-size: 16px; margin-bottom: 10px;">${message}</div>
              <div style="font-size: 14px;">Add tracks to your playlist to start playing music</div>
            </div>
          </li>
        `;
      }

      // Update modal title
      const playlistTitle = document.querySelector(".playlist-title");
      if (playlistTitle) {
        playlistTitle.textContent = "No Content Available";
      }

      // Disable modal controls
      const modalControls = document.querySelectorAll(
        ".play-btn, .prev-btn, .next-btn, .volume-btn"
      );
      modalControls.forEach((control) => {
        control.style.opacity = "0.5";
        control.style.pointerEvents = "none";
      });
    },

    // Render playlist in the modal
    renderPlaylist: function () {
      if (!this.state.playlist || !this.state.playlist.tracks) return;

      // Clear loading state
      this.clearLoadingState();

      // Re-enable controls when content is available
      this.enableControls();

      // Use the actual playlist name from the API response
      const playlistTitle = this.state.playlist.name || "WEBEXP's Playlist";
      const playlistTitleElement = document.querySelector(".playlist-title");
      if (playlistTitleElement) {
        playlistTitleElement.textContent = playlistTitle;
      }

      const trackList = document.querySelector(".track-list");
      if (!trackList) return;

      // Limit tracks based on maxVisibleTracks setting
      let tracksToRender = this.state.playlist.tracks;
      if (this.state.maxVisibleTracks && this.state.maxVisibleTracks > 0) {
        tracksToRender = this.state.playlist.tracks.slice(
          0,
          this.state.maxVisibleTracks
        );
      }

      trackList.innerHTML = tracksToRender
        .map((playlistTrack, index) => {
          const track = playlistTrack.track;
          const isActive = index === this.state.currentTrackIndex;
          const duration = track.duration || 0;
          const durationText =
            duration > 0 ? this.formatTime(duration) : "--:--";

          return `
          <li class="track-item ${
            isActive ? "active" : ""
          }" data-index="${index}" data-track-url="${
            track.audioUrl
          }" data-track-title="${track.title}" data-artist-name="${
            track.artist || "WEBEXP"
          }" data-cover-image="${
            track.albumArt ||
            "https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262"
          }">
                <div class="track-thumbnail">
                  <div class="standard-thumbnail">
                <img src="${
                  track.albumArt ||
                  "https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262"
                }" alt="${track.title}">
                      </div>
              
                  <div class="playlist-disc-container disc-hidden">
                    <img class="playlist-disc-background" src="https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262" alt="Disc Background">
                <img class="playlist-disc-cover-image" src="${
                  track.albumArt ||
                  "https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262"
                }" alt="${track.title}">
                    <img class="playlist-disc-overlay" src="https://cdn.shopify.com/s/files/1/0707/3821/5234/files/Disc_1-min_webexp_top.png?v=1746221701" alt="Disc Overlay">
                    <div class="playlist-disc-center"></div>
                  </div>
                </div>
                <div class="track-details">
              <span class="playlist-track-title" data-original-text="${
                track.title
              }">${track.title}</span>
              <span class="playlist-artist-name">${
                track.artist || "WEBEXP"
              }</span>
                </div>
            <span class="track-duration" title="${durationText}">${durationText}</span>
              </li>
        `;
        })
        .join("");

      // Apply theme styles to new track items
      this.applyThemeToTrackItems();

      // Add click handlers to track items
      trackList.querySelectorAll(".track-item").forEach((item, index) => {
        item.addEventListener("click", () => {
          this.state.currentTrackIndex = index;
          this.loadCurrentTrack(true); // Auto-play when track is clicked
          this.updateActiveTrack();
        });
      });

      // Note: Track list titles should NOT have marquee - they display normally
      // Only update marquees for main player elements (mini bar and modal title)
      setTimeout(() => {
        this.updateAllMarquees();
        this.forceReinitializeMarquees(); // Force reinitialize after playlist render
      }, 100);

      // Fetch durations for tracks that don't have duration data
      this.fetchMissingDurations();

      // Update playlist track album art classes
      this.updatePlaylistAlbumArtClasses();

      // Apply rounded corners to track items
      this.applyRoundedCornersToTrackItems();

      // Apply visibility settings to newly rendered elements
      this.applyVisibilitySettings();
    },

    // Apply visibility settings to dynamically rendered elements
    applyVisibilitySettings: function () {
      if (!this.state.settings) return;

      const settings = this.state.settings;

      // Apply album art visibility setting
      if (settings.showAlbumArt !== undefined) {
        console.log(
          "🖼️ Applying showAlbumArt to rendered elements:",
          settings.showAlbumArt
        );
        const albumArts = document.querySelectorAll(
          ".track-thumbnail, .standard-thumbnail img, .playlist-disc-container"
        );
        albumArts.forEach((art) => {
          art.style.display = settings.showAlbumArt ? "block" : "none";
        });
      }

      // Apply track info visibility setting
      if (settings.showTrackInfo !== undefined) {
        console.log(
          "📝 Applying showTrackInfo to rendered elements:",
          settings.showTrackInfo
        );
        const trackTitles = document.querySelectorAll(".playlist-track-title");
        trackTitles.forEach((title) => {
          title.style.display = settings.showTrackInfo ? "block" : "none";
        });
      }

      // Apply artist name visibility setting
      if (settings.showArtistName !== undefined) {
        console.log(
          "👤 Applying showArtistName to rendered elements:",
          settings.showArtistName
        );
        const artistNames = document.querySelectorAll(".playlist-artist-name");
        artistNames.forEach((artist) => {
          artist.style.display = settings.showArtistName ? "block" : "none";
        });
      }

      // Apply track duration visibility setting
      if (settings.showTrackDuration !== undefined) {
        console.log(
          "⏱️ Applying showTrackDuration to rendered elements:",
          settings.showTrackDuration
        );
        const durations = document.querySelectorAll(".track-duration");
        durations.forEach((duration) => {
          duration.style.display = settings.showTrackDuration
            ? "block"
            : "none";
        });
      }
    },

    // Load current track into audio element
    loadCurrentTrack: function (shouldAutoPlay = false) {
      console.log('🎵 loadCurrentTrack called, shouldAutoPlay:', shouldAutoPlay);
      console.log('🎵 userPausedFromStorage:', this.state.userPausedFromStorage);
      
      if (
        !this.state.playlist ||
        !this.state.playlist.tracks[this.state.currentTrackIndex]
      )
        return;

      const playlistTrack =
        this.state.playlist.tracks[this.state.currentTrackIndex];
      const track = playlistTrack.track;

      console.log('🎵 Loading track:', track.title);
      this.state.currentTrack = track;
      const audio = document.querySelector("audio");
      if (audio) {
        audio.src = track.audioUrl;
        audio.load();

        // Set volume from state (default to 50% if not set)
        audio.volume = this.state.volume || 0.5;

        // Enhanced autoplay handling with mobile considerations
        if (shouldAutoPlay) {
          // For track progression (when shouldAutoPlay is true), ignore user pause preference
          // Only check user pause preference for initial autoplay, not track-to-track progression
          console.log('🎵 Auto-playing next track...');
          
          // Use playAudioWithErrorHandling for better reliability when continuing playback
          this.playAudioWithErrorHandling();
        } else {
          console.log('🎵 Not auto-playing (shouldAutoPlay is false)');
        }
      }

      this.updateTrackInfo();
      this.updateActiveTrack();

      // Update play button state after track is loaded
      this.updatePlayButton();

      // Update duration display after a short delay to ensure metadata is loaded
      setTimeout(() => {
        this.updateDurationDisplay();
      }, 100);
    },

    // Attempt autoplay with proper error handling
    attemptAutoplay: function (audio) {
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay successful
            this.state.isPlaying = true;
            this.updatePlayButton();
            this.updatePlayingState();
          })
          .catch((error) => {
            // Autoplay failed due to browser policy
            this.state.isPlaying = false;
            this.updatePlayButton();
            this.updatePlayingState();

            // Set up autoplay on first user interaction
            this.setupAutoplayOnInteraction(audio);
          });
      }
    },

    // Setup autoplay on first user interaction
    setupAutoplayOnInteraction: function (audio) {
      const startAutoplay = () => {
        if (
          this.shouldAutoplay() &&
          !this.state.isPlaying
        ) {
          audio
            .play()
            .then(() => {
              this.state.isPlaying = true;
              this.updatePlayButton();
              this.updatePlayingState();
            })
            .catch((error) => {
              // Autoplay failed silently
            });
        }

        // Remove event listeners after first interaction
        document.removeEventListener("click", startAutoplay);
        document.removeEventListener("touchstart", startAutoplay);
        document.removeEventListener("keydown", startAutoplay);
      };

      // Add event listeners for user interaction
      document.addEventListener("click", startAutoplay, { once: true });
      document.addEventListener("touchstart", startAutoplay, { once: true });
      document.addEventListener("keydown", startAutoplay, { once: true });
    },

    // Update track information display
    updateTrackInfo: function () {
      if (!this.state.currentTrack) return;

      // Clear loading state if present
      this.clearLoadingState();

      const track = this.state.currentTrack;

      // Update mini bar
      const miniTitle = document.querySelector(".mini-track-title");
      const miniArtist = document.querySelector(".mini-artist-name");
      const miniCover = document.querySelector(".current-track-image-mini");

      if (miniTitle) {
        this.updateMarqueeText(miniTitle, track.title);
      }
      if (miniArtist) {
        miniArtist.textContent = track.artist || "WEBEXP";
      }
      if (miniCover) {
        miniCover.src =
          track.albumArt ||
          "https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262";
      }

      // Update modal
      const trackTitle = document.querySelector(".track-title");
      const artistName = document.querySelector(".artist-name");
      const currentCover = document.querySelector(".current-track-image");

      if (trackTitle) {
        this.updateMarqueeText(trackTitle, track.title);
      }
      if (artistName) {
        artistName.textContent = track.artist || "WEBEXP";
      }
      if (currentCover) {
        currentCover.src =
          track.albumArt ||
          "https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262";
      }

      // Update disc cover images
      const miniDiscCover = document.querySelector(".mini-disc-cover-image");
      const modalDiscCover = document.querySelector(".modal-disc-cover-image");

      if (miniDiscCover) {
        miniDiscCover.src =
          track.albumArt ||
          "https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262";
      }
      if (modalDiscCover) {
        modalDiscCover.src =
          track.albumArt ||
          "https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262";
      }

      // Update floating button artwork
      const floatingButtonCover = document.querySelector(
        ".current-track-image-btn"
      );
      if (floatingButtonCover) {
        floatingButtonCover.src =
          track.albumArt ||
          "https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262";
      }

      // Update disc container classes to show/hide overlay based on album art
      const hasAlbumArt =
        track.albumArt &&
        track.albumArt !==
          "https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262";

      // Update mini disc container
      const miniDiscContainer = document.querySelector(".mini-disc-container");
      if (miniDiscContainer) {
        miniDiscContainer.classList.toggle("has-album-art", hasAlbumArt);
      }

      // Update modal disc container
      const modalDiscContainer = document.querySelector(
        ".modal-disc-container"
      );
      if (modalDiscContainer) {
        modalDiscContainer.classList.toggle("has-album-art", hasAlbumArt);
      }

      // Update floating button disc container
      const floatingButtonDiscContainer =
        document.querySelector(".disc-container");
      if (floatingButtonDiscContainer) {
        floatingButtonDiscContainer.classList.toggle(
          "has-album-art",
          hasAlbumArt
        );
      }

      // Update marquees after a short delay to ensure DOM is ready
      // Note: This only updates main player marquees, not track list titles
      setTimeout(() => {
        this.updateAllMarquees();
        this.forceReinitializeMarquees(); // Force reinitialize after track update
      }, 100);
    },

    // Update marquee for all track titles (excluding track list)
    updateAllMarquees: function () {
      // Update mini bar title
      const miniTitle = document.querySelector(".mini-track-title");
      if (miniTitle && this.state.currentTrack) {
        this.updateMarqueeText(miniTitle, this.state.currentTrack.title);
      }

      // Update modal title
      const trackTitle = document.querySelector(".track-title");
      if (trackTitle && this.state.currentTrack) {
        this.updateMarqueeText(trackTitle, this.state.currentTrack.title);
      }

      // Note: Playlist track titles in the track list should NOT have marquee
      // They should display normally without scrolling animation
    },

    // Force reinitialize marquees (useful for modal opening)
    forceReinitializeMarquees: function () {
      // For CSS marquees, we just need to update all marquees
      this.updateAllMarquees();
    },

    // Next track
    nextTrack: function () {
      if (!this.state.playlist) return;

      const wasPlaying = this.state.isPlaying;
      console.log('🎵 nextTrack called, wasPlaying:', wasPlaying);

      if (
        this.state.currentTrackIndex <
        this.state.playlist.tracks.length - 1
      ) {
        this.state.currentTrackIndex++;
        console.log('🎵 Moving to track index:', this.state.currentTrackIndex);
        this.loadCurrentTrack(wasPlaying);
        this.savePlaybackState();
      } else {
        // Check if loop is enabled (loop current track)
        if (this.state.settings && this.state.settings.loop === true) {
          // Loop current track (don't change index)
          console.log('🎵 Looping current track');
          this.loadCurrentTrack(wasPlaying);
          this.savePlaybackState();
        } else {
          // End of playlist reached - replay entire playlist from beginning
          this.state.currentTrackIndex = 0;
          console.log('🎵 Playlist finished, replaying from first track');
          this.loadCurrentTrack(wasPlaying);
          this.savePlaybackState();
        }
      }
    },

    // Next track with forced autoplay (for natural track progression)
    nextTrackWithAutoplay: function () {
      if (!this.state.playlist) return;

      console.log('🎵 nextTrackWithAutoplay called - forcing autoplay');

      if (
        this.state.currentTrackIndex <
        this.state.playlist.tracks.length - 1
      ) {
        this.state.currentTrackIndex++;
        console.log('🎵 Moving to track index:', this.state.currentTrackIndex);
        this.loadCurrentTrack(true); // Always pass true for autoplay
        this.savePlaybackState();
      } else {
        // Check if loop is enabled (loop current track)
        if (this.state.settings && this.state.settings.loop === true) {
          // Loop current track (don't change index)
          console.log('🎵 Looping current track');
          this.loadCurrentTrack(true); // Always pass true for autoplay
          this.savePlaybackState();
        } else {
          // End of playlist reached - replay entire playlist from beginning
          this.state.currentTrackIndex = 0;
          console.log('🎵 Playlist finished, replaying from first track');
          this.loadCurrentTrack(true); // Always pass true for autoplay
          this.savePlaybackState();
        }
      }
    },

    // Previous track
    prevTrack: function () {
      if (!this.state.playlist) return;

      const wasPlaying = this.state.isPlaying;

      if (this.state.currentTrackIndex > 0) {
        this.state.currentTrackIndex--;
        this.loadCurrentTrack(wasPlaying);
        this.savePlaybackState();
      } else {
        // Check if loop is enabled
        if (this.state.settings && this.state.settings.loop === true) {
          // Loop to last track
          this.state.currentTrackIndex = this.state.playlist.tracks.length - 1;
          this.loadCurrentTrack(wasPlaying);
          this.savePlaybackState();
        } else {
          // Stop at the beginning of playlist
          this.pauseTrack();
          this.state.currentTrackIndex = 0;
          this.savePlaybackState();
        }
      }
    },

    // Update duration display when audio metadata is loaded
    updateDurationDisplay: function () {
      const audio = document.querySelector("audio");
      const remainingTime = document.querySelector(".remaining-time");

      if (audio && remainingTime) {
        if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
          remainingTime.textContent = this.formatTime(audio.duration);
        } else {
          remainingTime.textContent = "0:00";
        }
      }
    },

    // Update progress bar
    updateProgress: function () {
      const audio = document.querySelector("audio");
      if (!audio || !audio.duration) return;

      const progress = (audio.currentTime / audio.duration) * 100;

      // Update main progress bar
      const progressBar = document.querySelector(".progress");
      if (progressBar) {
        progressBar.style.width = progress + "%";
      }

      // Update mini progress bar
      const miniProgress = document.querySelector(".mini-progress");
      if (miniProgress) {
        miniProgress.style.width = progress + "%";
      }

      // Update time display
      const currentTime = document.querySelector(".current-time");
      const remainingTime = document.querySelector(".remaining-time");

      if (currentTime) {
        currentTime.textContent = this.formatTime(audio.currentTime);
      }
      if (remainingTime) {
        // Handle case when duration is not available (NaN or 0)
        if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
          remainingTime.textContent = this.formatTime(
            audio.duration - audio.currentTime
          );
        } else {
          remainingTime.textContent = "0:00";
        }
      }
    },

    // Enable controls when content is available
    enableControls: function () {
      const miniControls = document.querySelector(".mini-controls");
      const miniExpandBtn = document.querySelector(".mini-expand-btn");
      const miniCover = document.querySelector(".current-track-image-mini");
      const modalControls = document.querySelectorAll(
        ".play-btn, .prev-btn, .next-btn, .volume-btn"
      );

      // Re-enable mini bar controls
      if (miniControls) {
        miniControls.style.opacity = "1";
        miniControls.style.pointerEvents = "auto";
      }

      if (miniExpandBtn) {
        miniExpandBtn.style.opacity = "1";
        miniExpandBtn.style.pointerEvents = "auto";
      }

      // Show cover image when content is available
      if (miniCover) {
        miniCover.style.display = "block";
      }

      // Re-enable modal controls
      modalControls.forEach((control) => {
        control.style.opacity = "1";
        control.style.pointerEvents = "auto";
      });
    },

    // Ensure free plan users start in correct state
    ensureFreePlanState: function () {
      // Check if user is on free plan
      const isFreePlan = this.isFreePlan();

      if (isFreePlan) {
        const isHomepage = this.isHomepage();

        if (isHomepage) {
          // On homepage, ensure player is paused initially
          const audio = document.querySelector("audio");
          if (audio) {
            audio.pause();
            this.state.isPlaying = false;
            this.updatePlayButton();
            this.updatePlayingState();
          }
        }
      }
    },

    // Enforce plan-specific restrictions
    enforcePlanRestrictions: function () {
      // Implement any additional restrictions based on the plan
      // For example, you can check the plan limits and apply restrictions
      // This is just a placeholder and should be replaced with actual logic
      if (this.state.settings && this.state.settings.planLimits) {
        // Check for specific restrictions and apply them
        if (this.state.settings.planLimits.maxVisibleTracks) {
          const trackList = document.querySelector(".track-list");
          if (trackList) {
            trackList.style.maxHeight = `${
              this.state.settings.planLimits.maxVisibleTracks * 60
            }px`;
          }
        }
        if (this.state.settings.planLimits.persistentPlayback) {
          this.state.persistentPlayback = true;
        }
        if (this.state.settings.planLimits.autoplay) {
          // Autoplay is enabled in plan limits - don't override user preference
          console.log("✅ Autoplay enabled in plan limits");
        }
      }
    },

    // Apply dark theme styles
    applyDarkTheme: function () {
      const miniBar = document.querySelector(".mini-music-bar");
      const floatingButton = document.querySelector(".music-toggle-btn");
      const modal = document.querySelector(".audio-player-playlist");

      if (miniBar) {
        miniBar.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        miniBar.style.color = "#ffffff";
      }

      if (floatingButton) {
        floatingButton.style.backgroundColor = "#000000";
        const floatingButtonSvg = floatingButton.querySelector("svg");
        if (floatingButtonSvg) {
          floatingButtonSvg.style.fill = "#ffffff";
        }
      }

      if (modal) {
        modal.style.backgroundColor = "#1a1a1a";
        modal.style.color = "#ffffff";
      }

      // Apply dark theme to SVG icons (excluding mini-play-btn which is handled separately)
      const svgIcons = document.querySelectorAll(
        ".mini-prev-btn svg, .mini-next-btn svg, .mini-expand-btn svg, .close-modal-btn svg, .prev-btn svg, .next-btn svg, .volume-btn svg"
      );
      svgIcons.forEach((svg) => {
        svg.style.fill = "#ffffff";
      });

      // Apply dark theme to play button
      const playBtn = document.querySelector(".play-btn");
      if (playBtn) {
        playBtn.style.backgroundColor = "#ffffff";
        // Apply to both play and pause icons
        const playIcon = playBtn.querySelector(".play-icon");
        const pauseIcon = playBtn.querySelector(".pause-icon");
        if (playIcon) {
          playIcon.style.fill = "#000000";
        }
        if (pauseIcon) {
          pauseIcon.style.fill = "#000000";
        }
      }

      // Apply dark theme to mini play button
      const miniPlayBtn = document.querySelector(".mini-play-btn");
      if (miniPlayBtn) {
        const miniPlayIcon = miniPlayBtn.querySelector(".mini-play-icon");
        const miniPauseIcon = miniPlayBtn.querySelector(".mini-pause-icon");
        if (miniPlayIcon) {
          miniPlayIcon.style.fill = "#ffffff";
        }
        if (miniPauseIcon) {
          miniPauseIcon.style.fill = "#ffffff";
        }
      }

      // Apply dark theme to text elements
      const mainTextElements = document.querySelectorAll(
        ".track-title, .playlist-title"
      );
      console.log(
        "🎨 Dark theme - Found main text elements:",
        mainTextElements.length
      );
      mainTextElements.forEach((el) => {
        el.style.setProperty("color", "#ffffff", "important");
        console.log("🎨 Applied white color to:", el.className, el);
      });

      // Apply dark theme to marquee content
      const marqueeContentElements =
        document.querySelectorAll(".marquee-content");
      console.log(
        "🎨 Dark theme - Found marquee content elements:",
        marqueeContentElements.length
      );
      marqueeContentElements.forEach((el) => {
        el.style.setProperty("color", "#ffffff", "important");
        console.log("🎨 Applied white color to marquee content:", el);
      });

      const secondaryTextElements = document.querySelectorAll(
        ".mini-artist-name, .artist-name, .playlist-artist-name"
      );
      secondaryTextElements.forEach((el) => {
        el.style.color = "rgba(255, 255, 255, 0.8)";
      });

      const miniTrackTitles = document.querySelectorAll(".mini-track-title");
      miniTrackTitles.forEach((el) => {
        el.style.color = "#ffffff";
      });

      const timeElements = document.querySelectorAll(
        ".time-display, .track-duration"
      );
      timeElements.forEach((el) => {
        el.style.color = "rgba(255, 255, 255, 0.6)";
      });

      // Apply dark theme to progress bars
      const progressBars = document.querySelectorAll(
        ".progress-bar, .mini-progress-container"
      );
      progressBars.forEach((el) => {
        el.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      });

      const progressFills = document.querySelectorAll(
        ".progress, .mini-progress"
      );
      progressFills.forEach((el) => {
        el.style.backgroundColor = "#ffffff";
      });

      // Apply dark theme to disc centers
      const discCenters = document.querySelectorAll(
        ".disc-center, .mini-disc-center, .modal-disc-center, .playlist-disc-center"
      );
      discCenters.forEach((el) => {
        el.style.backgroundColor = "#000000";
      });

      // Apply dark theme to volume slider container
      const volumeSliderContainer = document.querySelector(".volume-slider-container");
      if (volumeSliderContainer) {
        volumeSliderContainer.style.backgroundColor = "#000000";
      }
      
      // Apply theme to playlist track items
      this.applyThemeToTrackItems();
    },

    // Apply light theme styles
    applyLightTheme: function () {
      const miniBar = document.querySelector(".mini-music-bar");
      const floatingButton = document.querySelector(".music-toggle-btn");
      const modal = document.querySelector(".audio-player-playlist");

      if (miniBar) {
        miniBar.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
        miniBar.style.color = "#000000";
      }

      if (floatingButton) {
        floatingButton.style.backgroundColor = "#ffffff";
        const floatingButtonSvg = floatingButton.querySelector("svg");
        if (floatingButtonSvg) {
          floatingButtonSvg.style.fill = "#000000";
        }
      }

      if (modal) {
        modal.style.backgroundColor = "#ffffff";
        modal.style.color = "#000000";
      }

      // Apply light theme to SVG icons (excluding mini-play-btn which is handled separately)
      const svgIcons = document.querySelectorAll(
        ".mini-prev-btn svg, .mini-next-btn svg, .mini-expand-btn svg, .close-modal-btn svg, .prev-btn svg, .next-btn svg, .volume-btn svg"
      );
      svgIcons.forEach((svg) => {
        svg.style.fill = "#000000";
      });

      // Apply light theme to play button
      const playBtn = document.querySelector(".play-btn");
      if (playBtn) {
        playBtn.style.backgroundColor = "#000000";
        // Apply to both play and pause icons
        const playIcon = playBtn.querySelector(".play-icon");
        const pauseIcon = playBtn.querySelector(".pause-icon");
        if (playIcon) {
          playIcon.style.fill = "#ffffff";
        }
        if (pauseIcon) {
          pauseIcon.style.fill = "#ffffff";
        }
      }

      // Apply light theme to mini play button
      const miniPlayBtn = document.querySelector(".mini-play-btn");
      if (miniPlayBtn) {
        const miniPlayIcon = miniPlayBtn.querySelector(".mini-play-icon");
        const miniPauseIcon = miniPlayBtn.querySelector(".mini-pause-icon");
        if (miniPlayIcon) {
          miniPlayIcon.style.fill = "#000000";
        }
        if (miniPauseIcon) {
          miniPauseIcon.style.fill = "#000000";
        }
      }

      // Apply light theme to text elements
      const mainTextElements = document.querySelectorAll(
        ".track-title, .playlist-title"
      );
      mainTextElements.forEach((el) => {
        el.style.setProperty("color", "#000000", "important");
      });

      // Apply light theme to marquee content
      const marqueeContentElements =
        document.querySelectorAll(".marquee-content");
      console.log(
        "🎨 Light theme - Found marquee content elements:",
        marqueeContentElements.length
      );
      marqueeContentElements.forEach((el) => {
        el.style.setProperty("color", "#000000", "important");
      });

      const secondaryTextElements = document.querySelectorAll(
        ".mini-artist-name, .artist-name, .playlist-artist-name"
      );
      secondaryTextElements.forEach((el) => {
        el.style.color = "rgba(0, 0, 0, 0.8)";
      });

      const miniTrackTitles = document.querySelectorAll(".mini-track-title");
      miniTrackTitles.forEach((el) => {
        el.style.color = "#000000";
      });

      const timeElements = document.querySelectorAll(
        ".time-display, .track-duration"
      );
      timeElements.forEach((el) => {
        el.style.color = "rgba(0, 0, 0, 0.6)";
      });

      // Apply light theme to progress bars
      const progressBars = document.querySelectorAll(
        ".progress-bar, .mini-progress-container"
      );
      progressBars.forEach((el) => {
        el.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
      });

      const progressFills = document.querySelectorAll(
        ".progress, .mini-progress"
      );
      progressFills.forEach((el) => {
        el.style.backgroundColor = "#000000";
      });

      // Apply light theme to disc centers
      const discCenters = document.querySelectorAll(
        ".disc-center, .mini-disc-center, .modal-disc-center, .playlist-disc-center"
      );
      discCenters.forEach((el) => {
        el.style.backgroundColor = "#ffffff";
      });

      // Apply light theme to volume slider container
      const volumeSliderContainer = document.querySelector(".volume-slider-container");
      if (volumeSliderContainer) {
        volumeSliderContainer.style.backgroundColor = "#ffffff";
      }
      
      // Apply theme to playlist track items
      this.applyThemeToTrackItems();
    },
  });
}
