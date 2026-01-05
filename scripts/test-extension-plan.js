const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testExtensionPlan(shopDomain) {
  try {
    console.log(`🧪 Testing Extension Plan Detection for shop: ${shopDomain}`);
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
    console.log(`   Homepage Only: ${subscription.homepageOnly ? 'Yes' : 'No'}`);
    console.log(`   Persistent Playback: ${subscription.persistentPlayback ? 'Yes' : 'No'}`);
    console.log(`   Full Customization: ${subscription.fullCustomization ? 'Yes' : 'No'}`);
    console.log('');

    // Simulate extension logic
    const isProPlan = subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan';
    const shouldShowOnAllPages = !subscription.homepageOnly;
    
    console.log('🎯 Extension Logic Test:');
    console.log(`   isProPlan(): ${isProPlan}`);
    console.log(`   shouldShowOnAllPages: ${shouldShowOnAllPages}`);
    console.log(`   Expected Behavior: ${shouldShowOnAllPages ? 'Show on all pages' : 'Show on homepage only'}`);
    console.log('');

    // Test different page scenarios
    console.log('📄 Page Display Test:');
    const testPages = [
      { path: '/', name: 'Homepage', isHomepage: true },
      { path: '/products', name: 'Products Page', isHomepage: false },
      { path: '/collections', name: 'Collections Page', isHomepage: false },
      { path: '/pages/about', name: 'About Page', isHomepage: false },
    ];
    
    testPages.forEach(page => {
      const shouldShow = shouldShowOnAllPages || page.isHomepage;
      console.log(`   ${page.name} (${page.path}): ${shouldShow ? '✅ SHOW' : '❌ HIDE'}`);
    });
    console.log('');

    // Test plan-specific features
    console.log('🎵 Plan-Specific Features:');
    if (isProPlan) {
      console.log('   ✅ PRO PLAN Features:');
      console.log('   - Player shows across full website');
      console.log('   - Continuous seamless playback');
      console.log('   - Autoplay enabled');
      console.log('   - Unlimited playlists and tracks');
      console.log('   - Mini-bar or floating disc options');
      console.log('   - Light or dark theme options');
      console.log('   - Branding can be turned off');
    } else {
      console.log('   🆓 FREE PLAN Features:');
      console.log('   - Player only shows on homepage');
      console.log('   - No continuous playback across pages');
      console.log('   - Limited to 1 playlist');
      console.log('   - Up to 2 tracks per playlist');
      console.log('   - Layout locked to mini-bar');
      console.log('   - Theme locked to light mode');
      console.log('   - Always show "POWERED BY WEBEXP" badge');
    }
    console.log('');

    console.log('🎉 Extension plan detection test completed!');
    console.log(`   Current plan: ${subscription.planName} (${subscription.status})`);
    console.log(`   Display mode: ${shouldShowOnAllPages ? 'Full website' : 'Homepage only'}`);
    
  } catch (error) {
    console.error('❌ Error testing extension plan:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get shop domain from command line argument
const shopDomain = process.argv[2];

if (!shopDomain) {
  console.error('❌ Please provide a shop domain as an argument');
  console.log('Usage: node scripts/test-extension-plan.js <shop-domain>');
  console.log('Example: node scripts/test-extension-plan.js test-guleria-store.myshopify.com');
  process.exit(1);
}

// Run the test
testExtensionPlan(shopDomain);
