import Accordion from "../Accordion";

type LatestMood = {
    value: string;
    moodScore: number | null;
    eventDate: Date | string;
};

type Props = {
    totalEvents: number;
    averageMood: number | null;
    totalMoodEntries: number;
    topTrigger: string;
    latestMood: LatestMood | null;
};

export default function OverviewSection({
    totalEvents,
    averageMood,
    totalMoodEntries,
    topTrigger,
    latestMood,
}: Props) {
    return (
        <Accordion
            title="Overview"
            defaultOpen
        >
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Total events
                    </dt>

                    <dd className="mt-2 text-2xl font-bold text-slate-900">
                        {totalEvents}
                    </dd>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Average mood
                    </dt>

                    <dd className="mt-2 text-2xl font-bold text-slate-900">
                        {averageMood ?? "-"}
                    </dd>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Mood entries
                    </dt>

                    <dd className="mt-2 text-2xl font-bold text-slate-900">
                        {totalMoodEntries}
                    </dd>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Most frequent trigger
                    </dt>

                    <dd className="mt-2 break-words text-2xl font-bold text-slate-900">
                        {topTrigger || "None"}
                    </dd>
                </div>
            </dl>

            <section className="mt-6 rounded-xl border border-slate-200 p-4">
                <h2 className="font-semibold text-slate-900">
                    Latest mood
                </h2>

                {latestMood ? (
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                        <div>
                            <dt className="font-medium text-slate-700">
                                Value
                            </dt>

                            <dd className="mt-1 text-slate-600">
                                {latestMood.value}
                            </dd>
                        </div>

                        <div>
                            <dt className="font-medium text-slate-700">
                                Score
                            </dt>

                            <dd className="mt-1 text-slate-600">
                                {latestMood.moodScore ?? "-"}
                            </dd>
                        </div>

                        <div>
                            <dt className="font-medium text-slate-700">
                                Date
                            </dt>

                            <dd className="mt-1 text-slate-600">
                                {new Date(
                                    latestMood.eventDate
                                ).toLocaleString(
                                    "de-DE"
                                )}
                            </dd>
                        </div>
                    </dl>
                ) : (
                    <p className="mt-3 text-sm text-slate-600">
                        No mood entries yet.
                    </p>
                )}
            </section>
        </Accordion>
    );
}