import { RowDataPacket } from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt = require("bcryptjs");

import { pool } from '../config/db';
import { User } from '../models/user';
import { hashPassword } from '../utils/password';
import { isValidEmail, isStrongPassword } from '../utils/validate';


export async function registerUser(username: string, email: string, password: string) {
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
    await conn.query(queryInsert, [username, email, hashed, registerDate, false]);
  } finally {
    conn.release();
  }
}


export async function loginUser(email: string, password: string) {
  const conn = await pool.getConnection();

  try {
    const queryFind = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await conn.query(queryFind,[email]);

    const users = rows as RowDataPacket[] as User[];

    if (users.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Invalid credentials');
    }

    const jwt_secret = process.env.JWT_SECRET || '';
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email
      },
      jwt_secret,
      { expiresIn: '1d' }
    );

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        registerDate: user.registerDate
      }
    };


  } finally {
    conn.release();
  }

}