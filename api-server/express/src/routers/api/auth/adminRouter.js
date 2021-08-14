import express from 'express';
import { loginAdmin } from '../../../controllers/api/authController';

const authRouter = express.Router();

authRouter.post('/login', loginAdmin);

export default authRouter;
