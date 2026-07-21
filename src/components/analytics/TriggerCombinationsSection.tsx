import Accordion from "../Accordion";
import ConfidenceBadge from "./ConfidenceBadge";

type Combination = {
    label: string;
    averageMood: number;
    difference: number;
    entries: number;
};

type Props = {
    combinations: Combination[];
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
    return difference > 0
        ? `+${difference.toFixed(1)}`
        : difference.toFixed(1);
}

export default function TriggerCombinationsSection({
    combinations,
    confidenceLabel,
}: Props) {
    if (
        combinations.length === 0
    ) {
        return (
            <Accordion title="Trigger Pair Associations">
                <p className="text-sm text-slate-600">
                    No trigger pairs
                    occurred together often
                    enough during this
                    period.
                </p>
            </Accordion>
        );
    }

    return (
        <Accordion title="Trigger Pair Associations">
            <p className="text-sm leading-6 text-slate-600">
                These results compare
                mood entries where two
                triggers occurred together
                with your overall mood
                average. They describe
                associations in your
                recorded data, not proven
                causes.
            </p>

            <div className="mt-5 space-y-3">
                {combinations
                    .slice(0, 10)
                    .map(combo => (
                        <article
                            key={
                                combo.label
                            }
                            className="rounded-xl border border-slate-200 p-4"
                        >
                            <h3 className="font-semibold text-slate-900">
                                {
                                    combo.label
                                }
                            </h3>

                            <div className="mt-2">                                    
                                    <p className="text-sm text-slate-600">
                                        Average mood:{" "}
                                        <strong className="text-slate-900">
                                            {combo.averageMood.toFixed(
                                                1
                                            )}
                                        </strong>
                                    </p>

                                    <p className="text-sm text-slate-600">
                                        Difference:{" "}
                                        <strong className="text-slate-900">
                                            {formatDifference(
                                                combo.difference
                                            )}
                                        </strong>{" "}
                                        compared with
                                        overall mood
                                    </p>

                                    <p className="text-sm text-slate-600">
                                        Entries:
                                        {
                                            combo.entries
                                        }
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <ConfidenceBadge
                                        level={confidenceLabel(
                                            combo.entries
                                        )}
                                    />
                                </div>
                        </article>
                    ))}
            </div>
        </Accordion>
    );
}