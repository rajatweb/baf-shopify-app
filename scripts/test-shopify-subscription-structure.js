const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testShopifySubscriptionStructure(shopDomain) {
  try {
    console.log(`🧪 Testing Shopify Subscription Structure for shop: ${shopDomain}`);
    console.log('=' .repeat(70));
    
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

    // Simulate Shopify subscription data structure
    const mockShopifyProPlanData = {
      success: true,
      data: [
        {
          id: "gid://shopify/AppSubscription/35761029351",
          name: "Pro Plan (Full Experience)",
          status: "ACTIVE",
          lineItems: [
            {
              plan: {
                pricingDetails: {
                  "__typename": "AppRecurringPricing",
                  price: {
                    amount: "7.0",
                    currencyCode: "USD"
                  },
                  interval: "EVERY_30_DAYS"
                }
              }
            }
          ],
          test: true
        }
      ]
    };

    const mockShopifyFreePlanData = {
      success: true,
      data: []
    };

    console.log('📊 Shopify Pro Plan Data Structure:');
    console.log(JSON.stringify(mockShopifyProPlanData, null, 2));
    console.log('');

    console.log('📊 Shopify Free Plan Data Structure:');
    console.log(JSON.stringify(mockShopifyFreePlanData, null, 2));
    console.log('');

    // Test plan detection logic with Shopify data structure
    console.log('🎯 Plan Detection Logic Test:');
    
    // Test Pro Plan detection
    const proPlanSubscription = mockShopifyProPlanData.data[0];
    const isProPlanActive = proPlanSubscription?.status === "ACTIVE" && 
                           (proPlanSubscription?.name === "Pro Plan (Full Experience)" || proPlanSubscription?.name === "Pro Plan");
    
    console.log('✅ Pro Plan Detection:');
    console.log(`   Subscription: ${proPlanSubscription?.name}`);
    console.log(`   Status: ${proPlanSubscription?.status}`);
    console.log(`   isProPlan: ${isProPlanActive}`);
    console.log('');

    // Test Free Plan detection
    const freePlanSubscription = mockShopifyFreePlanData.data[0]; // undefined
    const isFreePlanActive = !freePlanSubscription || 
                            (freePlanSubscription?.status !== "ACTIVE" || 
                             (freePlanSubscription?.name !== "Pro Plan (Full Experience)" && freePlanSubscription?.name !== "Pro Plan"));
    
    console.log('🆓 Free Plan Detection:');
    console.log(`   Subscription: ${freePlanSubscription ? freePlanSubscription.name : 'No subscription'}`);
    console.log(`   Status: ${freePlanSubscription ? freePlanSubscription.status : 'No status'}`);
    console.log(`   isFreePlan: ${isFreePlanActive}`);
    console.log('');

    // Test with actual database data
    console.log('🎯 Database vs Shopify Logic Test:');
    const dbIsProPlan = subscription.status === 'ACTIVE' && subscription.planName === 'Pro Plan';
    const shopifyIsProPlan = subscription.status === 'ACTIVE' && 
                             (subscription.planName === 'Pro Plan (Full Experience)' || subscription.planName === 'Pro Plan');
    
    console.log(`   Database Plan: ${subscription.planName}`);
    console.log(`   Database Status: ${subscription.status}`);
    console.log(`   Database Logic (Pro Plan): ${dbIsProPlan}`);
    console.log(`   Shopify Logic (Pro Plan): ${shopifyIsProPlan}`);
    console.log(`   Match: ${dbIsProPlan === shopifyIsProPlan ? '✅ YES' : '❌ NO'}`);
    console.log('');

    // Test different plan name scenarios
    console.log('📋 Plan Name Scenarios:');
    const testScenarios = [
      { name: "Pro Plan (Full Experience)", status: "ACTIVE", expected: true },
      { name: "Pro Plan", status: "ACTIVE", expected: true },
      { name: "Free Plan", status: "ACTIVE", expected: false },
      { name: "Pro Plan (Full Experience)", status: "INACTIVE", expected: false },
      { name: "Pro Plan", status: "CANCELLED", expected: false },
      { name: "Free Plan", status: "INACTIVE", expected: false }
    ];

    testScenarios.forEach((scenario, index) => {
      const isPro = scenario.status === "ACTIVE" && 
                   (scenario.name === "Pro Plan (Full Experience)" || scenario.name === "Pro Plan");
      console.log(`   ${index + 1}. "${scenario.name}" (${scenario.status}): ${isPro ? '✅ PRO' : '🆓 FREE'} (Expected: ${scenario.expected ? 'PRO' : 'FREE'})`);
    });
    console.log('');

    console.log('🎉 Shopify subscription structure test completed!');
    console.log(`   Current Database Plan: ${subscription.planName} (${subscription.status})`);
    console.log(`   Shopify Logic Result: ${shopifyIsProPlan ? 'Pro Plan' : 'Free Plan'}`);
    console.log(`   Recommendation: ${shopifyIsProPlan ? '✅ Use Shopify logic' : '🆓 Use Free Plan logic'}`);
    
  } catch (error) {
    console.error('❌ Error testing Shopify subscription structure:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get shop domain from command line argument
const shopDomain = process.argv[2];

if (!shopDomain) {
  console.error('❌ Please provide a shop domain as an argument');
  console.log('Usage: node scripts/test-shopify-subscription-structure.js <shop-domain>');
  console.log('Example: node scripts/test-shopify-subscription-structure.js test-guleria-store.myshopify.com');
  process.exit(1);
}

// Run the test
testShopifySubscriptionStructure(shopDomain);
