import { UserPayload } from "./modules/user/user.types"

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};