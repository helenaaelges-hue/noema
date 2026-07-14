import { prisma } from "@/src/lib/prisma";

const DEMO_USER_EMAIL =
    "demo@noema.local";

export async function requireUserId():
    Promise<number> {
    const user =
        await prisma.user.findUnique({
            where: {
                email: DEMO_USER_EMAIL,
            },
            select: {
                id: true,
            },
        });

    if (!user) {
        throw new Error(
            "Demo user not found. Run npm run seed."
        );
    }

    return user.id;
}