import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

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

    for (const category of categories) {
        await prisma.category.create({
            data: {
                name: category,
            },
        });
    }

    for (const trigger of triggers) {
        await prisma.trigger.create({
            data: {
                name: trigger,
            },
        });
    }

    const dbTriggers =
        await prisma.trigger.findMany();

    const startDate = new Date();

    startDate.setMonth(
        startDate.getMonth() -6
    );

    for (let day = 0; day < 120; day++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + day);

        const weekday = date.getDay();

        const isWeekend =
            weekday === 0 ||
            weekday === 6;

            let mood = randomInt(5, 7);

            const todaysTriggers: number[] = [];

        if (isWeekend) {
            mood += 1;

            const weekend =
                dbTriggers.find(
                    t => t.name === "Weekend"
                );

            if (weekend) {
                todaysTriggers.push(
                    weekend.id
                );
            }
        }

        if (weekday === 1) {
            mood -= 1;

            const monday =
                dbTriggers.find(
                    t => t.name === "Monday"
                );

            if (monday) {
                todaysTriggers.push(
                    monday.id
                );
            }
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
            const rain =
                dbTriggers.find(
                    t => t.name === "Rain"
                );

            if (rain) {
                todaysTriggers.push(
                    rain.id
                );
            }
        }

        const sleepHours = randomInt(5, 9);

        if (sleepHours <= 6) {
            mood -= 2;
            const badSleep =
                dbTriggers.find(
                    t =>
                        t.name ===
                        "Bad Sleep"
                );

            if (badSleep) {
                todaysTriggers.push(
                    badSleep.id
                );
            }
        }

        const exercised = Math.random() < 0.35;

        if (exercised) {
            mood += 2;
            const exercise =
                dbTriggers.find(
                    t =>
                        t.name ===
                        "Exercise"
                );

            if (exercise) {
                todaysTriggers.push(
                    exercise.id
                );
            }
        }

        const social = Math.random() < 0.28;

        if (social) {
            mood += 1;
            const friends =
                dbTriggers.find(
                    t =>
                        t.name ===
                        "Friends"
                );

            if (friends) {
                todaysTriggers.push(
                    friends.id
                );
            }
        }

        const worked =
            !isWeekend &&
            Math.random() < 0.9;

        if (worked) {
            mood -= 1;
            const work =
                dbTriggers.find(
                    t =>
                        t.name ===
                        "Work"
                );

            if (work) {
                todaysTriggers.push(
                    work.id
                );
            }
        }

        await prisma.event.create({
            data: {
                category: "Sleep",
                value: `${sleepHours} hours.`,
                moodScore: null,
                notes: null,
                eventDate: date,
            },
        });

        await prisma.event.create({
            data: {
                category: "Weather",
                value: weather,
                moodScore: null,
                notes: null,
                eventDate: date,
            },
        });

        if (exercised) {
            await prisma.event.create({
                data: {
                    category: "Exercise",
                    value: randomItem([
                        "Gym",
                        "Run",
                        "Walk",
                        "Cycling",
                        "Yoga",
                    ]),
                    moodScore: null,
                    notes: null,
                    eventDate: date,
                },
            });
        }

        if (worked) {
            await prisma.event.create({
                data: {
                    category: "Work",
                    value: randomItem([
                        "Busy day",
                        "Meetings",
                        "Deep work",
                        "Emails",                    
                    ]),
                    moodScore: null,
                    notes: null,
                    eventDate: date,
                },
            });
        }

        if (social) {
            await prisma.event.create({
                data: {
                    category: "Social",
                    value: randomItem([
                        "Friends",
                        "Family",
                        "Partner",
                        "Coffee",
                    ]),
                    moodScore: null,
                    notes: null,
                    eventDate: date,
                },
            });
        }

        const moodEvent = await prisma.event.create({
            data: {
                category: "Mood",
                value: randomItem([
                    "Very happy",
                    "Happy",
                    "Okay",
                    "Tired",
                    "Anxious",
                    "Sad",
                    "Relaxed",
                    "Excited",
                ]),
                moodScore: Math.max(
                    1,
                    Math.min(10, mood)
                ),
                notes: null,
                eventDate: date,
            },
        });

        await prisma.eventTrigger.createMany({
            data: todaysTriggers.map(
                (triggerId) => ({
                    eventId: moodEvent.id,
                    triggerId,
                })
            ),
        });
    }

    console.log(
        "Seeded demo database successfully."
    );
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });

