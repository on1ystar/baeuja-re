export class User {
  userId: number;
  email: string | undefined;
  country: string | undefined;
  deviceOs: string | undefined;
  usageTime: string | undefined;
  refreshToken: string | undefined;
  isAdmin: boolean | undefined;
  createdAt: string | undefined;
  lastedLogin: string | undefined;
  modifiedAt: string | undefined;
  constructor(
    user_id: number,
    email?: string,
    country?: string,
    device_os?: string,
    usage_time?: string,
    refresh_token?: string,
    is_admin?: boolean,
    created_at?: string,
    lasted_login?: string,
    modified_at?: string
  ) {
    this.userId = user_id;
    this.email = email;
    this.country = country;
    this.deviceOs = device_os;
    this.usageTime = usage_time;
    this.refreshToken = refresh_token;
    this.isAdmin = is_admin;
    this.createdAt = created_at;
    this.lastedLogin = lasted_login;
    this.modifiedAt = modified_at;
  }
}
