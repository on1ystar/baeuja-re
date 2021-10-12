/**
  @description role entity with repository
  @version PEAC-131-guest-login
*/

export default class Role {
  constructor(readonly roleId?: number, readonly name?: string) {}

  static getRoleId(roleName: string): number | undefined {
    if (roleName === 'admin') return 1;
    else if (roleName === 'member') return 2;
    else if (roleName === 'guest') return 3;
    else new Error('Invalid the roleName parameter value');
  }
}
