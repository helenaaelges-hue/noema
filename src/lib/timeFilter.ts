import {AnalyticsEvent} from "./insights";

export type TimeRange =
    | "7d"
    | "30d"
    | "90d"
    | "365d"
    | "all";

export function filterByTimeRange(
    events: AnalyticsEvent[],
    range: TimeRange
) {
    if (range === "all") {
        return events;
    }

    const today = new Date();

    const cutoff = new Date(today);

    switch (range) {
        case "7d":
            cutoff.setDate(today.getDate() - 7);
            break;

        case "30d":
            cutoff.setDate(today.getDate() - 30);
            break;

        case "90d":
            cutoff.setDate(today.getDate() - 90);
            break;

        case "365d":
            cutoff.setDate(today.getDate() - 365);
            break;
    }

    return events.filter(
        event =>
            new Date(event.eventDate) >= cutoff
    );
}