import { Router } from "express";
import { submitContact } from "../controllers/contactControllers.js";
const router = Router();
router.post("/", submitContact);
export default router;
