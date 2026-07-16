type Props = {
    averageMood: number | null;
    moodTrend: {
        label: string;
        value: number;
    };
    bestTrigger: string;
};

export default function KPICards({
    averageMood,
    moodTrend,
    bestTrigger,
}: Props) {

    return (

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4 mb-8">
            <div className="rounded-xl border p-5">
                <p className="text-sm text-gray-500">
                    Average Mood
                </p>

                <p className="text-3xl font-bold">
                    {averageMood ?? "-"}
                </p>
            </div>

            <div className="rounded-xl border p-5">
                <p className="text-sm text-gray-500">
                    Current Trend
                </p>

                <p className="text-2xl font-semibold">
                    {moodTrend.label}
                </p>

                <p className="text-sm text-gray-500">
                    {moodTrend.value > 0 ? "+" : ""}
                    {moodTrend.value}
                </p>
            </div>

            <div className="rounded-xl border p-5">
                <p className="text-sm text-gray-500">
                    Most Positive Trigger
                </p>

                <p className="text-xl font-semibold">
                    {bestTrigger ?? "-"}
                </p>
            </div>
        </div>
    );
}