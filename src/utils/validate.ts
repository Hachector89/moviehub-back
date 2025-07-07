export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isStrongPassword(password: string): boolean {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  return usernameRegex.test(username);
}