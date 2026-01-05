const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPlan(shopDomain) {
  try {
    console.log(`Checking plan for shop: ${shopDomain}`);
    
    // Get subscription data
    const subscription = await prisma.subscription.findUnique({
      where: { shopId: shopDomain },
    });

    if (!subscription) {
      console.log('❌ No subscription found - defaulting to Free Plan');
      return;
    }

    console.log('📋 Subscription Details:');
    console.log(`   Plan Name: ${subscription.planName}`);
    console.log(`   Status: ${subscription.status}`);
    console.log(`   Subscription ID: ${subscription.subscriptionId || 'N/A'}`);
    
    console.log('\n🔒 Plan Limits:');
    console.log(`   Max Playlists: ${subscription.maxPlaylists === -1 ? 'Unlimited' : subscription.maxPlaylists}`);
    console.log(`   Max Tracks Per Playlist: ${subscription.maxTracksPerPlaylist === -1 ? 'Unlimited' : subscription.maxTracksPerPlaylist}`);
    console.log(`   Max Total Tracks: ${subscription.maxTotalTracks === -1 ? 'Unlimited' : subscription.maxTotalTracks}`);
    console.log(`   Persistent Playback: ${subscription.persistentPlayback ? 'Yes' : 'No'}`);
    console.log(`   Full Customization: ${subscription.fullCustomization ? 'Yes' : 'No'}`);
    console.log(`   Homepage Only: ${subscription.homepageOnly ? 'Yes' : 'No'}`);
    
    // Check current usage
    const playlists = await prisma.playlist.count({
      where: { storeId: shopDomain, isActive: true },
    });
    
    const tracks = await prisma.track.count({
      where: { storeId: shopDomain, isActive: true },
    });
    
    console.log('\n📊 Current Usage:');
    console.log(`   Playlists: ${playlists}`);
    console.log(`   Tracks: ${tracks}`);
    
    // Determine plan type
    const isProPlan = subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan';
    
    console.log('\n🎯 Plan Type:');
    if (isProPlan) {
      console.log('   ✅ PRO PLAN - Full Experience');
      console.log('   Features:');
      console.log('   - Player shows across full website');
      console.log('   - Continuous seamless playback');
      console.log('   - Autoplay enabled');
      console.log('   - Unlimited playlists and tracks');
      console.log('   - Mini-bar or floating disc options');
      console.log('   - Light or Dark theme options');
      console.log('   - Branding can be turned off');
    } else {
      console.log('   🆓 FREE PLAN - Demo Mode');
      console.log('   Features:');
      console.log('   - Player only shows on homepage');
      console.log('   - No continuous playback across pages');
      console.log('   - Limited to 1 playlist');
      console.log('   - Up to 2 tracks per playlist');
      console.log('   - Layout locked to mini-bar');
      console.log('   - Theme locked to light mode');
      console.log('   - Always show "POWERED BY WEBEXP" badge');
    }
    
  } catch (error) {
    console.error('❌ Error checking plan:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get shop domain from command line argument
const shopDomain = process.argv[2];

if (!shopDomain) {
  console.error('❌ Please provide a shop domain as an argument');
  console.log('Usage: node scripts/check-plan.js <shop-domain>');
  console.log('Example: node scripts/check-plan.js test-guleria-store.myshopify.com');
  process.exit(1);
}

// Run the check
checkPlan(shopDomain);
