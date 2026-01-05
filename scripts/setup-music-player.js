#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupMusicPlayer() {
  try {
    console.log('🎵 Setting up Music Player database...');

    // Create a sample store if it doesn't exist
    const sampleStore = await prisma.store.upsert({
      where: { shop: 'demo-store.myshopify.com' },
      update: {},
      create: {
        shop: 'demo-store.myshopify.com',
        isActive: true,
        musicPlayerEnabled: true,
        musicPlayerSettings: {
          theme: 'light',
          playerPosition: 'bottom',
          volume: 50,
          showMiniPlayer: true,
          autoplay: false,
          loop: false,
          shuffle: false
        }
      }
    });

    console.log('✅ Store created/updated:', sampleStore.shop);

    // Create sample tracks
    const tracks = await Promise.all([
      prisma.track.upsert({
        where: { id: 'demo-track-1' },
        update: {},
        create: {
          id: 'demo-track-1',
          title: 'Drugs You Should Try It',
          artist: 'Travis Scott',
          albumArt: 'https://via.placeholder.com/300x300/007bff/ffffff?text=Album+Art',
          audioUrl: 'https://sample-audio-url.com/track1.mp3',
          duration: 180,
          storeId: sampleStore.shop
        }
      }),
      prisma.track.upsert({
        where: { id: 'demo-track-2' },
        update: {},
        create: {
          id: 'demo-track-2',
          title: 'XO Tour Llif3',
          artist: 'Lil Uzi Vert',
          albumArt: 'https://via.placeholder.com/300x300/28a745/ffffff?text=Album+Art',
          audioUrl: 'https://sample-audio-url.com/track2.mp3',
          duration: 200,
          storeId: sampleStore.shop
        }
      }),
      prisma.track.upsert({
        where: { id: 'demo-track-3' },
        update: {},
        create: {
          id: 'demo-track-3',
          title: 'King Of The Fall',
          artist: 'The Weeknd',
          albumArt: 'https://via.placeholder.com/300x300/dc3545/ffffff?text=Album+Art',
          audioUrl: 'https://sample-audio-url.com/track3.mp3',
          duration: 220,
          storeId: sampleStore.shop
        }
      }),
      prisma.track.upsert({
        where: { id: 'demo-track-4' },
        update: {},
        create: {
          id: 'demo-track-4',
          title: 'BACKSTREETS (FEAT. TEEZO TOUCHDOWN)',
          artist: 'Don Toliver',
          albumArt: 'https://via.placeholder.com/300x300/ffc107/ffffff?text=Album+Art',
          audioUrl: 'https://sample-audio-url.com/track4.mp3',
          duration: 190,
          storeId: sampleStore.shop
        }
      })
    ]);

    console.log('✅ Sample tracks created:', tracks.length);

    // Create a sample playlist
    const playlist = await prisma.playlist.upsert({
      where: { id: 'demo-playlist-1' },
      update: {},
      create: {
        id: 'demo-playlist-1',
        name: "WEBEXP's Playlist",
        description: 'A curated collection of the best tracks',
        storeId: sampleStore.shop
      }
    });

    console.log('✅ Sample playlist created:', playlist.name);

    // Add tracks to playlist
    const playlistTracks = await Promise.all(
      tracks.map((track, index) =>
        prisma.playlistTrack.upsert({
          where: {
            playlistId_trackId: {
              playlistId: playlist.id,
              trackId: track.id
            }
          },
          update: { order: index },
          create: {
            playlistId: playlist.id,
            trackId: track.id,
            order: index
          }
        })
      )
    );

    console.log('✅ Tracks added to playlist:', playlistTracks.length);

    console.log('\n🎉 Music Player setup complete!');
    console.log('\nSample data created:');
    console.log(`- Store: ${sampleStore.shop}`);
    console.log(`- Playlist: ${playlist.name}`);
    console.log(`- Tracks: ${tracks.length} tracks`);
    console.log('\nYou can now test the music player with this sample data.');

  } catch (error) {
    console.error('❌ Error setting up Music Player:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupMusicPlayer();
