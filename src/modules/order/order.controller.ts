import { Request, Response } from "express";
import { OrderService } from "./order.service";

const createBuyer = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.createBuyer(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getBuyers = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.getBuyers();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};
const deleteBuyer = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const result = await OrderService.deleteBuyer(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createFactory = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.createFactory(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getFactories = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.getFactories();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createOrder = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.createOrder(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getOrders = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";
    const buyerId = req.query.buyerId
      ? parseInt(req.query.buyerId as string)
      : undefined;
    const factoryId = req.query.factoryId
      ? parseInt(req.query.factoryId as string)
      : undefined;
    const shipDate = req.query.shipDate
      ? new Date(req.query.shipDate as string)
      : undefined;
    const commissionStatus = req.query.commissionStatus as string;

    const result = await OrderService.getOrders({
      page,
      limit,
      search,
      buyerId,
      factoryId,
      shipDate,
      commissionStatus,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const result = await OrderService.getOrderById(id);
    if (!result) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateOrder = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const result = await OrderService.updateOrder(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const result = await OrderService.deleteOrder(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getOrderStats = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.getOrderStats();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const OrderController = {
  createBuyer,
  getBuyers,
  deleteBuyer,
  createFactory,
  getFactories,
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderStats,
};
