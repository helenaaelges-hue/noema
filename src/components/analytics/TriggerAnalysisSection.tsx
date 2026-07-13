import Accordion from "../Accordion";
import ConfidenceBadge from "./ConfidenceBadge";

type TriggerData ={
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
    ) => "Low" | "Moderate" | "High";
};

export default function TriggerAnalysisSection({
    triggerMoodAverages,
    overallAverage,
    bestTrigger,
    worstTrigger,
    confidenceLabel,
}: Props) {
    return (
        <Accordion
            title="Trigger Analysis"
        >
            <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Trigger Insights
                </h2>

                {triggerMoodAverages.length === 0 ? (
                    <p>No mood data yet.</p>
                ) : (
                    triggerMoodAverages
                    .slice(0, 8)
                    .map((item) => (
                        <div
                            key={item.trigger}
                            className="mb-3"
                        >
                            <strong>
                                {item.trigger}
                            </strong>

                            <p>
                                Average mood:{" "}
                                {item.average}
                            </p>

                            <p>
                                Difference from Overall Average:
                                {" "}
                                {(item.average - overallAverage).toFixed(1)}
                            </p>

                            <p>
                                Entries: {" "}
                                {item.entries}
                            </p>

                            <ConfidenceBadge
                                level={confidenceLabel(item.entries)}
                            />
                        </div>
                    ))
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold">
                        Best Trigger
                    </h3>

                    {bestTrigger ? (
                        <>
                            <p className="font-semibold">
                                {bestTrigger.trigger}
                            </p>

                            <p>
                                {bestTrigger.difference > 0 ? "+" : ""}
                                {bestTrigger.difference} above average
                            </p>

                            <p>
                                Average Mood: {bestTrigger.average}/10
                            </p>

                            <p>
                                Entries:{" "}
                                {bestTrigger.entries}
                            </p>

                            <ConfidenceBadge
                                level={confidenceLabel(bestTrigger.entries)}
                            />
                        </>
                    ) : (
                        <p>No data</p>
                    )}
                </div>

                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold">
                        Lowest Mood Trigger
                    </h3>

                    {worstTrigger ? (
                        <>
                            <p className="font-semibold">
                                {worstTrigger.trigger}
                            </p>

                            <p>
                                {worstTrigger.difference}
                                {" "}below average
                            </p>

                            <p>
                                Average Mood: {worstTrigger.average}/10
                            </p>

                            <p>
                                Entries:{" "}
                                {worstTrigger.entries}
                            </p>

                            <ConfidenceBadge
                                level={confidenceLabel(worstTrigger.entries)}
                            />
                        </>
                    ) : (
                        <p>No data</p>
                    )}
                </div>
            </div>
        </Accordion>
    );
}