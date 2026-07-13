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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="rounded-xl border p-5">
                    <p className="text-sm text-gray-500">
                        Total Events
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {totalEvents}
                    </p>
                </div>

                <div className="rounded-xl border p-5">
                    <p className="text-sm text-gray-500">
                        Average Mood
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {averageMood ?? "-"}
                    </p>
                </div>
            
                <div className="rounded-xl border p-5">
                    <p className="text-sm text-gray-500">
                        Mood Entries
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {totalMoodEntries}
                    </p>
                </div>

                <div className="rounded-xl border p-5">
                    <p className="text-sm text-gray-500">
                        Top Trigger
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {topTrigger}
                    </p>
                </div>
            </div>

            <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Latest Mood
                </h2>

                {latestMood ? (
                    <>
                        <p>
                            <strong>Value:</strong> {latestMood.value}
                        </p>

                        <p>
                            <strong>Score:</strong> {latestMood.moodScore}
                        </p>

                        <p>
                            <strong>Date:</strong>{" "}
                            {new Date(
                                latestMood.eventDate
                            ).toLocaleString()}
                        </p>
                    </>
                ) : (
                    <p>No mood entries yet.</p>
                )}
            </div>
        </Accordion>
    );
}