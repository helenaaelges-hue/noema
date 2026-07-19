import type {AnalyticsEvent} from "@/src/lib/insights";

type EventOverrides =
    Partial<AnalyticsEvent> & {
        triggerNames?: string[];
    };

export function makeEvent(
    overrides:
        EventOverrides = {}
): AnalyticsEvent {
    const {
        triggerNames = [],
        ...eventOverrides
    } = overrides;

    return {
        id: 1,
        category: "Mood",
        value: "Okay",
        moodScore: 5,
        notes: null,
        eventDate: "2026-07-15T12:00:00.000Z",
        createdAt: "2026-07-15T12:00:00.000Z",
        triggers:
            triggerNames.map(
                (name, index) => ({
                    trigger: {
                        id: index + 1,
                        name,
                    },
                })
            ),

        ...eventOverrides,
    } as AnalyticsEvent;
}