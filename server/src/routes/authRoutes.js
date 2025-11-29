import { authController } from "../controllers/authController.js";
import {Router} from "express"

const route = Router();

route.post("/register", authController.register);
route.post("/login", authController.login);

export default route;