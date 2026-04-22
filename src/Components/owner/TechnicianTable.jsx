import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DefaultProfileImage from "../../assets/images/profile-image.jpeg";
import { fetchWithAuth } from "../utils/api";

export default function TechnicianTable({ searchTerm }) {
    const userId = sessionStorage.getItem("user_id");
    const navigate = useNavigate();
    const [technicians, setTechnicians] = useState([]);

    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                const response = await fetchWithAuth(
                    "http://localhost/instrument-care-back-end/public/user/dashboard/approved/all",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Failed to fetch technicians");

                const data = await response.json();
                console.log(data);
                setTechnicians(data);
            } catch (error) {
                console.error("Error fetching technicians:", error);
            }
        };

        fetchTechnicians();
    }, []);

    // Filter technicians
    const filteredTechnicians = technicians.filter((tech) => {
        const term = (searchTerm || "").toLowerCase();
        return (
            (tech.first_name || "").toLowerCase().includes(term) ||
            (tech.last_name || "").toLowerCase().includes(term) ||
            (tech.designation || "").toLowerCase().includes(term) ||
            (tech.bio || "").toLowerCase().includes(term) ||
            (tech.institute_name || "").toLowerCase().includes(term) ||
            (tech.instruments || "").toLowerCase().includes(term)
        );
    });

    const handleViewProfile = async (tech_user_id, tech_id) => {
        console.log("tech_id", tech_id);

        const payload = {
            client_id: userId,
            technician_id: tech_user_id,
            search_term: searchTerm || "",
        };

        console.log("Payload to send:", payload);

        try {
            const response = await fetch(`http://localhost/instrument-care-back-end/public/user/dashboard/search`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload)
            })

            const result = await response.json();
            console.log(result);
            navigate(`/user/view-profile/${tech_id}`);
        }
        catch (error) {
            console.error("Error navigating to profile:", error);
        }

    };


    return (
        <section className="bg-white py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 gap-3">
                    <h2 className="text-2xl font-bold text-gray-800">
                        All Technicians
                    </h2>
                    <div className="max-w-2xl text-sm text-gray-600 space-y-1">
                        <p>
                            Browse all registered technicians on the platform and easily find the right expert for your needs.
                        </p>
                        <p>
                            Use the search bar above to look up technicians by name or instrument, and explore their profiles for detailed information.
                        </p>
                        {/* <p>
                            You can view profiles and directly send service requests to the technician of your choice.
                        </p> */}
                    </div>

                </div>

                <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
                    <table className="w-full text-sm text-left border-collapse min-w-[900px]">

                        {/* Header */}
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wide">
                            <tr>
                                <th className="p-3 border">Profile</th>
                                <th className="p-3 border">Name</th>
                                <th className="p-3 border">Designation</th>
                                <th className="p-3 border">Institute</th>
                                <th className="p-3 border">Instruments</th>
                                {/* <th className="p-3 border">Bio</th> */}
                                <th className="p-3 border text-center">Actions</th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody>
                            {filteredTechnicians.length > 0 ? (
                                filteredTechnicians.map((tech, index) => {
                                    const imageUrl =
                                        tech.picture !== null
                                            ? `http://localhost/instrument-care-back-end/public/${tech.picture}`
                                            : DefaultProfileImage;

                                    return (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            {/* Profile Image */}
                                            <td className="p-3 border">
                                                <img
                                                    src={imageUrl}
                                                    alt="profile"
                                                    className="w-12 h-12 rounded-full object-cover border"
                                                />
                                            </td>

                                            {/* Name */}
                                            <td className="p-3 border font-medium text-gray-800 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    {tech.first_name + " " + tech.last_name || "No Name"}
                                                </div>
                                            </td>

                                            {/* Designation */}
                                            <td className="p-3 border text-gray-700 whitespace-nowrap">
                                                {tech.designation || "-"}
                                            </td>

                                            {/* Institute */}
                                            <td className="p-3 border text-gray-700 whitespace-nowrap">
                                                {tech.institute_name || "-"}
                                            </td>

                                            {/* Instruments */}
                                            <td className="p-3 border text-gray-700 max-w-[200px] ">
                                                {tech.instruments || "-"}
                                            </td>

                                            {/* Bio */}
                                            {/* <td className="p-3 border text-gray-600 max-w-[250px] ">
                                                {tech.bio || "-"}
                                            </td> */}

                                            {/* Actions */}
                                            <td className="p-3 border">
                                                <div className="flex gap-2 justify-center">

                                                    {/* <Link to={`/user/view-profile/${tech.id}`}>
                                                        <button className="bg-orange-400 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-orange-500 transition">
                                                            View
                                                        </button>
                                                    </Link> */}

                                                    <button className="bg-orange-400 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-orange-500 transition" onClick={() => handleViewProfile(tech.user_id, tech.id)}>
                                                        View
                                                    </button>

                                                    <Link to={`/user/service-request/${tech.id}`}>
                                                        <button className="bg-gray-800 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-gray-700 transition">
                                                            Request
                                                        </button>
                                                    </Link>

                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center p-6 text-gray-500">
                                        No technicians found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

            </div>
        </section>
    );

}
