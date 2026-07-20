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
        "border-slate-300";

    if (impact >= 1) {
        borderClass =
            "border-emerald-500";
    } else if (impact <= -1) {
        borderClass =
            "border-red-500";
    }

    return (
        <article
            className={`rounded-xl border border-slate-200 border-l-4 ${borderClass} bg-white p-4 shadow-sm`}
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="font-semibold text-slate-900">
                    {title}
                </h3>

                <ConfidenceBadge
                    level={confidence}
                />
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
                {description}
            </p>
        </article>
    );
}