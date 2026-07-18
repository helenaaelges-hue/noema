import {Insight} from "@/src/lib/generateInsights";
import Accordion from "../Accordion";
import InsightCard from "./InsightCard";

type Props = {
    insights: Insight[];
};

export default function InsightsSection({
    insights,
}: Props) {
    if (insights.length === 0) {
        return (
            <Accordion title="💡 Did You Know?">
                <p className="text-gray-600">
                    Not enough mood data is available to generate reliable insights yet.
                </p>
            </Accordion>
        );
    }
    return (
        <Accordion
            title="💡 Did You Know?"
            defaultOpen
        >
            <div className="space-y-4">
                {insights.length === 0 ? (
                    <p>
                        Not enough data yet.
                    </p>
                ) : (
                    insights.map((insight) => (
                        <InsightCard
                            key={insight.title}
                            title={insight.title}
                            description={insight.description}
                            confidence={insight.confidence}
                            impact={insight.impact}
                        />
                    ))
                )}
            </div>
        </Accordion>
    );
}