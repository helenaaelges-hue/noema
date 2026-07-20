import Accordion from "../Accordion";

type Props = {
    categoryCounts: Record<
        string,
        number
    >;
};

export default function CategoryAnalysisSection({
    categoryCounts,
}: Props) {
    const categories =
        Object.entries(
            categoryCounts
        ).sort(
            (
                first,
                second
            ) =>
                second[1] -
                first[1]
        );

    return (
        <Accordion title="Category Analysis">
            {categories.length === 0 ? (
                <p className="text-sm text-slate-600">
                    No category data is
                    available for this
                    period.
                </p>
            ) : (
                <dl className="divide-y divide-slate-100">
                    {categories.map(
                        ([
                            category,
                            count,
                        ]) => (
                            <div
                                key={
                                    category
                                }
                                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                            >
                                <dt className="font-medium text-slate-700">
                                    {
                                        category
                                    }
                                </dt>

                                <dd className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                                    {
                                        count
                                    }
                                </dd>
                            </div>
                        )
                    )}
                </dl>
            )}
        </Accordion>
    );
}