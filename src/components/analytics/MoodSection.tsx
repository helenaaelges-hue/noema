import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

import Accordion from "../Accordion";

type MoodData = {
    day: string;
    mood: number;
    actual: number | null;
};

type DistributionData = {
    score: number;
    count: number;
};

type Props = {
    moodData: MoodData[];
    moodDistribution: DistributionData[];
};

export default function MoodSection({
    moodData,
    moodDistribution,
}: Props) {
    return (
        <Accordion title="Mood Analysis">
            <section>
                <h2 className="font-semibold text-slate-900">
                    Mood trend
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                    The darker line shows
                    the seven-entry moving
                    average. The lighter
                    line shows individual
                    mood scores.
                </p>

                <div className="mt-4 h-80 w-full min-w-0">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <LineChart
                            data={moodData}
                            margin={{
                                top: 8,
                                right: 8,
                                left: -20,
                                bottom: 8,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="day"
                                tick={{
                                    fontSize:
                                        12,
                                }}
                                minTickGap={24}
                            />

                            <YAxis
                                domain={[
                                    0,
                                    10,
                                ]}
                                tick={{
                                    fontSize:
                                        12,
                                }}
                            />

                            <Tooltip
                                formatter={(
                                    value,
                                    name
                                ) => {
                                    if (
                                        name ===
                                        "mood"
                                    ) {
                                        return [
                                            value,
                                            "Trend",
                                        ];
                                    }

                                    return [
                                        value,
                                        "Actual",
                                    ];
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="actual"
                                stroke="#94a3b8"
                                strokeWidth={1.5}
                                dot={false}
                                connectNulls
                            />

                            <Line
                                type="monotone"
                                dataKey="mood"
                                stroke="#4f46e5"
                                strokeWidth={3}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <section className="mt-8 border-t border-slate-100 pt-6">
                <h2 className="font-semibold text-slate-900">
                    Mood distribution
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                    Number of mood entries
                    recorded at each score.
                </p>

                <div className="mt-4 h-72 w-full min-w-0">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart
                            data={
                                moodDistribution
                            }
                            margin={{
                                top: 8,
                                right: 8,
                                left: -20,
                                bottom: 8,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="score"
                                tick={{
                                    fontSize:
                                        12,
                                }}
                            />

                            <YAxis
                                allowDecimals={
                                    false
                                }
                                tick={{
                                    fontSize:
                                        12,
                                }}
                            />

                            <Tooltip />

                            <Bar
                                dataKey="count"
                                fill="#4f46e5"
                                radius={[
                                    6,
                                    6,
                                    0,
                                    0,
                                ]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </Accordion>
    );
}