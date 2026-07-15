import { hash } from "bcrypt";
import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";

const DEFAULT_CATEGORIES = [
    "Mood",
    "Sleep",
    "Exercise",
    "Work",
    "Food",
    "Social",
    "Health",
    "Weather",
];

const DEFAULT_TRIGGERS = [
    "Exercise",
    "Coffee",
    "Bad Sleep",
    "Weekend",
    "Monday",
    "Rain",
    "Friends",
    "Partner",
    "Work",
    "Vacation",
    "Therapy",
    "Reading",
];

export async function POST(
    request: Request
) {
    let body: unknown;

    try {
        body =
            await request.json();
    } catch {
        return NextResponse.json(
            {
                error:
                    "Invalid request body.",
            },
            {
                status: 400,
            }
        );
    }

    if (
        !body ||
        typeof body !== "object"
    ) {
        return NextResponse.json(
            {
                error:
                    "Invalid request body.",
            },
            {
                status: 400,
            }
        );
    }

    const input =
        body as Record<
            string,
            unknown
        >;

    const name =
        typeof input.name === "string"
            ? input.name.trim()
            : "";

    const email =
        typeof input.email === "string"
            ? input.email
                .trim()
                .toLowerCase()
            : "";

    const password =
        typeof input.password === "string"
            ? input.password
            : "";

    if (
        name.length < 2 ||
        name.length > 80
    ) {
        return NextResponse.json(
            {
                error:
                    "Name must be between 2 and 80 characters.",
            },
            {
                status: 400,
            }
        );
    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        !emailPattern.test(email)
    ) {
        return NextResponse.json(
            {
                error:
                    "Enter a valid email address.",
            },
            {
                status: 400,
            }
        );
    }

    if (password.length < 8) {
        return NextResponse.json(
            {
                error:
                    "Password must contain at least 8 characters.",
            },
            {
                status: 400,
            }
        );
    }

    const existingUser =
        await prisma.user.findUnique({
            where: {
                email,
            },

            select: {
                id: true,
            },
        });

    if (existingUser) {
        return NextResponse.json(
            {
                error:
                    "An account with this email already exists.",
            },
            {
                status: 409,
            }
        );
    }

    const passwordHash =
        await hash(
            password,
            12
        );

    try {
        const user =
            await prisma.$transaction(
                async transaction => {
                    const createdUser =
                        await transaction
                            .user
                            .create({
                                data: {
                                    name,
                                    email,
                                    passwordHash,
                                },

                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                },
                            });

                    await transaction
                        .category
                        .createMany({
                            data:
                                DEFAULT_CATEGORIES
                                    .map(
                                        categoryName => ({
                                            name:
                                                categoryName,
                                            userId:
                                                createdUser.id,
                                        })
                                    ),
                        });

                    await transaction
                        .trigger
                        .createMany({
                            data:
                                DEFAULT_TRIGGERS
                                    .map(
                                        triggerName => ({
                                            name:
                                                triggerName,
                                            userId:
                                                createdUser.id,
                                        })
                                    ),
                        });

                    return createdUser;
                }
            );

        return NextResponse.json(
            {
                user,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(
            "Registration failed:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Account creation failed.",
            },
            {
                status: 500,
            }
        );
    }
}