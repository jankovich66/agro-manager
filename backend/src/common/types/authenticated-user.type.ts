import { Language } from "@prisma/client";

export type AuthenticatedUser = {
    id: string;
    email: string;
    username: string | null;
    firstName: string;
    lastName: string;
    language: Language;
};
