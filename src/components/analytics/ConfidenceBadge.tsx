type ConfidenceLevel = 
        | "Low"
        | "Moderate"
        | "High";

type Props = {
    level: ConfidenceLevel;
};

const confidenceStyles:
    Record<
        ConfidenceLevel,
        string
    > = {
        Low:
            "bg-red-100 text-red-700",
        Moderate:
            "bg-yellow-100 text-yellow-800",
        High:
            "bg-green-100 text-green-700",
    };

export default function ConfidenceBadge({
    level,
}: Props) {
    return (
        <span 
            className={`
                rounded-full
                px-2
                py-1
                text-xs
                font-medium
                ${confidenceStyles[level]}
            `}
        >
                {level} Confidence
        </span>
    );
}