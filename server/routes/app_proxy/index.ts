import express from "express";
import prisma from "../../utils/prisma";
import clientProvider from "../../utils/clientProvider";

const router = express.Router();

router.get("/", async (req, res) => {
  const { client } = await clientProvider.offline.graphqlClient({
    shop: res.locals.user_shop,
  });
  res.status(200).send({ content: "Proxy Be Working" });
});

export default router;
