import { Request, Response } from 'express';
import { registerUser, loginUser, verifyEmailToken } from '../services/auth.service';

export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;

  try {
    await registerUser(username, email, password);
    res.status(201).json({ message: 'User registered, please verify account on your mail.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

export async function verifyEmail(req: Request, res: Response) {
  const token = req.query.token as string;
  if (!token) res.status(400).json({ error: 'Token is required' });

  try {
    const result = await verifyEmailToken(token);
    res.status(200).json({ message: 'Email verified successfully!', result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}