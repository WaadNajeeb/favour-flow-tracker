import { User } from "./user";

// src/app/models/favor.model.ts
export interface Favor {
  _id: string;
  title: string;
  description?: string;
  reward?: string[]; // Optional user-defined rewards

  status: 'Pending' | 'Completed' | 'Verified';
  favorType: 'personal' | 'public';

  from: User | string; // Can be a full user object or just ID
  to?: User | string;

  proofImage?: string;
  proofUploadedBy?: User | string;

  claimedBy?: User | string;
  claimedAt?: string;

  requiredBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
