import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
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
        <Accordion
            title="Mood Analysis"
        >
            <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Mood Trend
                </h2>

                <LineChart
                    width={700}
                    height={350}
                    data={moodData}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip
                        formatter={(
                            value,
                            name
                        ) => {
                            if (
                                name === "mood"
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
                        dataKey="actual"
                        stroke="#bdbdbd"
                        strokeWidth={1}
                        dot={false}
                    />

                    <Line
                        dataKey="mood"
                        strokeWidth={3}
                        dot={false}
                    />
                </LineChart>
            </div>

            <div className="border rounded-lg p-6 mt-8">
                <h2 className="text-xl font-semibold mb-4">
                    Mood Distribution
                </h2>

                <BarChart
                    width={700}
                    height={300}
                    data={moodDistribution}
                >

                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="score" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" />
                </BarChart>
            </div>
        </Accordion>
    );
}