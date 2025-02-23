import express from 'express';
const router = express.Router();

// Get user profile
router.get('/profile', (req, res) => {
  res.json({ user: req.user });
});

export default router; 