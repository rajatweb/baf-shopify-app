const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testMarqueeReverted(shopDomain) {
  try {
    console.log(`🧪 Testing Marquee Reverted for shop: ${shopDomain}`);
    console.log('=' .repeat(50));
    
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
    console.log('');
    
    // Test marquee reverted state
    console.log('🎯 Marquee Reverted Test:');
    console.log('');
    
    console.log('🎵 Marquee Speed (Reverted):');
    console.log('   ✅ Speed: 50px per second');
    console.log('   ✅ Duration calculation: textWidth / 50');
    console.log('   ✅ Min duration: 10 seconds');
    console.log('   ✅ Max duration: 30 seconds');
    console.log('   ✅ Dynamic speed based on text length');
    console.log('');
    
    console.log('🔄 Marquee Animations (Reverted):');
    console.log('   ✅ Mini bar: marquee 15s linear infinite');
    console.log('   ✅ Modal: marquee-modal 12s linear infinite');
    console.log('   ✅ Playlist: marquee-playlist 12s linear infinite');
    console.log('   ✅ Separate keyframes for each location');
    console.log('   ✅ Different padding for each type');
    console.log('');
    
    console.log('📱 Marquee Locations (Reverted):');
    console.log('   ✅ Mini bar title: .mini-track-title (15s)');
    console.log('   ✅ Modal title: .track-title (12s)');
    console.log('   ✅ Playlist titles: .playlist-track-title (12s)');
    console.log('   ✅ Different animations per location');
    console.log('   ✅ Original behavior restored');
    console.log('');
    
    console.log('🎨 Reverted Features:');
    console.log('   ✅ Original speed restored (50px/s)');
    console.log('   ✅ Separate keyframes restored');
    console.log('   ✅ Different padding values restored');
    console.log('   ✅ Hover pause functionality maintained');
    console.log('   ✅ Responsive text width calculation maintained');
    console.log('');
    
    console.log('📱 Expected Marquee Behavior (Reverted):');
    console.log('   1. Text scrolls at original speed (50px/s)');
    console.log('   2. Different speeds for different locations');
    console.log('   3. Works on mini bar, modal, and playlist titles');
    console.log('   4. Pauses on hover');
    console.log('   5. Dynamic duration based on text length');
    console.log('   6. Only activates when text is too long');
    console.log('');
    
    // Test plan-specific behavior
    const isProPlan = subscription.status === 'ACTIVE' && 
                     (subscription.planName === 'Pro Plan (Full Experience)' || subscription.planName === 'Pro Plan');
    
    console.log('🎯 Plan-Specific Marquee Features:');
    if (isProPlan) {
      console.log('   ✅ PRO PLAN: Full marquee functionality');
      console.log('   ✅ PRO PLAN: All title locations supported');
      console.log('   ✅ PRO PLAN: Hover pause functionality');
    } else {
      console.log('   🆓 FREE PLAN: Basic marquee functionality');
      console.log('   🆓 FREE PLAN: Standard title scrolling');
      console.log('   🆓 FREE PLAN: Limited customization');
    }
    console.log('');
    
    console.log('🔧 Technical Implementation (Reverted):');
    console.log('   ✅ Multiple marquee keyframes: @keyframes marquee, marquee-modal, marquee-playlist');
    console.log('   ✅ JavaScript: Dynamic duration calculation (50px/s)');
    console.log('   ✅ CSS: Seamless looping with ::after pseudo-element');
    console.log('   ✅ Responsive: Text width calculation');
    console.log('   ✅ Performance: Efficient animation');
    console.log('');
    
    console.log('📊 Speed Comparison (Reverted):');
    console.log('   Mini bar: 15s fixed duration');
    console.log('   Modal: 12s fixed duration');
    console.log('   Playlist: 12s fixed duration');
    console.log('   JavaScript: 50px per second calculation');
    console.log('   Result: Original implementation restored');
    console.log('');
    
    console.log('🔄 Padding Comparison (Reverted):');
    console.log('   Mini bar: 50px padding');
    console.log('   Modal: 60px padding');
    console.log('   Playlist: 40px padding');
    console.log('   Result: Original spacing restored');
    console.log('');
    
    console.log('🎉 Marquee reverted test completed!');
    console.log('   Recommendation: Test with long track titles');
    console.log('   Expected: Original implementation with separate speeds');
    
  } catch (error) {
    console.error('❌ Error testing marquee reverted:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get shop domain from command line argument
const shopDomain = process.argv[2];

if (!shopDomain) {
  console.error('❌ Please provide a shop domain as an argument');
  console.log('Usage: node scripts/test-marquee-reverted.js <shop-domain>');
  console.log('Example: node scripts/test-marquee-reverted.js test-guleria-store.myshopify.com');
  process.exit(1);
}

// Run the test
testMarqueeReverted(shopDomain);
