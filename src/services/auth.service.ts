import { RowDataPacket } from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt = require("bcryptjs");
import { randomBytes } from 'crypto';

import { pool } from '../config/db';
import { User } from '../models/user';
import { hashPassword } from '../utils/password';
import { isValidUsername, isValidEmail, isStrongPassword } from '../utils/validate';
import { sendVerificationEmail } from '../utils/email';
import { createToken } from '../utils/token';


export async function registerUser(username: string, email: string, password: string) {
  if (!isValidUsername(username)) throw new Error('User name format invalid');
  if (!isValidEmail(email)) throw new Error('Mail format invalid');
  if (!isStrongPassword(password)) throw new Error('Weak password!');

  const conn = await pool.getConnection();

  try {
    const queryExists = 'SELECT id FROM users WHERE email = ?';
    const [existing] = await conn.query(queryExists, [email]) as any[];
    if (existing.length > 0) throw new Error('Email is already registered!');

    const hashed = await hashPassword(password);
    const registerDate = new Date();

    const queryInsert = 'INSERT INTO users (username, email, password, registerDate, verified) VALUES (?, ?, ?, ?, ?)';
    const [result] = await conn.query(queryInsert, [username, email, hashed, registerDate, false]) as any[];

    const userId = result.insertId;
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const queryVerif = 'INSERT INTO emailVerification (userId, token, expires_at) VALUES (?, ?, ?)';
    await conn.query(queryVerif, [userId, token, expiresAt]);

    await sendVerificationEmail(email, token);

  } finally {
    conn.release();
  }
}


export async function loginUser(email: string, password: string) {

  if (!isValidEmail(email)) throw new Error('Mail format invalid');

  const conn = await pool.getConnection();

  try {
    const queryFind = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await conn.query(queryFind, [email]);

    const users = rows as RowDataPacket[] as User[];

    if (users.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = users[0];

    if (!user.verified) {
      await reSendVerificationEmail(user);
      throw new Error('Please verify your account before logging in. A new verification email has been sent.');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Invalid credentials');
    }

    const token = createToken(user);

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        registerDate: user.registerDate,
        verified: user.verified
      }
    };

  } finally {
    conn.release();
  }

}

export async function verifyEmailToken(token: string) {

  const conn = await pool.getConnection();

  try {
    const queryValidation = 'SELECT * FROM emailVerification WHERE token = ? AND expires_at > NOW()';
    const [rows] = await conn.query(queryValidation, [token]) as any[];

    if (rows.length === 0) throw new Error('Invalid or expired token');

    const userId = rows[0].userId;

    const updateQuery = 'UPDATE users SET verified = true WHERE id = ?';
    const deleteQuery = 'DELETE FROM emailVerification WHERE userId = ?'
    await conn.query(updateQuery, [userId]);
    await conn.query(deleteQuery, [userId]);

  } finally {
    conn.release();
  }
}

export async function reSendVerificationEmail(user: User) {

  const conn = await pool.getConnection();

  try {
    const token = createToken(user);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const deleteQuery = 'DELETE FROM emailVerification WHERE userId = ?';
    await conn.query(deleteQuery, [user.id]);

    const insertQuery = 'INSERT INTO emailVerification (userId, token, expires_at) VALUES (?, ?, ?)';
    await conn.query(insertQuery, [user.id, token, expiresAt]);

    await sendVerificationEmail(user.email, token);

  } finally {
    conn.release();
  }
}

export async function deleteUserAccount(email: string) {

  const conn = await pool.getConnection();

  try {
    const queryExists = 'SELECT id FROM users WHERE email = ?';
    const [existing] = await conn.query(queryExists, [email]) as any[];

    if (existing.length > 0) {
      const userId = existing[0].userId;
      const deleteQuery = 'DELETE FROM users WHERE id = ?';
      await conn.query(deleteQuery, [userId]);
    } else {
      throw new Error('Email not found!');
    }

  } finally {
    conn.release();
  }

}