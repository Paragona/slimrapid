export interface AuthToken {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

export interface User {
  id: string
  email: string
  name?: string
  role?: string
}

export type ProtectedRouteConfig = {
  path: string;
  requireAuth: boolean;
  redirectTo?: string;
}
