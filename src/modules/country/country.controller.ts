import { Request, Response } from "express";
import { CountryService } from "./country.service";

const createCountry = async (req: Request, res: Response) => {
  try {
    // console.log(req.body);
    const result = await CountryService.createCountry(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllCountrys = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";

    const result = await CountryService.getAllCountrys({
      page,
      limit,
      search,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Countrys", details: err });
  }
};

const getCountryById = async (req: Request, res: Response) => {
  const post = await CountryService.getCountryById(Number(req.params.id));
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
};

const updateCountry = async (req: Request, res: Response) => {
  const post = await CountryService.updateCountry(
    Number(req.params.id),
    req.body,
  );
  res.json(post);
};

const deleteCountry = async (req: Request, res: Response) => {
  await CountryService.deleteCountry(Number(req.params.id));
  res.json({ message: "Post deleted" });
};

export const CountryController = {
  createCountry,
  getAllCountrys,
  getCountryById,
  updateCountry,
  deleteCountry,
};
