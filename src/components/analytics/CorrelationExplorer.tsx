import Accordion from "../Accordion";

type Category = string;

type Trigger = {
    id: number;
    name: string;
};

type Props = {
    categories: Category[];
    triggers: Trigger[];
    selectedCategory: string;
    selectedTrigger: number | null;
    onCategoryChange: (category: string) => void;
    onTriggerChange: (trigger: number | null) => void;
    filteredEvents: unknown[];
    selectionAverage: number | null;
    difference: number | null;
};

export default function CorrelationExplorer({
    categories,
    triggers,
    selectedCategory,
    selectedTrigger,
    onCategoryChange,
    onTriggerChange,
    filteredEvents,
    selectionAverage,
    difference,
}: Props) {
    return (
        <Accordion title="Correlation Explorer">
            <select
                className="border p-2 w-full mb-4"
                value={selectedCategory}
                onChange={(e)=>
                    onCategoryChange(e.target.value)
                }
            >
                <option value="">
                    All Categories
                </option>

                {categories.map((category)=>(
                    <option
                        key={category}
                        value={category}
                    >
                        {category}
                    </option>
                ))}
            </select>

            <select
                className="border p-2 w-full mb-4"
                value={selectedTrigger ?? ""}
                onChange={(e)=>
                    onTriggerChange(
                        e.target.value
                            ? Number(e.target.value)
                            : null
                    )
                }
            >
                <option value="">
                    All Triggers
                </option>

                {triggers.map((trigger)=>(

                    <option
                        key={trigger.id}
                        value={trigger.id}
                    >
                        {trigger.name}
                    </option>
                ))}
            </select>

            <p className="mb-4">
                Matching Events:

                <strong>
                    {" "}
                    {filteredEvents.length}
                </strong>
            </p>

            <p>
                Average Mood:
                {" "}
                {selectionAverage ?? "-"}
            </p>

            <p>
                Difference from Overall Average Mood:{" "}
                {difference === null
                    ? "-"
                    : difference > 0
                        ? `+${difference}`
                        : difference}
            </p>
        </Accordion>
        
    );
}