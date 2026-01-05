const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkApiResponse(shopDomain) {
  try {
    console.log(`🔍 Checking API response for shop: ${shopDomain}`);
    console.log('=' .repeat(50));
    
    // Get subscription data
    const subscription = await prisma.subscription.findUnique({
      where: { shopId: shopDomain },
    });

    if (!subscription) {
      console.log('❌ No subscription found');
      return;
    }

    // Simulate what the API would return
    const apiResponse = {
      success: true,
      data: {
        // Subscription information
        subscriptionStatus: subscription.status,
        subscriptionName: subscription.planName,
        // Plan limits
        planLimits: {
          maxPlaylists: subscription.maxPlaylists,
          maxTracksPerPlaylist: subscription.maxTracksPerPlaylist,
          maxTotalTracks: subscription.maxTotalTracks,
          persistentPlayback: subscription.persistentPlayback,
          fullCustomization: subscription.fullCustomization,
          homepageOnly: subscription.homepageOnly,
          autoplay: subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan',
        },
      }
    };

    console.log('📋 API Response Structure:');
    console.log(JSON.stringify(apiResponse, null, 2));
    console.log('');

    // Test frontend logic with API response
    const settings = apiResponse.data;
    const frontendIsFreePlan = !settings.subscriptionStatus || 
                               settings.subscriptionStatus !== 'ACTIVE' ||
                               settings.subscriptionName !== 'Pro Plan';
    
    console.log('🧪 Frontend Logic Test:');
    console.log(`   subscriptionStatus: ${settings.subscriptionStatus}`);
    console.log(`   subscriptionName: ${settings.subscriptionName}`);
    console.log(`   isFreePlan(): ${frontendIsFreePlan}`);
    console.log(`   Expected: ${subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan' ? 'Pro Plan' : 'Free Plan'}`);
    console.log(`   Logic Match: ${(subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan' && !frontendIsFreePlan) || (!(subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan') && frontendIsFreePlan) ? '✅ PASS' : '❌ FAIL'}`);
    
  } catch (error) {
    console.error('❌ Error checking API response:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get shop domain from command line argument
const shopDomain = process.argv[2];

if (!shopDomain) {
  console.error('❌ Please provide a shop domain as an argument');
  console.log('Usage: node scripts/check-api-response.js <shop-domain>');
  console.log('Example: node scripts/check-api-response.js test-guleria-store.myshopify.com');
  process.exit(1);
}

// Run the check
checkApiResponse(shopDomain);
