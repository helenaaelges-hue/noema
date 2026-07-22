"use client";

import {useEffect, useState} from "react";
import type {SubmitEventHandler} from "react";
import {ErrorState, LoadingState} from "@/src/components/ui/PageState";
import {sortByName} from "@/src/lib/names";

type CategoryOption = {
    id: number;
    name: string;
};

type TriggerOption = {
    id: number;
    name: string;
};

function getLocalDateTime(): string {
    const now = new Date();

    return new Date(
        now.getTime() -
        now.getTimezoneOffset() *
        60_000
    )
        .toISOString()
        .slice(0, 16);
}

async function readResponse(
    response: Response
): Promise<unknown> {
    const text =
        await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        throw new Error(
            "The server returned an invalid response."
        );
    }
}

function getErrorMessage(
    data: unknown,
    fallback: string
): string {
    if (
        data !== null &&
        typeof data === "object" &&
        "error" in data &&
        typeof data.error === "string"
    ) {
        return data.error;
    }

    return fallback;
}

function isNamedOption(
    data: unknown
): data is {
    id: number;
    name: string;
} {
    return (
        data !== null &&
        typeof data === "object" &&
        "id" in data &&
        typeof data.id === "number" &&
        "name" in data &&
        typeof data.name === "string"
    );
}


