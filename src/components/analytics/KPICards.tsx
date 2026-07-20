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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="surface-card-compact">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Average Mood
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-indigo-700">
                    {averageMood ?? "-"}
                </p>
            </div>

            <div className="surface-card-compact">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Current Trend
                </p>

                <p className="mt-2 text-lg font-semibold text-slate-900">
                    {moodTrend.label}
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-indigo-700">
                    {moodTrend.value > 0
                        ? "+"
                        : ""}
                    {moodTrend.value}
                </p>
            </div>

            <div className="surface-card-compact">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Most Positive Trigger
                </p>

                <p className="mt-2 break-words text-2xl font-bold tracking-tight text-indigo-700">
                    {bestTrigger || "-"}
                </p>
            </div>
        </div>
    );
}