import { Request, Response } from 'express';
import { registerUser, loginUser, verifyEmailToken, deleteUserAccount } from '../services/auth.service';

export async function register(req: Request, res: Response) {
  const { username, email, password, token } = req.body;

  try {
    await registerUser(username, email, password, token);
    res.status(201).json({ message: 'User registered, please verify account on your mail.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password, token } = req.body;

  try {
    const data = await loginUser(email, password, token);
    res.status(200).json(data);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

export async function verifyEmail(req: Request, res: Response) {
  const token = req.query.token as string;
  if (!token) res.status(400).json({ error: 'Token is required' });

  try {
    await verifyEmailToken(token);
    res.status(204); // or res.sendStatus(204), not sure, test pending
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteAccount(req: Request, res: Response) {
  const userEmail = req.user?.email;

  if (!userEmail) {
    res.status(401).json({ error: 'Unauthorized: no user email in token' });

  } else {

    try {
      await deleteUserAccount(userEmail);
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete account' });
    }
  }
}