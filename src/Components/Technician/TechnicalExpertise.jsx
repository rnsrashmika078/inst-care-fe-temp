import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { API_BASE } from "../../config";

const steps = [
  { label: "Laboratory Categories" },
  { label: "Instrument Categories" },
  { label: "Instruments" },
];

export default function TechnicalExpertise() {
  const userId = sessionStorage.getItem("user_id");
  const token = sessionStorage.getItem("token");
  const [tech_id, setTechId] = useState(null);

  const [labCategories, setLabCategories] = useState([]);
  const [instrumentCategories, setInstrumentCategories] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [newInstruments, setNewInstruments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(0);

  const [showDropdowns, setShowDropdowns] = useState(false);
  const [options, setOptions] = useState([]);

  const [showDropdownInstCat, setShowDropdownInstCat] = useState(false);
  const [instrCatOptions, setInstrCatOptions] = useState([]);

  const [showDropdownInstruments, setShowDropdownInstruments] = useState(false);
  const [instrumentOptions, setInstrumentOptions] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedInstrumentCategories, setSelectedInstrumentCategories] =
    useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedNewInstruments, setSelectedNewInstruments] = useState([]);
  const [manualInstrumentName, setManualInstrumentName] = useState("");

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
    const res = await fetch(`${API_BASE}/tech/profile/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setTechId(data.id || null);
  };

  const fetchRecentInstruments = async () => {
    const res = await fetch(`${API_BASE}/tech/recent-instruments`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setRecentInstruments(data.data || []);
  };

  const fetchLaboratoryCategories = async () => {
    const res = await fetch(
      `${API_BASE}/service-request/${tech_id}/laboratory-categories`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    setLabCategories(data.laboratoryCategories || []);
  };

  const fetchInstrumentCategories = async () => {
    const res = await fetch(
      `${API_BASE}/service-request/${tech_id}/instrument-categories`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    setInstrumentCategories(data.instrumentsCategories || []);
  };

  const fetchInstruments = async () => {
    const res = await fetch(
      `${API_BASE}/service-request/${tech_id}/instruments`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    setInstruments(data.instruments || []);
  };

  const fetchNewInstruments = async () => {
    const res = await fetch(
      `${API_BASE}/service-request/${tech_id}/new-instruments`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    setNewInstruments(data.newInstruments || []);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE}/tech/laboratory-categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      const formattedOptions = (data.data || []).map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setOptions(ensureOther(formattedOptions));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInstrumentCategoryData = async () => {
    try {
      const response = await fetch(`${API_BASE}/tech/instrument-categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      const formattedOptions = (data.data || []).map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setInstrCatOptions(ensureOther(formattedOptions));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInstrumentData = async () => {
    try {
      const response = await fetch(`${API_BASE}/tech/instruments`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      const formattedOptions = (data.data || []).map((item) => ({
        value: item.instrument_id,
        label: item.instrument_name,
      }));

      setInstrumentOptions(ensureOther(formattedOptions));
    } catch (error) {
      console.error(error);
    }
  };

  // Add new dropdown
  const addDropdown = async () => {
    await fetchData(); // fetch options if needed
    setShowDropdowns((prev) =>
      Array.isArray(prev) ? [...prev, true] : [true],
    );
    setSelectedCategories((prev) =>
      Array.isArray(prev) ? [...prev, null] : [null],
    );
  };

  const addDropdownInstCat = async () => {
    await fetchInstrumentCategoryData(); // fetch instrument category options if needed
    setShowDropdownInstCat((prev) =>
      Array.isArray(prev) ? [...prev, true] : [true],
    );
    setSelectedInstrumentCategories((prev) =>
      Array.isArray(prev) ? [...prev, null] : [null],
    );
  };

  const addDropdownInstrument = async () => {
    await fetchInstrumentData(); // fetch instrument options if needed
    setShowDropdownInstruments((prev) =>
      Array.isArray(prev) ? [...prev, true] : [true],
    );
    setSelectedInstruments((prev) =>
      Array.isArray(prev) ? [...prev, null] : [null],
    );
  };

  // Handle selection for each dropdown
  const isOtherOption = (option) => {
    const label = option?.label ?? option ?? "";
    return ["other", "others"].includes(String(label).trim().toLowerCase());
  };

  const ensureOther = (opts) => {
    const hasOther = opts.some((o) => isOtherOption(o));
    return hasOther ? opts : [...opts, { value: "other", label: "Other" }];
  };

  const handleChange = (selected, index) => {
    const updated = [...selectedCategories];
    updated[index] = selected;
    setSelectedCategories(updated);

    if (!selected || !isOtherOption(selected)) {
      setCustomLabValues((prev) => ({ ...prev, [index]: "" }));
    }
  };

  const handleInstrumentCategoryChange = (selected, index) => {
    const updated = [...selectedInstrumentCategories];
    updated[index] = selected;
    setSelectedInstrumentCategories(updated);

    if (!selected || !isOtherOption(selected)) {
      setCustomInstrCatValues((prev) => ({ ...prev, [index]: "" }));
    }
  };

  const handleInstrumentChange = (selected, index) => {
    const updated = [...selectedInstruments];
    updated[index] = selected; // save selected option at correct index
    setSelectedInstruments(updated);

    if (!selected || !isOtherOption(selected)) {
      setCustomInstrumentValues((prev) => ({ ...prev, [index]: "" }));
    }
  };

  const addManualInstrument = () => {
    if (manualInstrumentName.trim()) {
      setSelectedNewInstruments([
        ...selectedNewInstruments,
        manualInstrumentName.trim(),
      ]);
      setManualInstrumentName("");
    }
  };

  const removeManualInstrument = (index) => {
    setSelectedNewInstruments(
      selectedNewInstruments.filter((_, i) => i !== index),
    );
  };

  // Remove dropdown functions
  const removeDropdown = (index) => {
    setShowDropdowns((prev) => prev.filter((_, i) => i !== index));
    setSelectedCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const removeDropdownInstCat = (index) => {
    setShowDropdownInstCat((prev) => prev.filter((_, i) => i !== index));
    setSelectedInstrumentCategories((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  const removeDropdownInstrument = (index) => {
    setShowDropdownInstruments((prev) => prev.filter((_, i) => i !== index));
    setSelectedInstruments((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTechnicalExpertise = async () => {
    try {
      setLoading(true);
      const payload = {
        tech_id,
        laboratory_categories: selectedCategories
          .map((c, i) =>
            isOtherOption(c) ? (customLabValues[i] || "").trim() : c?.value,
          )
          .filter((v) => v),
        instrument_categories: selectedInstrumentCategories
          .map((c, i) =>
            isOtherOption(c)
              ? (customInstrCatValues[i] || "").trim()
              : c?.value,
          )
          .filter((v) => v),
        instruments: selectedInstruments
          .map((c, i) =>
            isOtherOption(c)
              ? (customInstrumentValues[i] || "").trim()
              : c?.value,
          )
          .filter((v) => v),
        new_instruments: selectedNewInstruments,
      };

      alert(JSON.stringify(payload));

      const res = await fetch(`${API_BASE}/tech/profile/expertise/${tech_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Technical expertise updated successfully");
      } else {
        console.error("Update error", result);
        toast.error("Failed to update expertise");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating expertise");
    } finally {
      setLoading(false);
    }
  };

  //   custom values per row (Others selection)
  const [customLabValues, setCustomLabValues] = useState({});
  const [customInstrCatValues, setCustomInstrCatValues] = useState({});
  const [customInstrumentValues, setCustomInstrumentValues] = useState({});

  /* STEP NAVIGATION */
  const stepValid = () => {
    if (step === 0) return selectedCategories.some((s) => s && s.value);
    if (step === 1)
      return selectedInstrumentCategories.some((s) => s && s.value);
    if (step === 2) return selectedInstruments.some((s) => s && s.value);
    return false;
  };

  const goNext = () => {
    if (!stepValid()) return;
    if (step < steps.length - 1) setStep(step + 1);
    else updateTechnicalExpertise();
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  /* STEP CONTENT */
  const renderLabCategories = () => (
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

      {Array.isArray(showDropdowns) &&
        showDropdowns.map((show, i) => (
          <div key={i} className="mt-3 w-full max-w-xs sm:max-w-sm">
            <Select
              options={options}
              value={selectedCategories[i] || null}
              onChange={(selected) => handleChange(selected, i)}
              isSearchable
            />
            {isOtherOption(selectedCategories[i]) && (
              <input
                value={customLabValues[i] || ""}
                onChange={(e) =>
                  setCustomLabValues((prev) => ({
                    ...prev,
                    [i]: e.target.value,
                  }))
                }
                className="bg-white border mt-2 border-gray-300 p-2 rounded-md w-full"
                placeholder="Enter Custom Laboratory Category"
              />
            )}
            <button
              type="button"
              onClick={() => {
                removeDropdown(i);
              }}
              className="text-red-500 hover:text-red-600 text-sm mt-1.5 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Remove
            </button>
          </div>
        ))}

      <button
        onClick={addDropdown}
        className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-3 flex items-center gap-1 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Laboratory Category
      </button>
    </div>
  );

  const renderInstrumentCategories = () => (
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

      {Array.isArray(showDropdownInstCat) &&
        showDropdownInstCat.map((show, i) => (
          <div key={i} className="mt-3 w-full max-w-xs sm:max-w-sm">
            <Select
              options={instrCatOptions}
              value={selectedInstrumentCategories[i] || null}
              onChange={(selected) =>
                handleInstrumentCategoryChange(selected, i)
              }
              isSearchable
            />
            {isOtherOption(selectedInstrumentCategories[i]) && (
              <input
                value={customInstrCatValues[i] || ""}
                onChange={(e) =>
                  setCustomInstrCatValues((prev) => ({
                    ...prev,
                    [i]: e.target.value,
                  }))
                }
                className="bg-white border mt-2 border-gray-300 p-2 rounded-md w-full"
                placeholder="Enter Custom Instrument Category"
              />
            )}
            <button
              type="button"
              onClick={() => {
                removeDropdownInstCat(i);
              }}
              className="text-red-500 hover:text-red-600 text-sm mt-1.5 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              Remove
            </button>
          </div>
        ))}

      <button
        onClick={addDropdownInstCat}
        className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-3 flex items-center gap-1 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Instrument Category
      </button>
    </div>
  );

  const renderInstruments = () => (
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

      {Array.isArray(showDropdownInstruments) &&
        showDropdownInstruments.map((show, i) => (
          <div key={i} className="mt-3 w-full max-w-xs sm:max-w-sm">
            <Select
              options={instrumentOptions}
              value={selectedInstruments[i] || null}
              onChange={(selected) => handleInstrumentChange(selected, i)}
              isSearchable
            />
            {isOtherOption(selectedInstruments[i]) && (
              <input
                value={customInstrumentValues[i] || ""}
                onChange={(e) =>
                  setCustomInstrumentValues((prev) => ({
                    ...prev,
                    [i]: e.target.value,
                  }))
                }
                className="bg-white border mt-2 border-gray-300 p-2 rounded-md w-full"
                placeholder="Enter Custom Instrument Name"
              />
            )}
            <button
              type="button"
              onClick={() => removeDropdownInstrument(i)}
              className="text-red-500 hover:text-red-600 text-sm mt-1.5 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              Remove
            </button>
          </div>
        ))}

      <button
        onClick={addDropdownInstrument}
        className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-3 flex items-center gap-1 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Instrument
      </button>
    </div>
  );

  const renderNewInstruments = () => (
    <div>
      <h3 className="font-medium text-gray-700 mb-3">
        Manual / Unlisted Instruments
      </h3>
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
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addManualInstrument();
            }
          }}
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
  );

  const stepContent = () => {
    switch (step) {
      case 0:
        return renderLabCategories();
      case 1:
        return renderInstrumentCategories();
      case 2:
        return (
          <div className="space-y-8">
            {renderInstruments()}
            {renderNewInstruments()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#ffffff80] shadow rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200 border-dashed">
        Technical Expertise
      </h2>

      {/* STEPPER */}
      <div className="mb-8 overflow-x-auto">
        <ol className="flex items-center min-w-[560px]">
          {steps.map((s, i) => {
            const completed = i < step;
            const active = i === step;
            return (
              <li key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      completed || active
                        ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {completed ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={`mt-2 text-xs font-medium whitespace-nowrap ${
                      active ? "text-orange-600" : "text-gray-500"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] mx-2 mb-5 ${
                      completed ? "bg-orange-500" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Current Step */}
        <div className="flex-1">{stepContent()}</div>

        {/* Right Side: Recently Added Instruments Panel */}

        {/* <div className="w-full lg:w-[350px] shrink-0">
          <div className="bg-gradient-to-br from-orange-50/50 to-white shadow-sm border border-orange-100 rounded-xl p-5 sticky top-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 ring-4 ring-orange-50">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800">
                Newly Added Instruments
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              These instruments were recently added to our system. If you have
              any relevant expertise, please update your profile!
            </p>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {recentInstruments?.length > 0 ? (
                recentInstruments.map((instrument, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="font-medium text-gray-800 text-sm group-hover:text-orange-700 transition-colors">
                      Ref/{instrument.instrument_id} -{" "}
                      {instrument.instrument_name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  <svg
                    className="w-10 h-10 mx-auto text-gray-300 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  No newly added instruments.
                </div>
              )}
            </div>
          </div>
        </div> */}
      </div>

      {/* NEXT / BACK / UPDATE BUTTONS */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-10 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!stepValid()}
            className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-2.5 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={updateTechnicalExpertise}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Technical Expertise"}
          </button>
        )}
      </div>
    </div>
  );
}
