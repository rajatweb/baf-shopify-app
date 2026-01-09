import "dotenv/config";
import express, { Request, Response } from "express";
import path from "path";
import compression from "compression";

import { createServer as createViteServer } from "vite";
import { createServer } from "http";

// Middleware
import verifyRequest from "./middleware/verifyRequest";
import verifyProxy from "./middleware/verifyProxy";
import csp from "./middleware/csp";
import verifyHmac from "./middleware/verifyHmac";

// Routes
import webhookHandler from "./webhooks/_index";
import proxyRouter from "./routes/app_proxy";
import subscriptionsRoutes from "./routes/subscriptions";
import shopRoutes from "./routes/shop";
import storeRoutes from "./routes/store";

// Controllers
import { shopRedact } from "./controllers/gdpr";
import { customerRedact } from "./controllers/gdpr";
import { customerDataRequest } from "./controllers/gdpr";

// Services
import { WebSocketService } from "./services/webSocketService";
import initLoad from "./middleware/initLoad";

// Initialize the app
const app = express();
const server = createServer(app);

const PORT = parseInt(process.env.PORT || "8000", 10);
const WS_PORT = parseInt(process.env.WS_PORT || "6201", 10);
const isDev = process.env.NODE_ENV === "development";

app.disable("x-powered-by");

// Create and export a singleton instance
WebSocketService.init();

const startServer = async (server: any) => {
  // Incoming webhook requests
  app.post(
    "/api/webhooks/:webhookTopic*",
    express.text({ type: "*/*" }),
    webhookHandler
  );

  // middleware
  app.use(express.json());

  // If you're making changes to any of the routes, please make sure to add them in `./client/vite.config.js` or it'll not work.
  app.use("/api/proxy", verifyProxy, proxyRouter); //MARK:- App Proxy routes
  app.use("/api/subscriptions", verifyRequest, subscriptionsRoutes);
  app.use("/api/shop", verifyRequest, shopRoutes);
  app.use("/api/store", verifyRequest, storeRoutes);

  app.use(csp);
  app.use(initLoad);

  app.post(
    "/api/gdpr/:topic",
    verifyHmac,
    async (req: Request, res: Response) => {
      const { body } = req;
      const { topic } = req.params;
      const shop = req.body.shop_domain;

      let response;
      switch (topic) {
        case "customers_data_request":
          response = await customerDataRequest(topic, shop, body);
          break;
        case "customers_redact":
          response = await customerRedact(topic, shop, body);
          break;
        case "shop_redact":
          response = await shopRedact(topic, shop, body);
          break;
        default:
          console.error(
            "--> Congratulations on breaking the GDPR route! Here's the topic that broke it: ",
            topic
          );
          response = "broken";
          break;
      }

      if (response) {
        res.status(200).send();
      } else {
        res.status(403).send("An error occured");
      }
    }
  );

  if (isDev) {
    const vite = await createViteServer({
      root: path.resolve(process.cwd(), "frontend"),
      server: {
        middlewareMode: true,
        hmr: {
          server,
        },
        allowedHosts: [
          process.env.SHOPIFY_APP_URL?.replace(/https?:\/\//, "") || "",
        ],
      },
      appType: "spa",
      plugins: [
        {
          name: "html-transform",
          transformIndexHtml: {
            order: "pre",
            handler(html: string) {
              return html.replace(
                "%SHOPIFY_API_KEY%",
                process.env.SHOPIFY_API_KEY || ""
              );
            },
          },
        },
      ],
    });
    app.use(vite.middlewares);
  } else {
    const clientDistPath = path.resolve(process.cwd(), "./", "dist");
    app.use(compression());
    // Move CSP and initLoad after static file serving
    // app.use(csp);
    // app.use(initLoad);

    app.use(
      express.static(clientDistPath, {
        maxAge: "1y",
        etag: true,
        lastModified: true,
      })
    );

    app.get("/*", (req, res) => {
      res.sendFile(path.resolve(clientDistPath, "index.html"));
    });
  }
};

server.listen(PORT, () => {
  console.log(`HTTP Server is running on http://localhost:${PORT}`);
  console.log(`WebSocket Server is running on ws://localhost:${WS_PORT}`);
});

startServer(server);
