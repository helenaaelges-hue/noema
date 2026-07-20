export default function InsightsLegend() {
    return (
        <div className="mb-5 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">
                How to read these insights
            </p>

            <ul className="mt-3 space-y-2">
                <li className="flex gap-2">
                    <span
                        aria-hidden="true"
                        className="text-emerald-600"
                    >
                        ●
                    </span>

                    <span>
                        <strong>
                            Positive:
                        </strong>{" "}
                        associated with a
                        higher mood.
                    </span>
                </li>

                <li className="flex gap-2">
                    <span
                        aria-hidden="true"
                        className="text-slate-400"
                    >
                        ●
                    </span>

                    <span>
                        <strong>
                            Neutral:
                        </strong>{" "}
                        close to your overall
                        average.
                    </span>
                </li>

                <li className="flex gap-2">
                    <span
                        aria-hidden="true"
                        className="text-red-500"
                    >
                        ●
                    </span>

                    <span>
                        <strong>
                            Negative:
                        </strong>{" "}
                        associated with a
                        lower mood.
                    </span>
                </li>

                <li className="flex gap-2">
                    <span
                        aria-hidden="true"
                        className="text-amber-600"
                    >
                        ★
                    </span>

                    <span>
                        Confidence increases
                        as more matching events
                        are recorded.
                    </span>
                </li>
            </ul>
        </div>
    );
}