#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🧪 Testing Music Player Database...\n');

    // Test 1: Create a store
    console.log('1. Creating test store...');
    const store = await prisma.store.upsert({
      where: { shop: 'demo-store.myshopify.com' },
      update: {},
      create: {
        shop: 'demo-store.myshopify.com',
        musicPlayerEnabled: true,
        musicPlayerSettings: {
          playerEnabled: true,
          displayMode: 'button',
          colorScheme: 'light',
          roundedCorners: true,
          playlistTitle: 'My Playlist',
          buttonSize: 60,
          buttonPosition: 'bottom-right',
          showDisk: true,
          audioPlayerOpacity: 100,
          audioPlayerColor: '#ffffff',
          autoplay: false,
          loop: false,
          shuffle: false,
          defaultVolume: 50,
          showMiniPlayer: true,
        },
      },
    });
    console.log('✅ Store created:', store.shop);

    // Test 2: Create sample tracks
    console.log('\n2. Creating sample tracks...');
    const tracks = await Promise.all([
      prisma.track.create({
        data: {
          title: 'XO Tour Llif3',
          artist: 'Lil Uzi Vert',
          albumArt: 'https://example.com/album1.jpg',
          audioUrl: 'https://example.com/song1.mp3',
          duration: 182,
          storeId: store.shop,
        },
      }),
      prisma.track.create({
        data: {
          title: 'King Of The Fall',
          artist: 'The Weeknd',
          albumArt: 'https://example.com/album2.jpg',
          audioUrl: 'https://example.com/song2.mp3',
          duration: 301,
          storeId: store.shop,
        },
      }),
      prisma.track.create({
        data: {
          title: 'BACKSTREETS (FEAT. TEEZO TOUCHDOWN)',
          artist: 'Don Toliver',
          albumArt: 'https://example.com/album3.jpg',
          audioUrl: 'https://example.com/song3.mp3',
          duration: 29,
          storeId: store.shop,
        },
      }),
    ]);
    console.log(`✅ Created ${tracks.length} tracks`);

    // Test 3: Create a playlist
    console.log('\n3. Creating sample playlist...');
    const playlist = await prisma.playlist.create({
      data: {
        name: 'WEBEXP\'s Playlist',
        description: 'A sample playlist for testing',
        storeId: store.shop,
      },
    });
    console.log('✅ Playlist created:', playlist.name);

    // Test 4: Add tracks to playlist
    console.log('\n4. Adding tracks to playlist...');
    const playlistTracks = await Promise.all(
      tracks.map((track, index) =>
        prisma.playlistTrack.create({
          data: {
            playlistId: playlist.id,
            trackId: track.id,
            order: index,
          },
        })
      )
    );
    console.log(`✅ Added ${playlistTracks.length} tracks to playlist`);

    // Test 5: Query everything
    console.log('\n5. Testing queries...');
    const allPlaylists = await prisma.playlist.findMany({
      where: { storeId: store.shop },
      include: {
        tracks: {
          include: { track: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    console.log(`✅ Found ${allPlaylists.length} playlists`);

    const allTracks = await prisma.track.findMany({
      where: { storeId: store.shop },
    });
    console.log(`✅ Found ${allTracks.length} tracks`);

    const settings = await prisma.store.findUnique({
      where: { shop: store.shop },
      select: {
        musicPlayerEnabled: true,
        musicPlayerSettings: true,
      },
    });
    console.log('✅ Settings retrieved:', settings?.musicPlayerEnabled);

    console.log('\n🎉 Database test completed successfully!');
    console.log('\nSample data created:');
    console.log(`- Store: ${store.shop}`);
    console.log(`- Playlist: ${playlist.name}`);
    console.log(`- Tracks: ${tracks.length} tracks`);

  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
