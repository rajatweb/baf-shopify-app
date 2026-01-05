const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPlaylistCreationLogic(shopDomain) {
  try {
    console.log(`🧪 Testing Playlist Creation Logic for shop: ${shopDomain}`);
    console.log('=' .repeat(60));
    
    // Get current subscription data
    const subscription = await prisma.subscription.findUnique({
      where: { shopId: shopDomain },
    });
    
    if (!subscription) {
      console.log('❌ No subscription found for this shop');
      return;
    }
    
    console.log('📋 Current Plan Data:');
    console.log(`   Plan: ${subscription.planName}`);
    console.log(`   Status: ${subscription.status}`);
    console.log(`   Max Playlists: ${subscription.maxPlaylists === -1 ? 'Unlimited' : subscription.maxPlaylists}`);
    console.log('');

    // Get current usage
    const playlists = await prisma.playlist.count({
      where: { storeId: shopDomain, isActive: true },
    });
    
    const tracks = await prisma.track.count({
      where: { storeId: shopDomain, isActive: true },
    });
    
    console.log('📊 Current Usage:');
    console.log(`   Playlists: ${playlists}`);
    console.log(`   Tracks: ${tracks}`);
    console.log('');

    // Simulate frontend logic
    const currentPlan = subscription.status === 'ACTIVE' && 
                       (subscription.planName === 'Pro Plan (Full Experience)' || subscription.planName === 'Pro Plan') 
                       ? 'pro' : 'free';
    
    // Helper function to check if create playlist button should be disabled
    const isCreatePlaylistDisabled = () => {
      if (currentPlan === 'pro') {
        return false; // Pro plan: unlimited playlists
      }
      return playlists >= 1; // Free plan: only 1 playlist allowed
    };

    // Helper function to get create playlist button text
    const getCreatePlaylistButtonText = () => {
      if (currentPlan === 'pro') {
        return 'Create Playlist';
      }
      return playlists === 0 ? 'Create Playlist' : 'Upgrade to Pro for More';
    };

    console.log('🎯 Playlist Creation Logic Test:');
    console.log(`   Current Plan: ${currentPlan.toUpperCase()}`);
    console.log(`   Create Button Disabled: ${isCreatePlaylistDisabled()}`);
    console.log(`   Create Button Text: "${getCreatePlaylistButtonText()}"`);
    console.log('');

    // Test different scenarios
    console.log('📋 Scenario Tests:');
    
    // Test Free Plan scenarios
    console.log('🆓 FREE PLAN Scenarios:');
    console.log(`   No playlists (0/1): Button=${!isCreatePlaylistDisabled() ? 'ENABLED' : 'DISABLED'} - Text="${getCreatePlaylistButtonText()}"`);
    
    // Simulate having 1 playlist
    const originalPlaylists = playlists;
    const testPlaylists = 1;
    const testIsDisabled = currentPlan === 'pro' ? false : testPlaylists >= 1;
    const testButtonText = currentPlan === 'pro' ? 'Create Playlist' : (testPlaylists === 0 ? 'Create Playlist' : 'Upgrade to Pro for More');
    console.log(`   1 playlist (1/1): Button=${!testIsDisabled ? 'ENABLED' : 'DISABLED'} - Text="${testButtonText}"`);
    
    // Test Pro Plan scenarios
    console.log('✅ PRO PLAN Scenarios:');
    console.log(`   Any number of playlists: Button=${currentPlan === 'pro' ? 'ENABLED' : 'DISABLED'} - Text="${currentPlan === 'pro' ? 'Create Playlist' : getCreatePlaylistButtonText()}"`);
    console.log('');

    // Test plan limit info
    console.log('📋 Plan Limit Info Test:');
    if (currentPlan === 'pro') {
      console.log('   ✅ PRO PLAN: No limit banner shown');
    } else {
      console.log('   🆓 FREE PLAN: Limit banner shown');
      console.log(`   - Maximum 1 playlist (${playlists}/1 used)`);
      console.log(`   - Maximum 2 tracks per playlist`);
      console.log(`   - Full-length tracks (no time limit)`);
      
      if (playlists >= 1) {
        console.log('   ⚠️  Playlist limit reached message shown');
      }
      if (tracks >= 2) {
        console.log('   ⚠️  Track limit reached message shown');
      }
    }
    console.log('');

    // Recommendations
    console.log('🎯 Expected Behavior:');
    if (currentPlan === 'pro') {
      console.log('   ✅ PRO PLAN:');
      console.log('   - Create Playlist button: ALWAYS ENABLED');
      console.log('   - Button text: "Create Playlist"');
      console.log('   - No limit banner shown');
      console.log('   - Unlimited playlists allowed');
    } else {
      console.log('   🆓 FREE PLAN:');
      console.log('   - Create Playlist button: ENABLED only when 0 playlists');
      console.log('   - Button text: "Create Playlist" (if 0 playlists) or "Upgrade to Pro for More" (if 1+ playlists)');
      console.log('   - Limit banner shown with usage info');
      console.log('   - Maximum 1 playlist allowed');
    }
    console.log('');

    console.log('🎉 Playlist creation logic test completed!');
    console.log(`   Current state: ${currentPlan.toUpperCase()} plan with ${playlists} playlists`);
    console.log(`   Create button: ${!isCreatePlaylistDisabled() ? 'ENABLED' : 'DISABLED'}`);
    
  } catch (error) {
    console.error('❌ Error testing playlist creation logic:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get shop domain from command line argument
const shopDomain = process.argv[2];

if (!shopDomain) {
  console.error('❌ Please provide a shop domain as an argument');
  console.log('Usage: node scripts/test-playlist-creation-logic.js <shop-domain>');
  console.log('Example: node scripts/test-playlist-creation-logic.js test-guleria-store.myshopify.com');
  process.exit(1);
}

// Run the test
testPlaylistCreationLogic(shopDomain);
