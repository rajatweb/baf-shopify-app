import { webhooksTopic } from "../server/utils/shopify";

const webhookWriter = (config: any) => {
  let subscriptionsArray = [];
  for (const entry in webhooksTopic) {
    const subscription = {
      topics: webhooksTopic[entry].topics,
      uri: webhooksTopic[entry].url.startsWith("/api/webhooks/")
        ? `${process.env.SHOPIFY_APP_URL}${webhooksTopic[entry].url}`
        : webhooksTopic[entry].url,
    };

    subscriptionsArray.push(subscription);
  }

  config.webhooks.subscriptions = [...subscriptionsArray];
};

export default webhookWriter;
