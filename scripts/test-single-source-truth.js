const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSingleSourceTruth(shopDomain) {
  try {
    console.log(`🧪 Testing Single Source of Truth for shop: ${shopDomain}`);
    console.log('=' .repeat(60));
    
    // Get current subscription data from database
    const subscription = await prisma.subscription.findUnique({
      where: { shopId: shopDomain },
    });
    
    if (!subscription) {
      console.log('❌ No subscription found for this shop');
      return;
    }
    
    console.log('📋 Database Subscription Data:');
    console.log(`   Plan: ${subscription.planName}`);
    console.log(`   Status: ${subscription.status}`);
    console.log(`   Subscription ID: ${subscription.subscriptionId}`);
    console.log(`   Max Playlists: ${subscription.maxPlaylists === -1 ? 'Unlimited' : subscription.maxPlaylists}`);
    console.log(`   Persistent Playback: ${subscription.persistentPlayback ? 'Yes' : 'No'}`);
    console.log(`   Full Customization: ${subscription.fullCustomization ? 'Yes' : 'No'}`);
    console.log(`   Homepage Only: ${subscription.homepageOnly ? 'Yes' : 'No'}`);
    console.log('');

    // Simulate the single source of truth logic
    const isProPlan = subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan';
    
    console.log('🎯 Single Source of Truth Logic:');
    console.log(`   subscription.status === 'ACTIVE': ${subscription.status === 'ACTIVE'}`);
    console.log(`   subscription.planName === 'Pro Plan': ${subscription.planName === 'Pro Plan'}`);
    console.log(`   isProPlan: ${isProPlan}`);
    console.log('');

    // Simulate what the API should return
    const mockApiResponse = {
      success: true,
      data: {
        subscriptionStatus: subscription.status,
        subscriptionName: subscription.planName,
        planLimits: {
          maxPlaylists: subscription.maxPlaylists,
          maxTracksPerPlaylist: subscription.maxTracksPerPlaylist,
          maxTotalTracks: subscription.maxTotalTracks,
          persistentPlayback: subscription.persistentPlayback,
          fullCustomization: subscription.fullCustomization,
          homepageOnly: subscription.homepageOnly,
          autoplay: subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan'
        }
      }
    };
    
    console.log('📊 Mock API Response:');
    console.log(JSON.stringify(mockApiResponse, null, 2));
    console.log('');

    // Test frontend logic with single source of truth
    const frontendIsProPlan = mockApiResponse.data.subscriptionStatus === 'ACTIVE' && 
                             mockApiResponse.data.subscriptionName === 'Pro Plan';
    
    console.log('🎨 Frontend Logic Test:');
    console.log(`   API subscriptionStatus: ${mockApiResponse.data.subscriptionStatus}`);
    console.log(`   API subscriptionName: ${mockApiResponse.data.subscriptionName}`);
    console.log(`   Frontend isProPlan: ${frontendIsProPlan}`);
    console.log(`   Expected Create Playlist Button: ${frontendIsProPlan ? 'ENABLED' : 'DISABLED (if 1+ playlist)'}`);
    console.log(`   Expected Button Text: ${frontendIsProPlan ? 'Create Playlist' : 'Upgrade to Pro for More (if 1+ playlist)'}`);
    console.log('');

    // Test different scenarios
    console.log('📋 Scenario Tests:');
    
    if (isProPlan) {
      console.log('✅ PRO PLAN Scenarios:');
      console.log('   - Create Playlist button: ALWAYS ENABLED');
      console.log('   - Button text: "Create Playlist"');
      console.log('   - No limit banner shown');
      console.log('   - Unlimited playlists allowed');
    } else {
      console.log('🆓 FREE PLAN Scenarios:');
      console.log('   - Create Playlist button: ENABLED only when 0 playlists');
      console.log('   - Button text: "Create Playlist" (if 0 playlists) or "Upgrade to Pro for More" (if 1+ playlists)');
      console.log('   - Limit banner shown with usage info');
      console.log('   - Maximum 1 playlist allowed');
    }
    console.log('');

    // Check for potential issues
    console.log('🔍 Potential Issues Check:');
    
    if (subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan') {
      console.log('   ✅ Database shows Pro Plan correctly');
    } else {
      console.log('   ❌ Database does not show Pro Plan correctly');
    }
    
    if (frontendIsProPlan) {
      console.log('   ✅ Frontend logic would detect Pro Plan correctly');
    } else {
      console.log('   ❌ Frontend logic would NOT detect Pro Plan correctly');
    }
    
    if (subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan' && !frontendIsProPlan) {
      console.log('   ⚠️  MISMATCH: Database shows Pro Plan but frontend would detect Free Plan');
    } else if (subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan' && frontendIsProPlan) {
      console.log('   ✅ MATCH: Database and frontend both show Pro Plan');
    }
    console.log('');

    console.log('🎉 Single source of truth test completed!');
    console.log(`   Database Plan: ${subscription.planName} (${subscription.status})`);
    console.log(`   Frontend Detection: ${frontendIsProPlan ? 'Pro Plan' : 'Free Plan'}`);
    console.log(`   Match: ${(subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan') === frontendIsProPlan ? '✅ YES' : '❌ NO'}`);
    
  } catch (error) {
    console.error('❌ Error testing single source of truth:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get shop domain from command line argument
const shopDomain = process.argv[2];

if (!shopDomain) {
  console.error('❌ Please provide a shop domain as an argument');
  console.log('Usage: node scripts/test-single-source-truth.js <shop-domain>');
  console.log('Example: node scripts/test-single-source-truth.js test-guleria-store.myshopify.com');
  process.exit(1);
}

// Run the test
testSingleSourceTruth(shopDomain);
