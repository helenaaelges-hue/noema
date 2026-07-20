import type {
    TimeRange,
} from "@/src/lib/timeFilter";

type Props = {
    value: TimeRange;
    onChange: (
        range: TimeRange
    ) => void;
};

const timeRangeOptions: {
    value: TimeRange;
    label: string;
}[] = [
    {
        value: "7d",
        label: "7 days",
    },
    {
        value: "30d",
        label: "30 days",
    },
    {
        value: "90d",
        label: "90 days",
    },
    {
        value: "365d",
        label: "1 year",
    },
    {
        value: "all",
        label: "All time",
    },
];

export default function TimeRangeSelector({
    value,
    onChange,
}: Props) {
    return (
        <div>
            <p className="field-label">
                Time range
            </p>

            <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Analytics time range"
            >
                {timeRangeOptions.map(
                    option => (
                        <button
                            key={
                                option.value
                            }
                            type="button"
                            onClick={() =>
                                onChange(
                                    option.value
                                )
                            }
                            aria-pressed={
                                value ===
                                option.value
                            }
                            className={
                                value ===
                                option.value
                                    ? "rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-200"
                                    : "rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
                            }
                        >
                            {
                                option.label
                            }
                        </button>
                    )
                )}
            </div>
        </div>
    );
}