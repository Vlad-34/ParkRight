import { JwtPayload } from "jwt-decode";

export type FormFields = {
  confirm?: string | null;
  password?: string | null;
  email?: string | null;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
};

export type Message = {
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
};

export type ExtendedJwtPayload = JwtPayload & {
  user_id: number;
  is_staff: boolean;
};

export type ImageMap = {
  scooter_id: number;
  user_id: number;
  image: string;
  timestamp: string;
  prediction: string;
};
