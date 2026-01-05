const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function forceRefreshFrontend(shopDomain) {
  try {
    console.log(`🔄 Force Refreshing Frontend Data for shop: ${shopDomain}`);
    console.log('=' .repeat(60));
    
    // Get current subscription data
    const subscription = await prisma.subscription.findUnique({
      where: { shopId: shopDomain },
    });
    
    if (!subscription) {
      console.log('❌ No subscription found for this shop');
      return;
    }
    
    console.log('📋 Current Database State:');
    console.log(`   Plan: ${subscription.planName}`);
    console.log(`   Status: ${subscription.status}`);
    console.log(`   Homepage Only: ${subscription.homepageOnly ? 'Yes' : 'No'}`);
    console.log(`   Persistent Playback: ${subscription.persistentPlayback ? 'Yes' : 'No'}`);
    console.log(`   Full Customization: ${subscription.fullCustomization ? 'Yes' : 'No'}`);
    console.log('');

    // Simulate what the frontend should see
    const frontendPlan = subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan' ? 'pro' : 'free';
    
    console.log('🎯 Frontend Plan Detection:');
    console.log(`   getCurrentPlan(): ${frontendPlan}`);
    console.log(`   isProPlan(): ${frontendPlan === 'pro'}`);
    console.log(`   Create Playlist Button: ${frontendPlan === 'pro' ? '✅ ENABLED' : '❌ DISABLED'}`);
    console.log(`   Add Track Button: ${frontendPlan === 'pro' ? '✅ ENABLED' : '❌ DISABLED'}`);
    console.log('');

    // Test plan-specific UI elements
    console.log('🎨 Plan-Specific UI Elements:');
    if (frontendPlan === 'pro') {
      console.log('   ✅ PRO PLAN UI:');
      console.log('   - Create Playlist button: ENABLED');
      console.log('   - Add Track button: ENABLED');
      console.log('   - Unlimited playlists allowed');
      console.log('   - Unlimited tracks allowed');
      console.log('   - Full customization options');
      console.log('   - Branding can be hidden');
    } else {
      console.log('   🆓 FREE PLAN UI:');
      console.log('   - Create Playlist button: DISABLED (if 1+ playlist exists)');
      console.log('   - Add Track button: DISABLED (if 2+ tracks exist)');
      console.log('   - Limited to 1 playlist');
      console.log('   - Limited to 2 tracks');
      console.log('   - Basic customization only');
      console.log('   - Branding always visible');
    }
    console.log('');

    // Check current usage
    const playlists = await prisma.playlist.count({
      where: { storeId: shopDomain, isActive: true },
    });
    
    const tracks = await prisma.track.count({
      where: { storeId: shopDomain, isActive: true },
    });
    
    console.log('📊 Current Usage:');
    console.log(`   Playlists: ${playlists}`);
    console.log(`   Tracks: ${tracks}`);
    console.log(`   Plan Limit: ${frontendPlan === 'pro' ? 'Unlimited' : '1 playlist, 2 tracks'}`);
    console.log('');

    // Recommendations for frontend refresh
    console.log('🔄 Frontend Refresh Recommendations:');
    console.log('   1. Clear browser cache and localStorage');
    console.log('   2. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)');
    console.log('   3. Check browser developer tools for cached API responses');
    console.log('   4. Verify RTK Query cache is invalidated');
    console.log('   5. Check if subscription data is being refetched');
    console.log('');

    // Extension refresh recommendations
    console.log('🎵 Extension Refresh Recommendations:');
    console.log('   1. Clear browser cache for the storefront');
    console.log('   2. Hard refresh the storefront pages');
    console.log('   3. Check if app proxy cache is cleared');
    console.log('   4. Verify extension settings are reloaded');
    console.log('   5. Test on different pages (homepage vs product pages)');
    console.log('');

    console.log('🎉 Force refresh analysis completed!');
    console.log(`   Expected frontend plan: ${frontendPlan.toUpperCase()}`);
    console.log(`   Expected extension behavior: ${subscription.homepageOnly ? 'Homepage only' : 'Full website'}`);
    
  } catch (error) {
    console.error('❌ Error force refreshing frontend:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get shop domain from command line argument
const shopDomain = process.argv[2];

if (!shopDomain) {
  console.error('❌ Please provide a shop domain as an argument');
  console.log('Usage: node scripts/force-refresh-frontend.js <shop-domain>');
  console.log('Example: node scripts/force-refresh-frontend.js test-guleria-store.myshopify.com');
  process.exit(1);
}

// Run the refresh
forceRefreshFrontend(shopDomain);
