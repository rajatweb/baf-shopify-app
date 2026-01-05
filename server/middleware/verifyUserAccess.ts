import { NextFunction, Request, Response } from "express";

const verifyUserAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userAccessInfo = res.locals.user_session.onlineAccessInfo;
  // Convert comma-separated string to array
  const userScopes = userAccessInfo.associated_user_scope
    .split(",")
    .map((scope: string) => scope.trim());

  // Required permissions
  const requiredPermissions = ["read_orders", "write_orders"];

  try {
    // Check if user has ANY of the required permissions
    const hasRequiredPermission = requiredPermissions.some((required) =>
      userScopes.includes(required)
    );

    // If user doesn't have any required permissions, throw error
    if (!hasRequiredPermission) {
      throw new Error("Permission denied");
    }

    // If authorized, proceed
    next();
  } catch (error) {
    res.status(401).json({
      message: "Dashboard access required order management permissions.",
      required: requiredPermissions.join(", "),
    });
  }
};

export default verifyUserAccess;
