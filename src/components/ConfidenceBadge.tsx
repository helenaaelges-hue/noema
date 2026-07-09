type Props = {
    level: string;
};

export default function ConfidenceBadge({
    level,
}: Props) {
    let classes =
        "px-2 py-1 rounded text-sm";

    if (level === "High") {
        classes +=
            " bg-green-100 text-green-700";
    } else if (
        level === "Moderate"
    ) {
        classes +=
            " bg-yellow-100 text-yellow-700";
    } else {
        classes +=
            " bg-red-100 text-red-700";
    }

    return (
        <span className={classes}>
            Confidence: {level.charAt(0).toUpperCase() + level.slice(1)}
        </span>
    );
}