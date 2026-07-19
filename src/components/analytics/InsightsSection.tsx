import {Insight} from "@/src/lib/generateInsights";
import Accordion from "../Accordion";
import InsightCard from "./InsightCard";
import InsightsLegend from "./InsightsLegend";

type Props = {
    insights: Insight[];
};

export default function InsightsSection({
    insights,
}: Props) {
    return (
        <Accordion
            title="💡 Did You Know?">
                <InsightsLegend />

                {insights.length === 0 ? (
                    <p className="mt-4 text-gray-600">
                        Not enough mood data is available to generate reliable insights yet.
                    </p>
                ) : (
                    <div className="mt-4 space-y-4">
                        {insights.map(
                            insight => (
                                <InsightCard
                                    key={insight.title}
                                    title={insight.title}
                                    description={insight.description}
                                    confidence={insight.confidence}
                                    impact={insight.impact}
                                />
                            )
                        )}
                    </div>
                )}
        </Accordion>
    );
}