import Accordion from "../Accordion";
import ConfidenceBadge from "./ConfidenceBadge";

type TriggerData = {
    trigger: string;
    average: number;
    difference: number;
    entries: number;
};

type Props = {
    triggerMoodAverages: TriggerData[];
    overallAverage: number;
    bestTrigger: TriggerData | null;
    worstTrigger: TriggerData | null;
    confidenceLabel: (
        entries: number
    ) =>
        | "Low"
        | "Moderate"
        | "High";
};

function formatDifference(
    difference: number
): string {
    if (difference > 0) {
        return `+${difference.toFixed(1)}`;
    }

    return difference.toFixed(1);
}

export default function TriggerAnalysisSection({
    triggerMoodAverages,
    overallAverage,
    bestTrigger,
    worstTrigger,
    confidenceLabel,
}: Props) {
    if (
        triggerMoodAverages.length ===
        0
    ) {
        return (
            <Accordion title="Trigger Analysis">
                <p className="text-sm text-slate-600">
                    No trigger-linked mood
                    entries are available
                    for this period.
                </p>
            </Accordion>
        );
    }

    return (
        <Accordion title="Trigger Analysis">
            <p className="text-sm leading-6 text-slate-600">
                Trigger averages are
                compared with your overall
                mood average of{" "}
                <strong>
                    {overallAverage}
                </strong>
                . These are associations,
                not proven causes.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        Highest associated mood
                    </p>

                    {bestTrigger ? (
                        <>
                            <h3 className="mt-2 text-lg font-semibold text-slate-900">
                                {
                                    bestTrigger.trigger
                                }
                            </h3>

                            <p className="mt-2 text-sm text-slate-700">
                                Average mood:{" "}
                                <strong>
                                    {
                                        bestTrigger.average
                                    }
                                    /10
                                </strong>
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                                Difference:{" "}
                                <strong>
                                    {formatDifference(
                                        bestTrigger.difference
                                    )}
                                </strong>
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                                Entries:{" "}
                                {
                                    bestTrigger.entries
                                }
                            </p>

                            <div className="mt-3">
                                <ConfidenceBadge
                                    level={confidenceLabel(
                                        bestTrigger.entries
                                    )}
                                />
                            </div>
                        </>
                    ) : (
                        <p className="mt-2 text-sm text-slate-600">
                            No data.
                        </p>
                    )}
                </div>

                <div className="rounded-xl border border-red-200 bg-red-50/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                        Lowest associated mood
                    </p>

                    {worstTrigger ? (
                        <>
                            <h3 className="mt-2 text-lg font-semibold text-slate-900">
                                {
                                    worstTrigger.trigger
                                }
                            </h3>

                            <p className="mt-2 text-sm text-slate-700">
                                Average mood:{" "}
                                <strong>
                                    {
                                        worstTrigger.average
                                    }
                                    /10
                                </strong>
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                                Difference:{" "}
                                <strong>
                                    {formatDifference(
                                        worstTrigger.difference
                                    )}
                                </strong>
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                                Entries:{" "}
                                {
                                    worstTrigger.entries
                                }
                            </p>

                            <div className="mt-3">
                                <ConfidenceBadge
                                    level={confidenceLabel(
                                        worstTrigger.entries
                                    )}
                                />
                            </div>
                        </>
                    ) : (
                        <p className="mt-2 text-sm text-slate-600">
                            No data.
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 space-y-3">
                {triggerMoodAverages
                    .slice(0, 8)
                    .map(item => (
                        <article
                            key={
                                item.trigger
                            }
                            className="rounded-xl border border-slate-200 p-4"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        {
                                            item.trigger
                                        }
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-600">
                                        Average mood:{" "}
                                        {
                                            item.average
                                        }
                                        /10
                                    </p>

                                    <p className="text-sm text-slate-600">
                                        Difference:{" "}
                                        {formatDifference(
                                            item.difference
                                        )}
                                    </p>

                                    <p className="text-sm text-slate-600">
                                        Entries:{" "}
                                        {
                                            item.entries
                                        }
                                    </p>
                                </div>

                                <ConfidenceBadge
                                    level={confidenceLabel(
                                        item.entries
                                    )}
                                />
                            </div>
                        </article>
                    ))}
            </div>
        </Accordion>
    );
}