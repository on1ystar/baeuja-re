/**
  @description user entity with repository
  @version PEAC-131-guest-login
*/

export default class User {
  constructor(
    readonly userId?: number,
    readonly email?: string,
    readonly nickname?: string,
    readonly locale?: string,
    readonly roleId?: number,
    readonly createdAt?: string,
    readonly latestLogin?: string,
    readonly modifiedAt?: string
  ) {}
}
