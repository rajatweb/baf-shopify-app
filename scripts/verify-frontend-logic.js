const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyFrontendLogic(shopDomain) {
  try {
    console.log(`🔍 Verifying frontend plan detection logic for shop: ${shopDomain}`);
    console.log('=' .repeat(70));
    
    // Get subscription data
    const subscription = await prisma.subscription.findUnique({
      where: { shopId: shopDomain },
    });

    if (!subscription) {
      console.log('❌ No subscription found');
      return;
    }

    // Simulate frontend isFreePlan() logic
    const frontendIsFreePlan = !subscription.status || 
                               subscription.status !== 'ACTIVE' ||
                               subscription.subscriptionName !== 'Pro Plan';
    
    // Backend plan detection
    const backendIsProPlan = subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan';
    
    console.log('📋 Plan Detection Logic:');
    console.log(`   Backend Pro Plan: ${backendIsProPlan ? 'Yes' : 'No'}`);
    console.log(`   Frontend Free Plan: ${frontendIsFreePlan ? 'Yes' : 'No'}`);
    console.log(`   Logic Match: ${(backendIsProPlan && !frontendIsFreePlan) || (!backendIsProPlan && frontendIsFreePlan) ? '✅ PASS' : '❌ FAIL'}`);
    console.log('');

    // Test shouldShowPlayer logic
    console.log('📍 shouldShowPlayer Logic:');
    const isHomepage = true; // Simulate being on homepage
    const shouldShowOnHomepage = !subscription.homepageOnly || isHomepage;
    console.log(`   Homepage Only: ${subscription.homepageOnly ? 'Yes' : 'No'}`);
    console.log(`   On Homepage: ${isHomepage ? 'Yes' : 'No'}`);
    console.log(`   Should Show: ${shouldShowOnHomepage ? 'Yes' : 'No'}`);
    console.log('');

    // Test plan limits
    console.log('🔒 Plan Limits for Frontend:');
    console.log(`   Max Playlists: ${subscription.maxPlaylists === -1 ? 'Unlimited' : subscription.maxPlaylists}`);
    console.log(`   Max Tracks Per Playlist: ${subscription.maxTracksPerPlaylist === -1 ? 'Unlimited' : subscription.maxTracksPerPlaylist}`);
    console.log(`   Persistent Playback: ${subscription.persistentPlayback ? 'Yes' : 'No'}`);
    console.log(`   Full Customization: ${subscription.fullCustomization ? 'Yes' : 'No'}`);
    console.log(`   Homepage Only: ${subscription.homepageOnly ? 'Yes' : 'No'}`);
    console.log('');

    // Expected frontend behavior
    console.log('🎯 Expected Frontend Behavior:');
    if (frontendIsFreePlan) {
      console.log('   🆓 FREE PLAN Behavior:');
      console.log('   - Force mini-bar layout (no floating disc)');
      console.log('   - Force light theme (no dark theme)');
      console.log('   - Always show branding badge');
      console.log('   - No autoplay');
      console.log('   - No persistent playback');
      console.log('   - Only show on homepage');
    } else {
      console.log('   ✅ PRO PLAN Behavior:');
      console.log('   - Allow both mini-bar and floating disc');
      console.log('   - Allow both light and dark themes');
      console.log('   - Branding can be turned off');
      console.log('   - Autoplay enabled');
      console.log('   - Persistent playback enabled');
      console.log('   - Show on all pages');
    }
    console.log('');

    console.log('✅ Frontend plan detection logic verification complete!');
    
  } catch (error) {
    console.error('❌ Error verifying frontend logic:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get shop domain from command line argument
const shopDomain = process.argv[2];

if (!shopDomain) {
  console.error('❌ Please provide a shop domain as an argument');
  console.log('Usage: node scripts/verify-frontend-logic.js <shop-domain>');
  console.log('Example: node scripts/verify-frontend-logic.js test-guleria-store.myshopify.com');
  process.exit(1);
}

// Run the verification
verifyFrontendLogic(shopDomain);
