const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updatePlanName(shopDomain) {
  try {
    console.log(`🔄 Updating plan name for shop: ${shopDomain}`);
    console.log('=' .repeat(50));
    
    // Update the plan name to match Shopify structure
    const updatedSubscription = await prisma.subscription.update({
      where: { shopId: shopDomain },
      data: {
        planName: "Pro Plan (Full Experience)",
        updatedAt: new Date(),
      },
    });
    
    console.log('✅ Plan name updated successfully!');
    console.log(`   New Plan Name: ${updatedSubscription.planName}`);
    console.log(`   Status: ${updatedSubscription.status}`);
    console.log(`   Updated At: ${updatedSubscription.updatedAt}`);
    console.log('');
    
    // Verify the update
    const verification = await prisma.subscription.findUnique({
      where: { shopId: shopDomain },
    });
    
    console.log('🔍 Verification:');
    console.log(`   Plan Name: ${verification.planName}`);
    console.log(`   Status: ${verification.status}`);
    console.log(`   Matches Shopify: ${verification.planName === "Pro Plan (Full Experience)" ? '✅ YES' : '❌ NO'}`);
    
  } catch (error) {
    console.error('❌ Error updating plan name:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get shop domain from command line argument
const shopDomain = process.argv[2];

if (!shopDomain) {
  console.error('❌ Please provide a shop domain as an argument');
  console.log('Usage: node scripts/update-plan-name.js <shop-domain>');
  console.log('Example: node scripts/update-plan-name.js test-guleria-store.myshopify.com');
  process.exit(1);
}

// Run the update
updatePlanName(shopDomain);
