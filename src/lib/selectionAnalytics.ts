import {AnalyticsEvent} from "./insights";

export function getSelectionAverageMood(
    events: AnalyticsEvent[]
) {

    const moods =
        events.filter(
            (e)=>
                e.moodScore !== null
        );

    if (!moods.length) {

        return null;
    }

    return Number(
        (
            moods.reduce(
                (sum, e)=>
                    sum + e.moodScore!,
                0
            ) /
            moods.length
        ).toFixed(1)
    );
}

export function moodDifferenceFromBaseLine(
    allEvents: AnalyticsEvent[],
    filteredEvents: AnalyticsEvent[]
) {
    const overall =
        getSelectionAverageMood(allEvents);

    const selected =
        getSelectionAverageMood(filteredEvents);

    if (
        overall === null ||
        selected === null
    ) {
        return null;
    }

    return Number(
        (
            selected -
            overall
        ).toFixed(1)
    );
}