const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function downgradeToFree(shopDomain) {
  try {
    console.log(`Downgrading store ${shopDomain} to Free Plan...`);

    // Update subscription to Free Plan
    await prisma.subscription.upsert({
      where: { shopId: shopDomain },
      update: {
        planName: 'Free Plan',
        status: 'INACTIVE',
        maxPlaylists: 1,
        maxTracksPerPlaylist: 2,
        maxTotalTracks: 2,
        persistentPlayback: false,
        fullCustomization: false,
        homepageOnly: true,
      },
      create: {
        shopId: shopDomain,
        planName: 'Free Plan',
        status: 'INACTIVE',
        maxPlaylists: 1,
        maxTracksPerPlaylist: 2,
        maxTotalTracks: 2,
        persistentPlayback: false,
        fullCustomization: false,
        homepageOnly: true,
      }
    });

    console.log('✅ Store downgraded to Free Plan successfully!');
  } catch (error) {
    console.error('❌ Error downgrading store:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get shop domain from command line argument
const shopDomain = process.argv[2];

if (!shopDomain) {
  console.error('❌ Please provide a shop domain as an argument');
  console.log('Usage: node scripts/downgrade-to-free.js <shop-domain>');
  console.log('Example: node scripts/downgrade-to-free.js test-guleria-store.myshopify.com');
  process.exit(1);
}

// Run the downgrade
downgradeToFree(shopDomain);
