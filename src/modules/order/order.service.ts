import { prisma } from "../../config/db";
import { Prisma } from "@prisma/client";

const createBuyer = async (data: Prisma.BuyerCreateInput) => {
  return await prisma.buyer.create({ data });
};

const getBuyers = async () => {
  return await prisma.buyer.findMany();
};

const deleteBuyer = async (id: number) => {
  return await prisma.buyer.delete({ where: { id } });
};

const createFactory = async (data: Prisma.FactoryCreateInput) => {
  return await prisma.factory.create({ data });
};

const getFactories = async () => {
  return await prisma.factory.findMany();
};

const createOrder = async (data: Prisma.OrderCreateInput) => {
  const computedData: any = { ...data };

  // Auto-calculate totals
  if (computedData.quantity && computedData.price) {
    computedData.totalPrice = computedData.quantity * computedData.price;
  }

  if (computedData.quantity && computedData.factoryUnitPrice) {
    computedData.totalFactoryPrice =
      computedData.quantity * computedData.factoryUnitPrice;
  }

  if (computedData.totalPrice && computedData.totalFactoryPrice) {
    computedData.dazCommission =
      computedData.totalPrice - computedData.totalFactoryPrice;
  }
  console.log(computedData);

  return await prisma.order.create({ data: computedData });
};

const getOrders = async ({
  page = 1,
  limit = 10,
  search,
  buyerId,
  factoryId,
  shipDate,
  commissionStatus,
}: {
  page?: number;
  limit?: number;
  search?: string;
  buyerId?: number;
  factoryId?: number;
  shipDate?: Date;
  commissionStatus?: string;
}) => {
  const skip = (page - 1) * limit;

  const where: any = {
    AND: [
      search && {
        OR: [
          { orderNumber: { contains: search, mode: "insensitive" } },
          { style: { contains: search, mode: "insensitive" } },
          { color: { contains: search, mode: "insensitive" } },
          { dept: { contains: search, mode: "insensitive" } },
        ],
      },
      buyerId && { buyerId },
      factoryId && { factoryId },
      shipDate && { shipDate },
      commissionStatus && { commissionStatus: commissionStatus as any },
    ].filter(Boolean),
  };

  const result = await prisma.order.findMany({
    skip,
    take: limit,
    where,
    include: { buyer: true, factory: true },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.order.count({ where });

  return {
    data: result,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getOrderById = async (id: number) => {
  return await prisma.order.findUnique({
    where: { id },
    include: { buyer: true, factory: true, createdBy: true },
  });
};

const updateOrder = async (id: number, data: Prisma.OrderUpdateInput) => {
  // Fetch current order
  const currentOrder = await prisma.order.findUnique({ where: { id } });
  if (!currentOrder) throw new Error("Order not found");

  // Merge updates
  const updatedData: any = { ...currentOrder, ...data };

  // Auto-calculate totals
  if (updatedData.quantity && updatedData.price) {
    updatedData.totalPrice = updatedData.quantity * updatedData.price;
  }

  if (updatedData.quantity && updatedData.factoryUnitPrice) {
    updatedData.totalFactoryPrice =
      updatedData.quantity * updatedData.factoryUnitPrice;
  }

  if (updatedData.totalPrice && updatedData.totalFactoryPrice) {
    updatedData.dazCommission =
      updatedData.totalPrice - updatedData.totalFactoryPrice;
  }

  return await prisma.order.update({ where: { id }, data: updatedData });
};

const deleteOrder = async (id: number) => {
  return await prisma.order.delete({ where: { id } });
};

const getOrderStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const aggregates = await tx.order.aggregate({
      _count: true,
    });

    const commissionStatusCounts = await tx.order.groupBy({
      by: ["commissionStatus"],
      _count: true,
    });

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const lastWeekOrderCount = await tx.order.count({
      where: {
        createdAt: {
          gte: lastWeek,
        },
      },
    });

    return {
      stats: {
        totalOrders: aggregates._count ?? 0,
      },
      commissionStatusBreakdown: commissionStatusCounts,
      lastWeekOrderCount,
    };
  });
};

export const OrderService = {
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
