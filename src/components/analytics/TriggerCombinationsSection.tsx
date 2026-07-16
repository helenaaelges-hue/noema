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
    ) => "Low" | "Moderate" | "High";
};

export default function TriggerCombinationsSection({
    combinations,
    confidenceLabel,
}: Props) {
    return (
        <Accordion
            title="Trigger Pair Associations"
        >
            {combinations.length === 0 ? (
                <p>
                    Not enough combination data yet.
                </p>
            ) : (
                <div className="space-y-4">
                    {combinations
                        .slice(0, 10)
                        .map((combo) => (

                        <div
                            key={combo.label}
                            className="border rounded-lg p-4"
                        >
                            <h3 className="font-semibold">
                                {combo.label}
                            </h3>

                            <p>
                                Average Mood:{" "}
                                {combo.averageMood.toFixed(1)}
                            </p>

                            <p>
                                Difference:{" "}
                                {combo.difference > 0
                                    ? "+"
                                    : ""}
                                {combo.difference}
                            </p>

                            <p>
                                Entries: {combo.entries}
                            </p>

                            <ConfidenceBadge
                                level={confidenceLabel(combo.entries)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </Accordion>
    );
}