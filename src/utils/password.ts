import bcrypt = require("bcryptjs");

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(input: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(input, hashed);
}