import { Request, Response } from "express";
import { ContactService } from "./contact.service";

const createContact = async (req: Request, res: Response) => {
  try {
    const result = await ContactService.createContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllContacts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || undefined;

    const result = await ContactService.getAllContacts({
      page,
      limit,
      search,
      status,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts", details: err });
  }
};

const getContactById = async (req: Request, res: Response) => {
  const post = await ContactService.getContactById(Number(req.params.id));
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
};

const updateContact = async (req: Request, res: Response) => {
  console.log(req.body);
  const post = await ContactService.updateContact(
    Number(req.params.id),
    req.body,
  );
  res.json(post);
};

const deleteContact = async (req: Request, res: Response) => {
  await ContactService.deleteContact(Number(req.params.id));
  res.json({ message: "Post deleted" });
};

const getContactStat = async (req: Request, res: Response) => {
  try {
    const result = await ContactService.getContactStat();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats", details: err });
  }
};

export const ContactController = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  getContactStat,
};
