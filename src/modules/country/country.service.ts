import { Country, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

const createCountry = async (
  payload: Prisma.CountryCreateInput,
): Promise<Country> => {
  console.log(payload);
  const result = await prisma.country.create({
    data: payload,
  });
  console.log("xx", result);
  return result;
};

const getAllCountrys = async ({
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

  const result = await prisma.country.findMany({
    skip,
    take: limit,
    where,
    include: {
      // author: {
      //   select: {
      //     id: true,
      //     name: true,
      //     email: true,
      //   },
      // },
      // country: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.country.count({ where });

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

const getCountryById = async (id: number) => {
  return await prisma.country.findUnique({
    where: { id },
    include: {
      // author: {
      //   select: {
      //     id: true,
      //     name: true,
      //     email: true,
      //   },
      // },
      // country: true,
    },
  });
};

const updateCountry = async (id: number, data: Partial<any>) => {
  return prisma.country.update({
    where: { id },
    data,
    include: {
      // author: {
      //   select: {
      //     id: true,
      //     name: true,
      //     email: true,
      //   },
      // },
      // country: true,
    },
  });
};

const deleteCountry = async (id: number) => {
  return prisma.country.delete({ where: { id } });
};

export const CountryService = {
  createCountry,
  getAllCountrys,
  getCountryById,
  updateCountry,
  deleteCountry,
};
