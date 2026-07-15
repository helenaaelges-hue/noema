import { auth } from "@/auth";

export class UnauthorizedError
    extends Error {
    constructor() {
        super("Authentication required.");
        this.name = "UnauthorizedError";
    }
}

export async function requireUserId():
    Promise<number> {
    const session =
        await auth();

    const userId =
        Number(session?.user?.id);

    if (
        !Number.isInteger(userId) ||
        userId <= 0
    ) {
        throw new UnauthorizedError();
    }

    return userId;
}