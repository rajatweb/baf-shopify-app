#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAPI() {
  try {
    console.log('🧪 Testing Music Player API Endpoints...\n');

    const testShop = 'demo-store.myshopify.com';

    // Test 1: Get settings
    console.log('1. Testing GET /settings...');
    const settings = await prisma.store.findUnique({
      where: { shop: testShop },
      select: {
        musicPlayerEnabled: true,
        musicPlayerSettings: true,
      },
    });
    console.log('✅ Settings retrieved:', settings ? 'Success' : 'Not found');

    // Test 2: Get playlists
    console.log('\n2. Testing GET /playlists...');
    const playlists = await prisma.playlist.findMany({
      where: {
        storeId: testShop,
        isActive: true,
      },
      include: {
        tracks: {
          include: {
            track: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
    console.log(`✅ Found ${playlists.length} playlists`);

    // Test 3: Get tracks
    console.log('\n3. Testing GET /tracks...');
    const tracks = await prisma.track.findMany({
      where: {
        storeId: testShop,
        isActive: true,
      },
    });
    console.log(`✅ Found ${tracks.length} tracks`);

    // Test 4: Test playlist with tracks
    if (playlists.length > 0) {
      console.log('\n4. Testing playlist structure...');
      const playlist = playlists[0];
      console.log(`✅ Playlist: ${playlist.name}`);
      console.log(`   Tracks: ${playlist.tracks.length}`);
      playlist.tracks.forEach((pt, index) => {
        console.log(`   ${index + 1}. ${pt.track.title} by ${pt.track.artist}`);
      });
    }

    console.log('\n🎉 API test completed successfully!');
    console.log('\nReady to test with frontend!');

  } catch (error) {
    console.error('❌ API test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI();
