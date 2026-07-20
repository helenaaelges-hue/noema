import Accordion from "../Accordion";

type Trigger = {
    id: number;
    name: string;
};

type Props = {
    triggers: Trigger[];
    selectedTrigger:
        number | null;
    onTriggerChange: (
        trigger: number | null
    ) => void;
    filteredEvents: unknown[];
    selectionAverage:
        number | null;
    difference:
        number | null;
};

export default function CorrelationExplorer({
    triggers,
    selectedTrigger,
    onTriggerChange,
    filteredEvents,
    selectionAverage,
    difference,
}: Props) {
    const hasSelection =
        selectedTrigger !== null;

    return (
        <Accordion title="Trigger Explorer">
            <p className="text-sm leading-6 text-slate-600">
                Compare your overall
                average mood with your
                average mood on entries
                where a selected trigger
                occurred.
            </p>

            <div className="mt-5">
                <label
                    htmlFor="trigger-explorer"
                    className="field-label"
                >
                    Trigger
                </label>

                <select
                    id="trigger-explorer"
                    className="field-input"
                    value={
                        selectedTrigger ??
                        ""
                    }
                    onChange={event =>
                        onTriggerChange(
                            event.target
                                .value
                                ? Number(
                                      event
                                          .target
                                          .value
                                  )
                                : null
                        )
                    }
                >
                    <option value="">
                        Select a trigger
                    </option>

                    {triggers.map(
                        trigger => (
                            <option
                                key={
                                    trigger.id
                                }
                                value={
                                    trigger.id
                                }
                            >
                                {
                                    trigger.name
                                }
                            </option>
                        )
                    )}
                </select>
            </div>

            {!hasSelection ? (
                <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                    Select a trigger to
                    compare its matching
                    mood entries with your
                    overall average.
                </div>
            ) : (
                <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Matching entries
                        </dt>

                        <dd className="mt-2 text-xl font-bold text-slate-900">
                            {
                                filteredEvents.length
                            }
                        </dd>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Average mood
                        </dt>

                        <dd className="mt-2 text-xl font-bold text-slate-900">
                            {selectionAverage ??
                                "-"}
                        </dd>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Difference
                        </dt>

                        <dd className="mt-2 text-xl font-bold text-slate-900">
                            {difference ===
                            null
                                ? "-"
                                : difference >
                                    0
                                  ? `+${difference}`
                                  : difference}
                        </dd>

                        <p className="mt-1 text-xs text-slate-500">
                            Compared with
                            overall mood
                        </p>
                    </div>
                </dl>
            )}
        </Accordion>
    );
}