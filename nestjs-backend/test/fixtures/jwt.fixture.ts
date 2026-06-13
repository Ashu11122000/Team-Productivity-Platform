import { Role } from '../../src/common/enums/roles.enum';

export const jwtPayloadFixture = {
  sub: 'user-123',

  email: 'user@example.com',

  role: Role.USER,

  iss: 'fastapi-backend',

  aud: 'team-productivity-platform',

  type: 'access',
};
