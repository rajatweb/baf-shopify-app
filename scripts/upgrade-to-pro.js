const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function upgradeToPro(shopDomain) {
  try {
    console.log(`Upgrading store ${shopDomain} to Pro Plan...`);

    // Update subscription to Pro Plan
    await prisma.subscription.upsert({
      where: { shopId: shopDomain },
      update: {
        planName: 'Pro Plan',
        status: 'ACTIVE',
        maxPlaylists: -1, // unlimited
        maxTracksPerPlaylist: -1, // unlimited
        maxTotalTracks: -1, // unlimited
        persistentPlayback: true, // continuous playback
        fullCustomization: true, // all customization options
        homepageOnly: false, // shows across full website
      },
      create: {
        shopId: shopDomain,
        planName: 'Pro Plan',
        status: 'ACTIVE',
        maxPlaylists: -1,
        maxTracksPerPlaylist: -1,
        maxTotalTracks: -1,
        showBranding: false,
        persistentPlayback: true,
        fullCustomization: true,
        homepageOnly: false,
      }
    });

    console.log('✅ Store upgraded to Pro Plan successfully!');
  } catch (error) {
    console.error('❌ Error upgrading store:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get shop domain from command line argument
const shopDomain = process.argv[2];

if (!shopDomain) {
  console.error('❌ Please provide a shop domain as an argument');
  console.log('Usage: node scripts/upgrade-to-pro.js <shop-domain>');
  console.log('Example: node scripts/upgrade-to-pro.js test-guleria-store.myshopify.com');
  process.exit(1);
}

// Run the upgrade
upgradeToPro(shopDomain);
