export interface User {
  userId: number;
  email?: string;
  nickname?: string;
  country?: string;
  deviceOs?: string;
  usageTime?: string;
  refreshToken?: string;
  isAdmin?: boolean;
  createdAt?: string;
  latestLogin?: string;
  modifiedAt?: string;
}
