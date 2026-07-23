import {PrismaClient} from "@prisma/client";
import {hash} from "bcrypt";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@noema.local";
const DEMO_PASSWORD = "demo12345";

const isProduction =
    process.env.NODE_ENV ===
    "production";

const destructiveSeedAllowed =
    process.env
        .ALLOW_DESTRUCTIVE_SEED ===
    "true";

if (
    isProduction &&
    !destructiveSeedAllowed
) {
    throw new Error(
        "Destructive seeding is disabled in production. Set ALLOW_DESTRUCTIVE_SEED=true only for an intentional demo database reset."
    );
}

function randomItem<T>(array: T[]): T {
    return array[
        Math.floor(Math.random() * array.length)
    ];
}

function randomInt(
    min: number,
    max: number
) {
    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;
}

function atTime(
    date: Date,
    hour: number,
    minute = 0
): Date {
    const result = new Date(date);

    result.setHours(
        hour,
        minute,
        0,
        0
    );

    return result;
}

function moodLabel(score: number): string {
    if (score >= 9) return "Very happy";
    if (score >= 8) return "Happy";
    if (score >= 7) return "Relaxed";
    if (score >= 6) return "Okay";
    if (score >= 5) return "Tired";
    if (score >= 4) return "Anxious";
    return "Sad";
}

const categories = [
    "Mood",
    "Sleep",
    "Exercise",
    "Work",
    "Food",
    "Social",
    "Health",
    "Weather",
];

