export enum MessageTypes {
  PING = "ping",
  PONG = "pong",
  MESSAGE = "message",
  RESPONSE = "response",
  ORDER_CREATED = "orders/create",
  ORDER_UPDATED = "orders/updated",
  ORDER_EDITED = "orders/edited",
  ORDER_CANCELLED = "orders/cancelled",
  ORDER_FULFILLED = "orders/fulfilled",
  ORDER_DELETED = "orders/delete",
}

export type ActivityType =
  | "new-order"
  | "pending"
  | "in-progress"
  | "cancelled"
  | "delivered";

export interface WebSocketPayload {
  type: ActivityType;
  orderId: string;
  message: string;
  timestamp: string;
  data?: {
    name?: string;
    status?: string;
  };
}

export interface WebSocketMessage {
  type: MessageTypes;
  payload: WebSocketPayload;
}

// Predefined message templates
export const MessageTemplates = {
  [MessageTypes.ORDER_CREATED]: (orderId: string) => ({
    type: MessageTypes.ORDER_CREATED,
    payload: {
      type: "new-order" as ActivityType,
      orderId,
      message: "New order received",
      timestamp: new Date().toISOString(),
    },
  }),

  [MessageTypes.ORDER_UPDATED]: (orderId: string, status: string) => ({
    type: MessageTypes.ORDER_UPDATED,
    payload: {
      type: (status || "in-progress") as ActivityType,
      orderId,
      message: `Order ${status || "updated"}`,
      timestamp: new Date().toISOString(),
    },
  }),

  [MessageTypes.ORDER_FULFILLED]: (orderId: string) => ({
    type: MessageTypes.ORDER_FULFILLED,
    payload: {
      type: "delivered" as ActivityType,
      orderId,
      message: "Order delivered",
      timestamp: new Date().toISOString(),
    },
  }),

  [MessageTypes.ORDER_CANCELLED]: (orderId: string) => ({
    type: MessageTypes.ORDER_CANCELLED,
    payload: {
      type: "cancelled" as ActivityType,
      orderId,
      message: "Order cancelled",
      timestamp: new Date().toISOString(),
    },
  }),
} as const;
