import {TimeRange} from "@/src/lib/timeFilter";

type Props = {
    value: TimeRange;
    onChange: (range: TimeRange) => void;
};

export default function TimeRangeSelector({
    value,
    onChange,
}: Props) {

    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="mb-6">
                <p className="font-medium mb-2">
                    Time Range
                </p>
                <div className="flex flex-wrap gap-2">
                    {[
                        ["7d", "7D"],
                        ["30d", "30D"],
                        ["90d", "90D"],
                        ["365d", "1Y"],
                        ["all", "All"],
                    ].map(([buttonValue, label]) => (

                        <button
                            key={buttonValue}
                            onClick={() =>
                                onChange(buttonValue as TimeRange)
                            }
                            className={`px-4 py-2 rounded-lg border transition ${
                                value === buttonValue
                                    ? "bg-black text-white"
                                    : "bg-white hover:bg-gray-100"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}