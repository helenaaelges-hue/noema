export function normalizeName(
    value: string
): string {
    return value
        .trim()
        .replace(/\s+/g, " ")
        .toLocaleLowerCase();
}

export function cleanDisplayName(
    value: string
): string {
    return value
        .trim()
        .replace(/\s+/g, " ");
}

export function sortByName<
    T extends {
        name: string;
    }
>(
    values: T[]
): T[] {
    return [...values].sort(
        (first, second) =>
            first.name.localeCompare(
                second.name,
                undefined,
                {
                    sensitivity: "base",
                }
            )
    );
}