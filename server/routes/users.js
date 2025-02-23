import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getUsers,
  getUserDetails,
  updateUserStatus
} from '../controllers/userController.js';

const router = express.Router();

// Protect all routes with authentication
router.use(verifyToken);

router.get('/', getUsers);
router.get('/:id', getUserDetails);
router.patch('/:id/status', updateUserStatus);

export default router; 