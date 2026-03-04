import { Contact, Prisma, Status } from "@prisma/client";
import { prisma } from "../../config/db";
import { TaskService } from "../task/task.service";

const createContact = async (
  payload: any, // Accept any to handle frontend payload with countryId and string status
): Promise<Contact> => {
  // Map client field names to database field names
  const mappedPayload: any = { ...payload };

  // country / countryId may be supplied by the front‑end.  Prisma requires a
  // nested connect object when establishing a relation on create, so convert
  // either form into the correct structure.
  if (payload.country !== undefined) {
    mappedPayload.country = { connect: { id: payload.country } };
    delete mappedPayload.countryId;
  }

  // status comes over as a plain string; for string enums, the string value is valid
  if (payload.status && typeof payload.status === "string") {
    mappedPayload.status = payload.status;
  }
  console.log(mappedPayload);

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

  // Auto-sync task progress: count today's contacts for this user
  if (result.authorId) {
    await TaskService.syncTaskProgressForUser(result.authorId);
  }

  return result;
};

const getAllContacts = async ({
  page = 1,
  limit = 10,
  search,
  status,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  const skip = (page - 1) * limit;

  const where: any = { AND: [] };

  // full‑text style search across the most common text columns
  if (search) {
    where.AND.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { designation: { contains: search, mode: "insensitive" } },
        { domain: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (status) {
    where.AND.push({ status });
  }

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
    mappedData.country = { connect: { id: data.country } };
    delete mappedData.countryId;
  }
  if ((data as any).countryId !== undefined) {
    mappedData.country = { connect: { id: (data as any).countryId } };
    delete mappedData.countryId;
  }

  if (data.status && typeof data.status === "string") {
    mappedData.status = data.status;
  }

  // client and database field names now align for company and linkedin URLs
  // earlier we were incorrectly mapping `company`→`companyLinkedin`.  Remove
  // that transformation so the caller may supply both properties separately.

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
