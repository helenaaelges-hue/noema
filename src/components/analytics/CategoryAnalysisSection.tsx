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

    return (
        <Accordion
            title="Category Analysis"
        >
            <div className="border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Category Statistics
                </h2>

                {Object.entries(categoryCounts).map(
                    ([category, count]) => (
                        <div
                            key={category}
                            className="flex justify-between mb-2"
                        >
                            <span>{category}</span>
                            <span>{count}</span>
                        </div>
                    )
                )}
            </div>
        </Accordion>
    );
}