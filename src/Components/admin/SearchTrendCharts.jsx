import { useEffect, useState } from "react";

export default function SearchTrendsChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(
            "http://localhost/instrument-care-back-end/public/admin/view-search-count-hourly",
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            }
        )
            .then((res) => res.json())
            .then((res) => setData(res))
            .catch((err) => console.error(err));
    }, []);

    const maxCount = Math.max(...data.map((d) => d.count), 1);

    return (
        <div className="bg-white p-5 rounded-lg shadow-md mt-5 font-poppins">
            <h3 className="text-lg font-bold mb-6">
                Search Trends (Hourly)
            </h3>

            <div className="flex items-end gap-3 h-64 overflow-x-auto">
                {data.map((item, index) => {
                    const heightPercent = (item.count / maxCount) * 100;

                    return (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-end min-w-[40px]"
                        >
                            {/* value on top */}
                            <span className="text-xs text-gray-600 mb-1">
                                {item.count}
                            </span>

                            {/* bar */}
                            <div className="w-6 bg-gray-200 rounded-md h-48 flex items-end">
                                <div
                                    className="w-full bg-orange-400 rounded-md transition-all duration-500"
                                    style={{ height: `${heightPercent}%` }}
                                    title={`${item.search_term}`}
                                ></div>
                            </div>

                            {/* label */}
                            <span className="text-[10px] text-gray-500 mt-1 rotate-[-45deg]">
                                {item.hour || item.search_term?.slice(0, 6)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}