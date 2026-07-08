type Props = {
    title: string;
    description: string;
    confidence: "Low" | "Medium" | "High";
    impact: number;
};

export default function InsightCard({
    title,
    description,
    confidence,
    impact,
}: Props) {
    const color =
        impact >= 1
            ? "border-green-500"
            : impact <= -1
            ? "border-red-500"
            : "border-gray-300";

    return (
        <div
            className={`border-l-4 ${color} rounded p-4 bg-white shadow-sm`}
        >
            <h3 className="font-semibold text-lg">
                {title}
            </h3>

            <p className="mt-1">
                {description}
            </p>

            <p className="text-sm text-gray-500 mt-3">
                Confidence: {confidence}
            </p>
        </div>
    );
}