export default function EventsPage() {
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [value, setValue] = useState("");
    const [moodScore, setMoodScore] = useState("");
    const [triggers, setTriggers] = useState<TriggerOption[]>([]);
    const [selectedTriggers, setSelectedTriggers] = useState<number[]>([]);
    const [newTrigger, setNewTrigger] = useState("");
    const [showTriggerForm, setShowTriggerForm] = useState(false);
    const [showTriggerManager, setShowTriggerManager] = useState(false);
    const [notes, setNotes] = useState("");
    const [eventDate, setEventDate] = useState(getLocalDateTime);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [actionError, setActionError] = useState("");
    const [saving, setSaving] = useState(false);

    function showActionError(
        message: string
    ) {
        setActionError(message);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    useEffect(() => {
        async function loadOptions() {
            setLoadingOptions(true);
            setLoadError("");

            try {
                const [
                    categoryResponse,
                    triggerResponse,
                ] = await Promise.all([
                    fetch("/api/categories"),
                    fetch("/api/triggers"),
                ]);

                const [
                    categoryData,
                    triggerData
                ] = await Promise.all([
                    readResponse(
                        categoryResponse
                    ),
                    readResponse(
                        triggerResponse
                    ),
                ]);

                if (!categoryResponse.ok) {
                    getErrorMessage(
                        categoryData,
                        "Failed to load categories."
                    );
                }

                if (!triggerResponse.ok) {
                    getErrorMessage(
                        triggerData,
                        "Failed to load triggers."
                    );
                }

                if (
                    !Array.isArray(
                        categoryData
                    ) ||
                    !Array.isArray(
                        triggerData
                    )
                ) {
                    throw new Error(
                        "The server returned invalid category or trigger data."
                    );
                }

                setCategories(
                    sortByName(categoryData as CategoryOption[])
                );

                setTriggers(
                    sortByName(triggerData as TriggerOption[])
                );
            } catch (optionError) {
                setLoadError(
                    optionError instanceof Error
                        ? optionError.message
                        : "Failed to load form options."
                );
            } finally {
                setLoadingOptions(false);
            }
        }

        loadOptions();
    }, []);
    
    async function addCategory() {
        const name =
            newCategory.trim();

        if (!name) {
            showActionError(
                "Enter a category name."
            );
            return;
        }

        setActionError("");

        try {

            const response =
                await fetch(
                    "/api/categories",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            name,
                        }),
                    }
                );

            const data =
                await readResponse(
                    response
                );

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        "Failed to create category."
                    )
                );
            }

            if (!isNamedOption(data)) {
                throw new Error(
                    "The category API returned an invalid response."
                );
            }

            const createdCategory:
                CategoryOption = {
                    id: data.id,
                    name: data.name,
                };

            setCategories(current =>
                sortByName([
                    ...current,
                    createdCategory,
                ])
            );

            setCategory(
                createdCategory.name
            );

            setNewCategory("");
            setShowCategoryForm(false);
        } catch (categoryError) {
            showActionError(
                categoryError
                    instanceof Error
                    ? categoryError.message
                    : "Failed to create category."
            );
        }
    }

    async function deleteCategory(
        categoryToDelete: CategoryOption
    ) {
        const confirmed =
            window.confirm(
                `Delete category "${categoryToDelete.name}"?`
            );

        if (!confirmed) {
            return;
        }

        setActionError("");

        try {
            const response =
                await fetch(
                    `/api/categories/${categoryToDelete.id}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await readResponse(
                    response
                );

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        "Failed to delete category."
                    )
                );
            }

            setCategories(current =>
                current.filter(
                    item =>
                        item.id !==
                        categoryToDelete.id
                )
            );

            if (
                category ===
                categoryToDelete.name
            ) {
                setCategory("");
            }
        } catch (categoryError) {
            showActionError(
                categoryError instanceof Error
                    ? categoryError.message
                    : "Failed to delete category."
            );
        }
    }

    async function addTrigger() {
        const name =
            newTrigger.trim();

        if (!name) {
            showActionError(
                "Enter a trigger name."
            );
            return;
        }

        setActionError("");

        try {

            const response =
                await fetch(
                    "/api/triggers",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            name,
                        }),
                    }
                );

            const data =
                await readResponse(
                    response
                );

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        "Failed to create trigger."
                    )
                );
            }

            if (!isNamedOption(data)) {
                throw new Error(
                    "The trigger API returned an invalid response."
                );
            }

            const createdTrigger:
                TriggerOption = {
                    id: data.id,
                    name: data.name,
                };

            setTriggers(current =>
                sortByName([
                    ...current,
                    createdTrigger,
                ])
            );

            setSelectedTriggers(current =>
                Array.from(
                    new Set([
                        ...current,
                        createdTrigger.id,
                    ])
                )
            );

            setNewTrigger("");
            setShowTriggerForm(false);
        } catch (triggerError) {
            showActionError(
                triggerError
                    instanceof Error
                    ? triggerError.message
                    : "Failed to create trigger."
            );
        }
    }

    async function deleteTrigger(
        triggerToDelete: TriggerOption
    ) {
        const confirmed =
            window.confirm(
                `Delete trigger "${triggerToDelete.name}"?`
            );

        if (!confirmed) {
            return;
        }

        setActionError("");

        try {
            const response =
                await fetch(
                    `/api/triggers/${triggerToDelete.id}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await readResponse(
                    response
                );

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        "Failed to delete trigger."
                    )
                );
            }

            setTriggers(current =>
                current.filter(
                    item =>
                        item.id !==
                        triggerToDelete.id
                )
            );

            setSelectedTriggers(current =>
                current.filter(
                    id =>
                        id !==
                        triggerToDelete.id
                )
            );
        } catch (triggerError) {
            showActionError(
                triggerError instanceof Error
                    ? triggerError.message
                    : "Failed to delete trigger."
            );
        }
    }

    function toggleTrigger(
        triggerId: number,
        checked: boolean
    ) {
        setSelectedTriggers(
            current =>
                checked
                    ? Array.from(
                        new Set([
                            ...current,
                            triggerId,
                        ])
                    )
                    : current.filter(
                        id =>
                            id !==
                            triggerId
                    )
        );
    }

    const saveEvent:
        SubmitEventHandler<HTMLFormElement> =
        async event => {
            event.preventDefault();

            setActionError("");

            if (
                !category ||
                !value.trim()
            ) {
                showActionError(
                    "Please select a category and enter a value."
                );
                return;
            }

            if (
                category === "Mood" &&
                !moodScore
            ) {
                showActionError(
                    "Please enter a mood score."
                );
                return;
            }

            if (!eventDate) {
                showActionError(
                    "Please select an event date."
                );
                return;
            }

            setSaving(true);

            try {
                const response =
                    await fetch(
                        "/api/events",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body:
                                JSON.stringify({
                                    eventDate,
                                    category,
                                    value:
                                        value.trim(),
                                    moodScore:
                                        category === "Mood"
                                            ? moodScore
                                            : null,
                                    triggerIds:
                                        selectedTriggers,
                                    notes:
                                        notes.trim(),
                                }),
                        }
                    );

                const data =
                    await readResponse(
                        response
                    );

                if (!response.ok) {
                    getErrorMessage(
                        data,
                        "Failed to save event."
                    );
                }

                alert("Event saved!");

                setCategory("");
                setValue("");
                setMoodScore("");
                setSelectedTriggers([]);
                setNotes("");
                setEventDate(
                    getLocalDateTime()
                );
            } catch (saveError) {
                showActionError(
                    saveError
                        instanceof Error
                        ? saveError.message
                        : "Failed to save event."
                );
            } finally {
                setSaving(false);
            }
        };  

    return (
        <main className="page-shell-narrow">
            <div className="mb-8">
                <h1 className="page-heading">Event Entry</h1>

                <p className="page-description">
                    Add events such as Mood, Sleep, or Exercise.
                </p>
            </div>

            {loadingOptions ? (
                <LoadingState
                    message="Loading categories and triggers..."
                />
            ) : loadError ? (
                <ErrorState
                    message={loadError}
                />
            ) : (
                <form
                    onSubmit={
                        saveEvent
                    }
                    className="surface-card flex flex-col gap-5"
                >
                    {actionError && (
                        <p
                            role="alert"
                            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                        >
                            {actionError}
                        </p>
                    )}

                    <div>
                        <label
                            htmlFor="eventDate"
                            className="field-label"
                        >
                            Date & Time
                        </label>

                        <input
                            id="eventDate"
                            type="datetime-local"
                            className="field-input"
                            value={eventDate}
                            required
                            onChange={
                                event =>
                                    setEventDate(
                                        event.target
                                            .value
                                    )
                            }
                        />
                    </div>
                
                    <div>
                        <label
                            htmlFor="category"
                            className="field-label"
                        >
                            Category
                        </label>

                        <select
                            id="category"
                            className="field-input"
                            value={category}
                            required
                            onChange={event => {
                                const nextCategory =
                                    event.target.value;

                                setCategory(
                                    nextCategory
                                );

                                if (
                                    nextCategory !==
                                    "Mood"
                                ) {
                                    setMoodScore("");
                                }
                            }}
                        >
                            <option value="">
                                Select Category
                            </option>

                            {categories.map(
                                categoryOption => (
                                    <option
                                        key={categoryOption.id}
                                        value={categoryOption.name}
                                    >
                                        {categoryOption.name}
                                    </option>
                                )
                            )}
                        </select>

                        <button
                            type="button"
                            className="text-link mt-2 mr-4 text-sm"
                            onClick={() =>
                                setShowCategoryForm(
                                    current =>
                                        !current
                                )
                            }
                        >
                            + New Category
                        </button>

                        <button
                            type="button"
                            className="text-link mt-2 text-sm"
                            onClick={() =>
                                setShowCategoryManager(
                                    current => !current
                                )
                            }
                        >
                            Manage Categories
                        </button>

                        {showCategoryForm && (
                            <div className="mt-3">
                                <input
                                    type="text"
                                    className="field-input"
                                    placeholder="Category name"
                                    value={newCategory}
                                    onChange={
                                        event =>
                                            setNewCategory(
                                                event
                                                    .target
                                                    .value
                                            )
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={
                                        addCategory
                                    }
                                    className="button-secondary mt-2"
                                >
                                    Save Category
                                </button>
                            </div>
                        )}

                        {showCategoryManager && (
                            <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                {categories.map(
                                    categoryItem => (
                                        <div
                                            key={
                                                categoryItem.id
                                            }
                                            className="flex items-center justify-between gap-4 rounded-lg bg-white px-3 py-2"
                                        >
                                            <span>
                                                {
                                                    categoryItem.name
                                                }
                                            </span>

                                            <button
                                                type="button"
                                                className="button-danger"
                                                onClick={() =>
                                                    deleteCategory(
                                                        categoryItem
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="value"
                            className="field-label"
                        >
                            Value
                        </label>

                        <input
                            id="value"
                            type="text"
                            className="field-input"
                            placeholder="e.g. Happy, 8 hours, Gym"
                            value={value}
                            required
                            onChange={
                                event =>
                                    setValue(
                                        event.target
                                            .value
                                    )
                            }
                        />
                    </div>

                    {category === "Mood" && (
                        <div>
                            <label
                                htmlFor="moodScore"
                                className="field-label"
                            >
                                Mood Score (1-10)
                            </label>
                            
                            <input
                                id="moodScore"
                                type="number"
                                min={1}
                                max={10}
                                step={1}
                                className="field-input"
                                value={moodScore}
                                required
                                onChange={
                                    event =>
                                        setMoodScore(event.target.value)
                                }
                            />
                        </div>
                    )}

                    <fieldset>
                        <legend className="field-label">
                            Triggers
                        </legend>

                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            {triggers.map(
                                trigger => (
                                    <label
                                        key={trigger.id}
                                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                                    >
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={
                                                selectedTriggers.includes(
                                                    trigger.id
                                                )
                                            }
                                            onChange={event =>
                                                toggleTrigger(
                                                    trigger.id,
                                                    event.target.checked
                                                )
                                            }
                                        />

                                        <span>
                                            {trigger.name}
                                        </span>
                                    </label>
                                )
                            )}
                        </div>

                        <button
                            type="button"
                            className="text-link mt-2 mr-4 text-sm"
                            onClick={() =>
                                setShowTriggerForm(
                                    current =>
                                        !current
                                )
                            }
                        >
                            + New Trigger
                        </button>

                        <button
                            type="button"
                            className="text-link mt-2 text-sm"
                            onClick={() =>
                                setShowTriggerManager(
                                    current =>
                                        !current
                                )
                            }
                        >
                            Manage Triggers
                        </button>

                        {showTriggerForm && (
                            <div className="mt-3">

                                <input
                                    type="text"
                                    className="field-input"
                                    placeholder="Trigger name"
                                    value={newTrigger}
                                    onChange={
                                        event =>
                                            setNewTrigger(event.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    className="button-secondary mt-2"
                                    onClick={addTrigger}
                                >
                                    Save Trigger
                                </button>
                            </div>
                        )}

                        {showTriggerManager && (
                            <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                {triggers.map(
                                    triggerItem => (
                                        <div
                                            key={
                                                triggerItem.id
                                            }
                                            className="flex items-center justify-between gap-4 rounded-lg bg-white px-3 py-2"
                                        >
                                            <span>
                                                {triggerItem.name}
                                            </span>

                                            <button
                                                type="button"
                                                className="button-danger"
                                                onClick={() =>
                                                    deleteTrigger(
                                                        triggerItem
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </fieldset>

                    <div>
                        <label
                            htmlFor="notes"
                            className="field-label"
                        >
                            Notes
                        </label>

                        <textarea
                            id="notes"
                            className="field-input"
                            rows={4}
                            placeholder="Additional details..."
                            value={notes}
                            onChange={
                                event =>
                                    setNotes(event.target.value)
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={
                            saving
                        }
                        className="button-primary w-full sm:w-auto"
                    >
                        {saving
                            ? "Saving..."
                            : "Save Event"}
                    </button>
                </form>
            )}
        </main>
    );
}