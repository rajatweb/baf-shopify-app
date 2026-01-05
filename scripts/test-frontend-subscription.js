const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFrontendSubscription(shopDomain) {
  try {
    console.log(`🧪 Testing Frontend Subscription Data for shop: ${shopDomain}`);
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
    console.log('');

    // Simulate frontend plan detection logic
    const isProPlan = subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan';
    const frontendPlan = isProPlan ? 'pro' : 'free';
    
    console.log('🎯 Frontend Plan Detection Logic:');
    console.log(`   subscription.status === 'ACTIVE': ${subscription.status === 'ACTIVE'}`);
    console.log(`   subscription.planName === 'Pro Plan': ${subscription.planName === 'Pro Plan'}`);
    console.log(`   isProPlan(): ${isProPlan}`);
    console.log(`   getCurrentPlan(): ${frontendPlan}`);
    console.log('');

    // Test subscription data structure that frontend expects
    const mockSubscriptionData = {
      data: [{
        id: subscription.subscriptionId,
        name: subscription.planName,
        status: subscription.status,
        lineItems: [{
          plan: {
            pricingDetails: {
              price: { amount: 7, currencyCode: 'USD' },
              interval: 'EVERY_30_DAYS'
            }
          }
        }]
      }]
    };
    
    console.log('📊 Mock Frontend Subscription Data:');
    console.log(JSON.stringify(mockSubscriptionData, null, 2));
    console.log('');

    // Test plan-specific UI elements
    console.log('🎨 UI Element States:');
    console.log(`   Create Playlist Button: ${frontendPlan === 'pro' ? '✅ ENABLED' : '❌ DISABLED (if 1+ playlist exists)'}`);
    console.log(`   Add Track Button: ${frontendPlan === 'pro' ? '✅ ENABLED' : '❌ DISABLED (if 2+ tracks exist)'}`);
    console.log(`   Plan Banner: ${frontendPlan === 'pro' ? '✅ Pro Plan Active' : '🆓 Free Plan Limits'}`);
    console.log('');

    // Check current usage
    const playlists = await prisma.playlist.count({
      where: { storeId: shopDomain, isActive: true },
    });
    
    const tracks = await prisma.track.count({
      where: { storeId: shopDomain, isActive: true },
    });
    
    console.log('📈 Current Usage:');
    console.log(`   Playlists: ${playlists}`);
    console.log(`   Tracks: ${tracks}`);
    console.log(`   Plan Limit: ${frontendPlan === 'pro' ? 'Unlimited' : '1 playlist, 2 tracks'}`);
    console.log('');

    // Test specific button states
    console.log('🔘 Button State Tests:');
    const createPlaylistDisabled = frontendPlan !== 'pro' && playlists >= 1;
    const addTrackDisabled = frontendPlan !== 'pro' && tracks >= 2;
    
    console.log(`   Create Playlist Button Disabled: ${createPlaylistDisabled}`);
    console.log(`   Add Track Button Disabled: ${addTrackDisabled}`);
    console.log('');

    // Recommendations
    console.log('🔄 Troubleshooting Steps:');
    console.log('   1. Check browser console for subscription data');
    console.log('   2. Verify RTK Query cache is not stale');
    console.log('   3. Check network tab for subscription API calls');
    console.log('   4. Clear browser cache and localStorage');
    console.log('   5. Hard refresh the page (Ctrl+F5)');
    console.log('   6. Click the "Refresh" button in PlaylistManager');
    console.log('');

    console.log('🎉 Frontend subscription test completed!');
    console.log(`   Expected plan: ${frontendPlan.toUpperCase()}`);
    console.log(`   Expected button states: Create=${!createPlaylistDisabled ? 'ENABLED' : 'DISABLED'}, Add=${!addTrackDisabled ? 'ENABLED' : 'DISABLED'}`);
    
  } catch (error) {
    console.error('❌ Error testing frontend subscription:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get shop domain from command line argument
const shopDomain = process.argv[2];

if (!shopDomain) {
  console.error('❌ Please provide a shop domain as an argument');
  console.log('Usage: node scripts/test-frontend-subscription.js <shop-domain>');
  console.log('Example: node scripts/test-frontend-subscription.js test-guleria-store.myshopify.com');
  process.exit(1);
}

// Run the test
testFrontendSubscription(shopDomain);
