import prisma from "../utils/prisma";

const appOrderHandler = async (
  topic: string,
  shop: string,
  webhookRequestBody: any
) => {
  try {
    // Parse the webhook request body
    const webhookBody = JSON.parse(webhookRequestBody);

    console.log(webhookBody, "webhookBody");

    const isBafOrder =
      webhookBody?.note_attributes?.find(
        (attribute: any) => attribute.name === "__order_from_baf"
      ) || false;
    if (isBafOrder) {
      const products = webhookBody?.line_items?.map((item: any) => ({
        id: String(item?.product_id || ""),
        quantity: Number(item?.quantity || "0"),
        price: Number(item?.price || "0"),
      }));
      if (products.length) {
        for (const product of products) {
          const productAnalytics = await prisma.productAnalytics.findUnique({
            where: {
              shop_productId: {
                shop,
                productId: product.id,
              },
            },
          });
          if (productAnalytics) {
            await prisma.productAnalytics.update({
              where: {
                shop_productId: {
                  shop,
                  productId: product.id,
                },
              },
              data: {
                purchaseCount: {
                  increment: product.quantity,
                },
                revenue: {
                  increment: product.price * product.quantity,
                },
              },
            });
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export default appOrderHandler;
