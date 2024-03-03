import type { LoginData } from "../login/model";

export interface RegisterCodeData {
  email: string;
}

export interface RegisterData extends Partial<LoginData> {
  email?: string;
  captcha?: string;
}