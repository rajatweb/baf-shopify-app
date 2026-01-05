const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupSubscriptions() {
  try {
    console.log('Setting up subscription data for existing stores...');

    // Get all stores that don't have subscription data
    const stores = await prisma.store.findMany({
      where: {
        subscription: null
      },
      select: {
        shop: true
      }
    });

    console.log(`Found ${stores.length} stores without subscription data`);

    // Create default free plan subscriptions for each store
    for (const store of stores) {
      console.log(`Setting up free plan for store: ${store.shop}`);
      
      await prisma.subscription.create({
        data: {
          shopId: store.shop,
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
    }

    console.log('✅ Subscription setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up subscriptions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupSubscriptions();
