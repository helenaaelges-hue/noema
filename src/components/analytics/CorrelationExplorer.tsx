import Accordion from "../Accordion";

type Trigger = {
    id: number;
    name: string;
};

type Props = {
    triggers: Trigger[];
    selectedTrigger: number | null;
    onTriggerChange: (trigger: number | null) => void;
    filteredEvents: unknown[];
    selectionAverage: number | null;
    difference: number | null;
};

export default function CorrelationExplorer({
    triggers,
    selectedTrigger,
    onTriggerChange,
    filteredEvents,
    selectionAverage,
    difference,
}: Props) {
    return (
        <Accordion title="Trigger Explorer">

            <p className="text-sm text-gray-600">
                Compare your overall average mood with your average mood when a selected trigger occurred.
            </p>

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