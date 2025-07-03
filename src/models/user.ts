export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  registerDate: Date;
  verified: boolean;
}