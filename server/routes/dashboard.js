import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// Protect the route with authentication
router.use(verifyToken);

// Get dashboard statistics
router.get('/stats', getDashboardStats);

export default router; 