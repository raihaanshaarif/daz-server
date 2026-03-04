import express from "express";
import { OrderController } from "./order.controller";

const router = express.Router();

// Buyer routes
router.post("/buyers", OrderController.createBuyer);
router.get("/buyers", OrderController.getBuyers);
router.delete("/buyers/:id", OrderController.deleteBuyer);

// Factory routes
router.post("/factories", OrderController.createFactory);
router.get("/factories", OrderController.getFactories);

// Order routes
router.post("/orders", OrderController.createOrder);
router.get("/orders", OrderController.getOrders);
router.get("/orders/:id", OrderController.getOrderById);
router.patch("/orders/:id", OrderController.updateOrder);
router.delete("/orders/:id", OrderController.deleteOrder);
router.get("/orders/stats", OrderController.getOrderStats);

export const orderRouter = router;
