export function movingAverage(
    values: number[],
    windowSize = 7
) {
    return values.map((_, index) => {

        const start =
            Math.max(
                0,
                index - windowSize + 1
            );

        const slice =
            values.slice(
                start,
                index + 1
            );

        const average =
            slice.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) / slice.length;

        return Number(
            average.toFixed(1)
        );
    });
}