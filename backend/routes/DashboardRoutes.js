import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.Controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/dashboard-stats', verifyToken, getDashboardStats);

export default router;
