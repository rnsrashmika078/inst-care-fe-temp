import { useEffect, useState } from "react";
import Select from "react-select";

export default function TechnicalExpertise() {

    const userId = sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("token");
    const [tech_id, setTechId] = useState(null);

    const [labCategories, setLabCategories] = useState([]);
    const [instrumentCategories, setInstrumentCategories] = useState([]);
    const [instruments, setInstruments] = useState([]);
    const [newInstruments, setNewInstruments] = useState([]);

    const [loading, setLoading] = useState(false);

    const [showDropdowns, setShowDropdowns] = useState(false);
    const [options, setOptions] = useState([]);

    const [showDropdownInstCat, setShowDropdownInstCat] = useState(false);
    const [instrCatOptions, setInstrCatOptions] = useState([]);

    const [showDropdownInstruments, setShowDropdownInstruments] = useState(false);
    const [instrumentOptions, setInstrumentOptions] = useState([]);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedInstrumentCategories, setSelectedInstrumentCategories] = useState([]);
    const [selectedInstruments, setSelectedInstruments] = useState([]);
    const [selectedNewInstruments, setSelectedNewInstruments] = useState([]);
    const [manualInstrumentName, setManualInstrumentName] = useState('');

    const [recentInstruments, setRecentInstruments] = useState([]);


    /* FETCH DATA */
    useEffect(() => {
        fetchTechnicianID();
        fetchRecentInstruments();
    }, []);

    useEffect(() => {
        if (tech_id) {
            fetchLaboratoryCategories();
            fetchInstrumentCategories();
            fetchInstruments();
            fetchNewInstruments();
        }
    }, [tech_id]);

    const fetchTechnicianID = async () => {
        const res = await fetch(`http://localhost/instrument-care-back-end/public/tech/profile/${userId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await res.json();
        setTechId(data.id || null);
    };

    const fetchRecentInstruments = async () => {
        const res = await fetch(`http://localhost/instrument-care-back-end/public/tech/recent-instruments`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await res.json();
        setRecentInstruments(data.data || []);
    };


    const fetchLaboratoryCategories = async () => {
        const res = await fetch(`http://localhost/instrument-care-back-end/public/service-request/${tech_id}/laboratory-categories`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await res.json();
        setLabCategories(data.laboratoryCategories || []);
    };

    const fetchInstrumentCategories = async () => {
        const res = await fetch(`http://localhost/instrument-care-back-end/public/service-request/${tech_id}/instrument-categories`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await res.json();
        setInstrumentCategories(data.instrumentsCategories || []);
    };

    const fetchInstruments = async () => {
        const res = await fetch(`http://localhost/instrument-care-back-end/public/service-request/${tech_id}/instruments`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await res.json();
        setInstruments(data.instruments || []);
    };

    const fetchNewInstruments = async () => {
        const res = await fetch(`http://localhost/instrument-care-back-end/public/service-request/${tech_id}/new-instruments`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await res.json();
        setNewInstruments(data.newInstruments || []);
    };

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost/instrument-care-back-end/public/tech/laboratory-categories",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();

            const formattedOptions = (data.data || []).map((item) => ({
                value: item.id,
                label: item.name
            }));

            setOptions(formattedOptions);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchInstrumentCategoryData = async () => {
        try {
            const response = await fetch("http://localhost/instrument-care-back-end/public/tech/instrument-categories",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();

            const formattedOptions = (data.data || []).map((item) => ({
                value: item.id,
                label: item.name
            }));

            setInstrCatOptions(formattedOptions);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchInstrumentData = async () => {
        try {
            const response = await fetch("http://localhost/instrument-care-back-end/public/tech/instruments",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();

            const formattedOptions = (data.data || []).map((item) => ({
                value: item.instrument_id,
                label: item.instrument_name
            }));

            setInstrumentOptions(formattedOptions);
        } catch (error) {
            console.error(error);
        }

    };

    // Add new dropdown
    const addDropdown = async () => {
        await fetchData(); // fetch options if needed
        setShowDropdowns(prev => Array.isArray(prev) ? [...prev, true] : [true]);
        setSelectedCategories(prev => Array.isArray(prev) ? [...prev, null] : [null]);

    };

    const addDropdownInstCat = async () => {
        await fetchInstrumentCategoryData(); // fetch instrument category options if needed
        setShowDropdownInstCat(prev => Array.isArray(prev) ? [...prev, true] : [true]);
        setSelectedInstrumentCategories(prev => Array.isArray(prev) ? [...prev, null] : [null]);
    };

    const addDropdownInstrument = async () => {
        await fetchInstrumentData(); // fetch instrument options if needed
        setShowDropdownInstruments(prev => Array.isArray(prev) ? [...prev, true] : [true]);
        setSelectedInstruments(prev => Array.isArray(prev) ? [...prev, null] : [null]);
    };

    const addRow = () => {
        setSelectedNewInstruments([...newInstruments, newInstruments]);
    };

    // Handle selection for each dropdown
    const handleChange = (selected, index) => {
        const updated = [...selectedCategories];
        updated[index] = selected; // save selected option at correct index
        setSelectedCategories(updated);
    };

    const handleInstrumentCategoryChange = (selected, index) => {
        const updated = [...selectedInstrumentCategories];
        updated[index] = selected; // save selected option at correct index
        setSelectedInstrumentCategories(updated);
    };

    const handleInstrumentChange = (selected, index) => {
        const updated = [...selectedInstruments];
        updated[index] = selected; // save selected option at correct index
        setSelectedInstruments(updated);
    };

    const addManualInstrument = () => {
        if (manualInstrumentName.trim()) {
            setSelectedNewInstruments([...selectedNewInstruments, manualInstrumentName.trim()]);
            setManualInstrumentName('');
        }
    };

    const removeManualInstrument = (index) => {
        setSelectedNewInstruments(selectedNewInstruments.filter((_, i) => i !== index));
    };

    // Remove dropdown functions
    const removeDropdown = (index) => {
        setShowDropdowns(prev => prev.filter((_, i) => i !== index));
        setSelectedCategories(prev => prev.filter((_, i) => i !== index));
    };

    const removeDropdownInstCat = (index) => {
        setShowDropdownInstCat(prev => prev.filter((_, i) => i !== index));
        setSelectedInstrumentCategories(prev => prev.filter((_, i) => i !== index));
    };

    const removeDropdownInstrument = (index) => {
        setShowDropdownInstruments(prev => prev.filter((_, i) => i !== index));
        setSelectedInstruments(prev => prev.filter((_, i) => i !== index));
    };

    const updateTechnicalExpertise = async () => {
        try {
            setLoading(true);
            console.log(tech_id);
            const payload = {
                tech_id,
                laboratory_categories: selectedCategories.map(c => c?.value),
                instrument_categories: selectedInstrumentCategories.map(c => c?.value),
                instruments: selectedInstruments.map(c => c?.value),
                new_instruments: selectedNewInstruments
            };

            const res = await fetch(
                `http://localhost/instrument-care-back-end/public/tech/profile/expertise/${tech_id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                    Authorization: `Bearer ${token}`,
                }
            );

            const result = await res.json();
            if (res.ok) {
                alert("Technical expertise updated successfully");
            } else {
                console.error("Update error", result);
                alert("Failed to update expertise");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating expertise");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#ffffff80] shadow rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200 border-dashed">Technical Expertise</h2>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: Form Fields */}
                <div className="flex-1 space-y-8">
                    {/* LABORATORY CATEGORIES */}
                    <div>
                        <h3 className="font-medium text-gray-700 mb-3">Laboratory Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            {labCategories.map((lab, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-orange-200"
                                >
                                    {lab.name}
                                </span>
                            ))}
                        </div>

                        {Array.isArray(showDropdowns) && showDropdowns.map((show, i) => (
                            <div key={i} className="mt-3 w-72">
                                <Select
                                    options={options}
                                    value={selectedCategories[i] || null}
                                    onChange={(selected) => handleChange(selected, i)}
                                    isSearchable
                                />
                                <button
                                    type="button"
                                    onClick={() => removeDropdown(i)}
                                    className="text-red-500 hover:text-red-600 text-sm mt-1.5 flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    Remove
                                </button>
                            </div>

                        ))}

                        <button onClick={addDropdown} className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-3 flex items-center gap-1 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Add Laboratory Category
                        </button>
                    </div>

                    {/* INSTRUMENT CATEGORIES */}
                    <div>
                        <h3 className="font-medium text-gray-700 mb-3">Instrument Categories </h3>
                        <div className="flex flex-wrap gap-2">
                            {instrumentCategories.map((instrumentCat, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-orange-200"
                                >
                                    {instrumentCat.name}
                                </span>
                            ))}
                        </div>

                        {Array.isArray(showDropdownInstCat) && showDropdownInstCat.map((show, i) => (
                            <div key={i} className="mt-3 w-72">
                                <Select
                                    options={instrCatOptions}
                                    value={selectedInstrumentCategories[i] || null}
                                    onChange={(selected) => handleInstrumentCategoryChange(selected, i)}
                                    isSearchable
                                />
                                <button
                                    type="button"
                                    onClick={() => removeDropdownInstCat(i)}
                                    className="text-red-500 hover:text-red-600 text-sm mt-1.5 flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    Remove
                                </button>
                            </div>
                        ))}

                        <button onClick={addDropdownInstCat} className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-3 flex items-center gap-1 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Add Instrument Category
                        </button>
                    </div>

                    {/* INSTRUMENTS */}
                    <div>
                        <h3 className="font-medium text-gray-700 mb-3">Instruments</h3>
                        <div className="flex flex-wrap gap-2">
                            {instruments.map((instrument, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-orange-200"
                                >
                                    {instrument.instrument_name}
                                </span>
                            ))}
                        </div>

                        {Array.isArray(showDropdownInstruments) && showDropdownInstruments.map((show, i) => (
                            <div key={i} className="mt-3 w-72">
                                <Select
                                    options={instrumentOptions}
                                    value={selectedInstruments[i] || null}
                                    onChange={(selected) => handleInstrumentChange(selected, i)}
                                    isSearchable
                                />
                                <button
                                    type="button"
                                    onClick={() => removeDropdownInstrument(i)}
                                    className="text-red-500 hover:text-red-600 text-sm mt-1.5 flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    Remove
                                </button>
                            </div>
                        ))}

                        <button onClick={addDropdownInstrument} className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-3 flex items-center gap-1 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Add Instrument
                        </button>
                    </div>

                    {/* NEW INSTRUMENTS */}
                    <div>
                        <h3 className="font-medium text-gray-700 mb-3">Manual / Unlisted Instruments</h3>
                        <div className="flex flex-wrap gap-2">
                            {newInstruments.map((instrument, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 border border-orange-200"
                                >
                                    {instrument.instrument_name}
                                </span>
                            ))}
                        </div>

                        {/* Manually added instruments */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedNewInstruments.map((instrument, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1.5 text-sm rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-2"
                                >
                                    {instrument}
                                    <button
                                        type="button"
                                        onClick={() => removeManualInstrument(i)}
                                        className="text-blue-400 hover:text-blue-600 focus:outline-none bg-blue-100 rounded-full p-0.5"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </span>
                            ))}
                        </div>

                        {/* Input to add new instrument */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={manualInstrumentName}
                                onChange={(e) => setManualInstrumentName(e.target.value)}
                                placeholder="E.g., Custom Centrifuge Model X"
                                className="px-4 py-2 border border-gray-300 rounded-lg flex-1 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={addManualInstrument}
                                className="bg-white border border-orange-500 text-orange-600 px-5 py-2 rounded-lg hover:bg-orange-50 font-medium transition-colors"
                            >
                                Add Manual Override
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Recently Added Instruments Panel */}
                <div className="w-full lg:w-[350px] shrink-0">
                    <div className="bg-gradient-to-br from-orange-50/50 to-white shadow-sm border border-orange-100 rounded-xl p-5 sticky top-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 ring-4 ring-orange-50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-800">Newly Added Instruments</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                            These instruments were recently added to our system. If you have any relevant expertise, please update your profile!
                        </p>

                        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                            {recentInstruments?.length > 0 ? (
                                recentInstruments.map((instrument, i) => (
                                    <div
                                        key={i}
                                        className="p-3.5 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
                                    >
                                        <div className="font-medium text-gray-800 text-sm group-hover:text-orange-700 transition-colors">
                                            Ref/{instrument.instrument_id} - {instrument.instrument_name}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    No newly added instruments.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* UPDATE BUTTON */}
            <div className="flex justify-end mt-10 pt-6 border-t border-gray-100">
                <button
                    type="button"
                    onClick={updateTechnicalExpertise}
                    disabled={loading}
                    className="bg-orange-600 text-white px-6 py-2.5 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium flex items-center gap-2 transform active:scale-95 shadow-sm"
                >
                    {loading ? "Updating..." : "Update Technical Expertise"}
                </button>
            </div>
        </div>
    );

}