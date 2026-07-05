import {AnalyticsEvent} from "./insights";

export function filterEvents(
    events: AnalyticsEvent[],
    category: string,
    triggerId: number | null
) {
    return events.filter((event) => {
        if(category && event.category !== category) {
            return false;
        }

        if (
            triggerId !== null &&
            !event.triggers.some(
                (t) => t.trigger.id === triggerId
            )
        ) {
            return false;
        }

        return true;
    });
}