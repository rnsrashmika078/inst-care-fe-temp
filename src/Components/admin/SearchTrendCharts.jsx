import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

export default function SearchTrendsChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("http://localhost/instrument-care-back-end/public/admin/view-search-term", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(res => setData(res))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mt-5  ">
            <h3 className="text-lg font-bold mb-4">Search Trends (Hourly)</h3>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#f97316" // your orange theme
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}