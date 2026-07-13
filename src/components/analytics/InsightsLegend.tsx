export default function InsightsLegend() {
    return (
        <div className="mb-4 rounded-lg border bg-gray-50 p-4 text-sm">
            <p className="font-semibold mb-2">
                How To Read These Insights
            </p>

            <ul className="space-y-1">
                <li>
                    🟩 Positive = associated with a higher mood
                </li>

                <li>
                    ⬜ Neutral = close to your average
                </li>

                <li>
                    🟥 Negative = associated with a lower mood
                </li>

                <li>
                    ⭐ Confidence increases with more recorded events.
                </li>
            </ul>
        </div>
    );
}