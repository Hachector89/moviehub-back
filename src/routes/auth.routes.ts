import express from 'express';

import { register, login, verifyEmail, deleteAccount } from '../controllers/auth.controller';
import { verifyAuth } from '../middlewares/verifyAuth'


const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/verify', verifyEmail);

router.delete('/delete', verifyAuth, deleteAccount);

export default router;