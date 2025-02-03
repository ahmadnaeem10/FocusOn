import { Request } from 'express';
import { UserDto } from '../users/dto/user.dto';

// Original interfaces
export interface RequestWithUser extends Request {
  user: UserDto;
}

export interface JwtPayloadDataPayload {
  userId: number;
}

export interface JwtPayload extends JwtPayloadDataPayload {
  iat: number;
  exp: number;
}

// Extend express.Request to include user properties
declare module 'express' {
  interface Request {
    user?: {
      id: number;
      email: string;
      role: string;
      // Add Google-specific fields as optional
      fullName?: string;
      provider?: string;
      providerId?: string;
    };
  }
}
