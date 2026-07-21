import ConfidenceBadge from "./ConfidenceBadge";

type Props = {
    title: string;
    description: string;
    confidence:
        | "Low"
        | "Moderate"
        | "High";
    impact: number;
};

export default function InsightCard({
    title,
    description,
    confidence,
    impact,
}: Props) {
    let borderClass =
        "border-l-slate-300";

    let backgroundClass =
        "bg-white";

    if (impact >= 0.25) {
        borderClass =
            "border-l-emerald-500";
        backgroundClass =
            "bg-emerald-50/30";
    } else if (impact <= -0.25) {
        borderClass =
            "border-l-red-500";
        backgroundClass =
            "bg-red-50/30";
    }

    return (
        <article
            className={`flex h-full flex-col rounded-xl border border-slate-200 border-l-4 ${borderClass} ${backgroundClass} p-4 shadow-sm`}
        >
                <h3 className="font-semibold text-slate-900">
                    {title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                    {description}
                </p>

                <div className="mt-4">
                    <ConfidenceBadge
                        level={confidence}
                    />
                </div>
        </article>
    );
}