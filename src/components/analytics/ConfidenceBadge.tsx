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
            "bg-amber-100 text-amber-800",
        High:
            "bg-emerald-100 text-emerald-700",
    };

export default function ConfidenceBadge({
    level,
}: Props) {
    return (
        <span 
            className={`
                inline-flex items-center
                whitespace-nowrap
                rounded-full
                px-2.5
                py-1
                text-xs
                font-semibold
                ${confidenceStyles[level]}
            `}
        >
                {level} Confidence
        </span>
    );
}