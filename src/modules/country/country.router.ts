import express from "express";
import { CountryController } from "./country.controller";

const router = express.Router();

router.post("/", CountryController.createCountry);

router.get("/", CountryController.getAllCountrys);
router.get("/:id", CountryController.getCountryById);
router.patch("/:id", CountryController.updateCountry);
router.delete("/:id", CountryController.deleteCountry);

export const CountryRouter = router;
