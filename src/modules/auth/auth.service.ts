import { prisma } from "../../config/db";
import { Prisma, User } from "@prisma/client";
import bcrypt from "bcrypt";

const loginWithEmailAndPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  console.log(email, password);
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found!");
  }

  // Compare the provided password with the hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password || "");
  if (isPasswordValid) {
    return user;
  } else {
    throw new Error("Password is incorrect!");
  }
};

const authWithGoogle = async (data: Prisma.UserCreateInput) => {
  let user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data,
    });
  }

  return user;
};

export const AuthService = {
  loginWithEmailAndPassword,
  authWithGoogle,
};
