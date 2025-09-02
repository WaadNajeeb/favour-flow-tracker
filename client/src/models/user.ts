// src/app/models/user.model.ts

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  userName: string;
  points:number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
}


export interface RegisterResponse {
  success: boolean;
  message: string;
}
