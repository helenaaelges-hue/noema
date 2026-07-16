import ConfidenceBadge from "./ConfidenceBadge";

type Props = {
    title: string;
    description: string;
    confidence: "Low" | "Moderate" | "High";
    impact: number;
};

export default function InsightCard({
    title,
    description,
    confidence,
    impact,
}: Props) {
    let border = "border-gray-300";

    if (impact >= 1) {
        border = "border-green-500";
    } else if (impact <= -1) {
        border = "border-red-500";
    }

    return (
        <div
            className={`border-l-4 ${border} rounded p-4 bg-white shadow-sm`}
        >
            <div className="flex justify-between items-start">
                <h3 className="font-semibold">
                    {title}
                </h3>

                <ConfidenceBadge
                    level={confidence}
                />
            </div>

            <p className="mt-2 text-sm">
                {description}
            </p>
        </div>
    );
}