const triggers = [
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

async function main() {
    await prisma.eventTrigger.deleteMany();
    await prisma.event.deleteMany();
    await prisma.trigger.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    const passwordHash =
        await hash(
            DEMO_PASSWORD,
            12
        );

    const demoUser =
        await prisma.user.create({
            data: {
                name: "Demo User",
                email: DEMO_EMAIL,
                passwordHash,
            },
        });

    const dbCategories =
        await Promise.all(
            categories.map(name =>
                prisma.category.create({
                    data: {
                        name: name.trim(),
                        userId: demoUser.id,
                    },
                })
            )
        );

    const dbTriggers =
        await Promise.all(
            triggers.map(name =>
                prisma.trigger.create({
                    data: {
                        name: name.trim(),
                        userId: demoUser.id,
                    },
                })
            )
        );

    const categoryIds =
        new Map<string, number>(
            dbCategories.map(category => [
                category.name.trim(),
                category.id,
            ])
        );

    const triggerIds =
        new Map<string, number>(
            dbTriggers.map(trigger => [
                trigger.name.trim(),
                trigger.id,
            ])
        );

    function requireCategoryId(
        name: string
    ): number {
        const id =
            categoryIds.get(name.trim());

        if (id === undefined) {
            throw new Error(
                `Category not found: ${name}`
            );
        }

        return id;
    }

    function requireTriggerId(
        name: string
    ): number {
        const id =
            triggerIds.get(name.trim());

        if (id === undefined) {
            throw new Error(
                `Trigger not found: ${name}`
            );
        }

        return id;
    }

    async function createEvent({
        categoryName,
        value,
        moodScore = null,
        notes = null,
        eventDate,
        eventTriggerIds = [],
    }: {
        categoryName: string;
        value: string;
        moodScore?: number | null;
        notes?: string | null;
        eventDate: Date;
        eventTriggerIds?: number[];
    }) {
        const uniqueTriggerIds =
            Array.from(
                new Set(eventTriggerIds)
            );

        return prisma.event.create({
            data: {
                userId: demoUser.id,
                categoryId:
                    requireCategoryId(
                        categoryName
                    ),
                value,
                moodScore,
                notes,
                eventDate,

                ...(uniqueTriggerIds.length > 0
                    ? {
                        triggers: {
                            create:
                                uniqueTriggerIds.map(
                                    triggerId => ({
                                        triggerId,
                                    })
                                ),
                        },
                    }
                    : {}),
            },
        });
    }

    const startDate = new Date();

    startDate.setHours(
        0,
        0,
        0,
        0
    );

    startDate.setDate(
        startDate.getDate() - 119
    );

    for (
        let day = 0;
        day < 120;
        day++
    ) {
        const date =
            new Date(startDate);

        date.setDate(
            startDate.getDate() + day
        );

        const weekday =
            date.getDay();

        const isWeekend =
            weekday === 0 ||
            weekday === 6;

        let mood =
            randomInt(5, 7);

        const todaysTriggerIds =
            new Set<number>();

        function addTrigger(
            name: string
        ) {
            todaysTriggerIds.add(
                requireTriggerId(name)
            );
        }

        if (isWeekend) {
            mood += 1;
            addTrigger("Weekend");
        }

        if (weekday === 1) {
            mood -= 1;
            addTrigger("Monday");
        }

        const weather =
            randomItem([
                "Sunny",
                "Sunny",
                "Cloudy",
                "Rainy",
                "Rainy",
            ]);

        if (weather === "Rainy") {
            mood -= 1;
            addTrigger("Rain");
        }

        const sleepHours =
            randomInt(5, 9);

        if (sleepHours <= 6) {
            mood -= 2;
            addTrigger("Bad Sleep");
        }

        const drankCoffee =
            Math.random() < 0.45;

        if (drankCoffee) {
            mood += randomInt(0, 1);
            addTrigger("Coffee");
        }

        const exercised =
            Math.random() < 0.35;

        if (exercised) {
            mood += 2;
            addTrigger("Exercise");
        }

        const social =
            Math.random() < 0.28;

        if (social) {
            mood += 1;
            addTrigger("Friends");
        }

        const partnerInteraction =
            Math.random() < 0.22;

        if (partnerInteraction) {
            mood += randomInt(-2, 2);
            addTrigger("Partner");
        }

        const worked =
            !isWeekend &&
            Math.random() < 0.9;

        if (worked) {
            mood -= 1;
            addTrigger("Work");
        }

        const read =
            Math.random() < 0.18;

        if (read) {
            mood += 1;
            addTrigger("Reading");
        }

        const therapy =
            day % 21 === 7;

        if (therapy) {
            mood += 1;
            addTrigger("Therapy");
        }

        const vacation =
            day >= 50 &&
            day <= 54;

        if (vacation) {
            mood += 2;
            addTrigger("Vacation");
        }

        mood += randomInt(-1, 1);

        mood = Math.max(
            1,
            Math.min(10, mood)
        );

        await createEvent({
            categoryName: "Sleep",
            value: `${sleepHours} hours`,
            eventDate:
                atTime(date, 7, 30),
        });

        await createEvent({
            categoryName: "Weather",
            value: weather,
            eventDate:
                atTime(date, 8),
        });

        if (drankCoffee) {
            await createEvent({
                categoryName: "Food",
                value: "Coffee",
                eventDate:
                    atTime(date, 8, 30),
            });
        }

        if (worked) {
            await createEvent({
                categoryName: "Work",
                value: randomItem([
                    "Busy day",
                    "Meetings",
                    "Deep work",
                    "Emails",
                ]),
                eventDate:
                    atTime(date, 10),
            });
        }

        if (exercised) {
            await createEvent({
                categoryName:
                    "Exercise",
                value: randomItem([
                    "Gym",
                    "Run",
                    "Walk",
                    "Cycling",
                    "Yoga",
                ]),
                eventDate:
                    atTime(date, 18),
            });
        }

        if (social) {
            await createEvent({
                categoryName: "Social",
                value: randomItem([
                    "Friends",
                    "Family",
                    "Coffee together",
                ]),
                eventDate:
                    atTime(date, 19, 30),
            });
        }

        if (
            partnerInteraction &&
            !social
        ) {
            await createEvent({
                categoryName: "Social",
                value: "Partner time",
                eventDate:
                    atTime(date, 20),
            });
        }

        if (therapy) {
            await createEvent({
                categoryName: "Health",
                value: "Therapy session",
                eventDate:
                    atTime(date, 16),
            });
        }

        const moodHour =
            randomItem([
                9,
                14,
                20,
            ]);

        await createEvent({
            categoryName: "Mood",
            value: moodLabel(mood),
            moodScore: mood,
            eventDate:
                atTime(
                    date,
                    moodHour,
                    15
                ),
            eventTriggerIds:
                Array.from(
                    todaysTriggerIds
                ),
        });
    }

    const eventCount =
        await prisma.event.count({
            where: {
                userId: demoUser.id,
            },
        });

    console.log(
        `Created demo user: ${DEMO_EMAIL}`
    );

    console.log(
        `Demo password: ${DEMO_PASSWORD}`
    );

    console.log(
        `Seeded ${eventCount} demo events successfully.`
    );
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async error => {
        console.error(error);

        await prisma.$disconnect();

        process.exit(1);
    });