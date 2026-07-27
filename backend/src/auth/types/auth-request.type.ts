import { Request } from "express";
import { AuthenticatedUser } from "src/common/types/authenticated-user.type"

export type AuthRequest = Request & {
    user: AuthenticatedUser;
}