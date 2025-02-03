import { SetMetadata } from '@nestjs/common';
import { ALLOW_UNAUTHORIZED_REQUEST } from '../../constant/allow-unauthorized-request';

export const AllowUnauthorizedRequest = () =>
  SetMetadata(ALLOW_UNAUTHORIZED_REQUEST, true);
