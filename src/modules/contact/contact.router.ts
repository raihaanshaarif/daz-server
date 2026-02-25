import express from "express";
import { ContactController } from "./contact.controller";

const router = express.Router();
router.get("/stats", ContactController.getContactStat);

router.post("/", ContactController.createContact);

router.get("/", ContactController.getAllContacts);
router.get("/:id", ContactController.getContactById);
router.patch("/:id", ContactController.updateContact);
router.delete("/:id", ContactController.deleteContact);

export const ContactRouter = router;
