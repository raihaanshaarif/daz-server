import { Contact, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

const createContact = async (
  payload: Prisma.ContactCreateInput,
): Promise<Contact> => {
  console.log(payload);

  // Map client field names to database field names
  const mappedPayload: any = { ...payload };

  if (payload.country !== undefined) {
    mappedPayload.countryId = payload.country;
    delete mappedPayload.country;
  }

  if (payload.company !== undefined) {
    mappedPayload.companyLinkedin = payload.company;
    delete mappedPayload.company;
  }

  const result = await prisma.contact.create({
    data: mappedPayload,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      country: true,
    },
  });
  console.log("xx", result);
  return result;
};

const getAllContacts = async ({
  page = 1,
  limit = 10,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const skip = (page - 1) * limit;

  const where: any = {
    AND: [
      search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
    ].filter(Boolean),
  };

  const result = await prisma.contact.findMany({
    skip,
    take: limit,
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      country: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.contact.count({ where });

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

const getContactById = async (id: number) => {
  return await prisma.contact.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      country: true,
    },
  });
};

const updateContact = async (id: number, data: Partial<any>) => {
  // Map client field names to database field names
  const mappedData: any = { ...data };

  if (data.country !== undefined) {
    mappedData.countryId = data.country;
    delete mappedData.country;
  }

  if (data.company !== undefined) {
    mappedData.companyLinkedin = data.company;
    delete mappedData.company;
  }

  return prisma.contact.update({
    where: { id },
    data: mappedData,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      country: true,
    },
  });
};

const deleteContact = async (id: number) => {
  return prisma.contact.delete({ where: { id } });
};

const getContactStat = async () => {
  return await prisma.$transaction(async (tx) => {
    const aggregates = await tx.contact.aggregate({
      _count: true,
    });

    const statusCounts = await tx.contact.groupBy({
      by: ["status"],
      _count: true,
    });

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const lastWeekContactCount = await tx.contact.count({
      where: {
        createdAt: {
          gte: lastWeek,
        },
      },
    });

    return {
      stats: {
        totalContacts: aggregates._count ?? 0,
      },
      statusBreakdown: statusCounts,
      lastWeekContactCount,
    };
  });
};

export const ContactService = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  getContactStat,
};
