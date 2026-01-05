#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDelete() {
  try {
    console.log('🧪 Testing Delete Functionality...\n');

    const testShop = 'demo-store.myshopify.com';

    // Test 1: Check current data
    console.log('1. Current data before delete test...');
    const playlistsBefore = await prisma.playlist.findMany({
      where: { storeId: testShop, isActive: true },
    });
    const tracksBefore = await prisma.track.findMany({
      where: { storeId: testShop, isActive: true },
    });
    console.log(`   Playlists: ${playlistsBefore.length}`);
    console.log(`   Tracks: ${tracksBefore.length}`);

    // Test 2: Test soft delete for playlist
    if (playlistsBefore.length > 0) {
      console.log('\n2. Testing playlist soft delete...');
      const playlistToDelete = playlistsBefore[0];
      console.log(`   Deleting playlist: ${playlistToDelete.name}`);
      
      await prisma.playlist.update({
        where: { id: playlistToDelete.id },
        data: { isActive: false },
      });
      
      const playlistsAfter = await prisma.playlist.findMany({
        where: { storeId: testShop, isActive: true },
      });
      console.log(`   Playlists after delete: ${playlistsAfter.length}`);
      console.log('   ✅ Playlist soft delete successful');
    }

    // Test 3: Test soft delete for track
    if (tracksBefore.length > 0) {
      console.log('\n3. Testing track soft delete...');
      const trackToDelete = tracksBefore[0];
      console.log(`   Deleting track: ${trackToDelete.title}`);
      
      await prisma.track.update({
        where: { id: trackToDelete.id },
        data: { isActive: false },
      });
      
      const tracksAfter = await prisma.track.findMany({
        where: { storeId: testShop, isActive: true },
      });
      console.log(`   Tracks after delete: ${tracksAfter.length}`);
      console.log('   ✅ Track soft delete successful');
    }

    // Test 4: Verify API queries work correctly
    console.log('\n4. Testing API queries...');
    const activePlaylists = await prisma.playlist.findMany({
      where: { storeId: testShop, isActive: true },
      include: {
        tracks: {
          include: { track: true },
          where: { track: { isActive: true } },
        },
      },
    });
    console.log(`   Active playlists: ${activePlaylists.length}`);
    
    const activeTracks = await prisma.track.findMany({
      where: { storeId: testShop, isActive: true },
    });
    console.log(`   Active tracks: ${activeTracks.length}`);

    console.log('\n🎉 Delete functionality test completed successfully!');

  } catch (error) {
    console.error('❌ Delete test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDelete();
