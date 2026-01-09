import { Server as WebSocketServer, WebSocket } from "ws";
import { MessageTypes, MessageTemplates } from "../../shared/types/socket";

class WebSocketService {
  private static instance: WebSocketService;
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket>;

  private constructor() {
    this.wss = new WebSocketServer({
      path: "/ws",
      port: parseInt(process.env.WS_PORT || "6201"),
    });
    this.clients = new Map();

    this.wss.on("connection", (ws: WebSocket, request: any) => {
      try {
        // Extract shop from query parameters with better error handling
        const url = new URL(
          request.url,
          process.env.WS_URL || `http://localhost:${process.env.WS_PORT}`
        );
        const shop = url.searchParams.get("shop");

        if (!shop) {
          console.error("No shop parameter provided in connection");
          return;
        }

        // Store the connection
        this.clients.set(shop, ws);

        ws.on("message", (message: string) => {
          console.log(`Received message from ${shop}:`, message.toString());
        });

        ws.on("close", () => {
          this.clients.delete(shop);
          console.log(`Client disconnected for shop: ${shop}`);
          console.log("Remaining clients:", Array.from(this.clients.keys()));
        });

        ws.on("error", (error) => {
          console.error(`WebSocket error for ${shop}:`, error);
        });
      } catch (error) {
        console.error("Error in WebSocket connection:", error);
      }
    });
  }

  static init() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
  }

  static getInstance() {
    if (!WebSocketService.instance) {
      throw new Error("WebSocketService has not been initialized.");
    }
    return WebSocketService.instance;
  }

  public broadcast(message: any, targetShop?: string) {
    try {
      const messageString = JSON.stringify(message);

      if (targetShop) {
        const client = this.clients.get(targetShop);
        if (client?.readyState === WebSocket.OPEN) {
          client.send(messageString);
        }
      }
    } catch (error) {
      console.error("Error in broadcast:", error);
    }
  }
}

// Modified message handler
export const handleWebSocketMessage = (
  ws: WebSocket,
  message: string,
  shop?: string
) => {
  try {
    const data = JSON.parse(message.toString());

    switch (data.type) {
      case MessageTypes.PING:
        ws.send(JSON.stringify({ type: MessageTypes.PONG }));
        break;

      case MessageTypes.ORDER_CREATED:
        WebSocketService.getInstance().broadcast(
          MessageTemplates[MessageTypes.ORDER_CREATED](data.payload.name),
          shop
        );
        break;

      case MessageTypes.ORDER_UPDATED:
      case MessageTypes.ORDER_EDITED:
        WebSocketService.getInstance().broadcast(
          MessageTemplates[MessageTypes.ORDER_UPDATED](
            data.payload.name,
            data.payload.status
          ),
          shop
        );
        break;

      case MessageTypes.ORDER_CANCELLED:
        WebSocketService.getInstance().broadcast(
          MessageTemplates[MessageTypes.ORDER_CANCELLED](data.payload.name),
          shop
        );
        break;

      case MessageTypes.ORDER_FULFILLED:
        WebSocketService.getInstance().broadcast(
          MessageTemplates[MessageTypes.ORDER_FULFILLED](data.payload.name),
          shop
        );
        break;

      default:
        console.warn("Unknown message type:", data.type);
    }
  } catch (error) {
    console.error("WebSocket message error:", error);
  }
};

export { WebSocketService };
