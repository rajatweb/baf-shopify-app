/**
 *
 * It's relatively easy to overload this function that will result in a long first open time.
 * If something can happen in the background, don't `await FreshInstall()` and instead just
 * `FreshInstall()` in isInitialLoad function.
 *
 */

import prisma from "./prisma";

const freshInstall = async (
  {
    shop,
    userData,
  }: {
    shop: string;
    accessToken: string;
    userData: any;
  },
) => {
  await prisma.store.upsert({
    where: {
      shop: shop,
    },
    update: {
      isActive: true,
      shop: shop,
      musicPlayerSettings: {
        // General Settings
        displayMode: 'mini-bar',
        colorScheme: 'light',
        roundedCorners: true,
        
        // Floating Button Settings
        buttonSize: 60,
        buttonPosition: 'bottom-right',
        
        // Player Appearance
        showAlbumArt: true,
        showTrackInfo: true,
        playerOpacity: 100,
        
        // Audio Settings
        autoplay: false,
        loop: false,
        shuffle: false,
        showMiniPlayer: true,
        
        // Playlist Settings
        showTrackDuration: true,
        showArtistName: true,
        
        // Legacy settings for backward compatibility
        playerTheme: "light",
        playerPosition: "bottom",
        persistentPlayback: true,
      },
    },
    create: {
      isActive: true,
      shop: shop,
      musicPlayerSettings: {
        // General Settings
        displayMode: 'mini-bar',
        colorScheme: 'light',
        roundedCorners: true,
        
        // Floating Button Settings
        buttonSize: 60,
        buttonPosition: 'bottom-right',
        
        // Player Appearance
        showAlbumArt: true,
        showTrackInfo: true,
        playerOpacity: 100,
        
        // Audio Settings
        autoplay: false,
        loop: false,
        shuffle: false,
        defaultVolume: 50,
        showMiniPlayer: true,
        
        // Playlist Settings
        maxVisibleTracks: 5,
        showTrackDuration: true,
        showArtistName: true,
        
        // Legacy settings for backward compatibility
        playerTheme: "light",
        playerPosition: "bottom",
        persistentPlayback: true,
      },
    },
  });
};

export default freshInstall;
