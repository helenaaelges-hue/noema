import type {
    Prisma,
} from "@prisma/client";

export type EventWithRelations =
    Prisma.EventGetPayload<{
        include: {
            category: true;
            triggers: {
                include: {
                    trigger: true;
                };
            };
        };
    }>;

export function serializeEvent(
    event: EventWithRelations
) {
    return {
        ...event,
        category:
            event.category.name,
    };
}