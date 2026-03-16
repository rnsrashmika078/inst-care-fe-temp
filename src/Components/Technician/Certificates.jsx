import { useState, useEffect } from "react";

export default function Certificates() {
    const userId = localStorage.getItem("user_id");
    const [tech_id,setTechId] = useState(null);

    const [oldCertificates, setOldCertificates] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        fetchTechnicianID();
    },[]);

    const fetchTechnicianID = async ()=>{
        const res = await fetch(`http://localhost/instrument-care-back-end/public/tech/profile/${userId}`);
        const data = await res.json();
        setTechId(data.id || null);
    };
     
    useEffect(() => {
        if (tech_id) {
            fetchCertificates();
        }
    }, [tech_id]);

    const fetchCertificates = async () => {
        try {
            const res = await fetch(
                `http://localhost/instrument-care-back-end/public/tech/certificates/${tech_id }`
            );
            const data = await res.json();
            setOldCertificates(data.data || []);
        } catch (err) {
            console.error("Error fetching certificates:", err);
        }
    };

    const addRow = () => {
        const newCertificate = {
            oem_company_name: "",
            instrument_name: "",
            certificate_name: "",
            certificate_number: "",
            issue_date: "",
            expiry_date: "",
            certificate_file: null
        };
        console.log("➕ Adding new row:", newCertificate);
        setCertificates([...certificates, newCertificate]);
    };

    const handleChange = (i, e) => {
        const updated = [...certificates];
        updated[i][e.target.name] = e.target.value;
        setCertificates(updated);
    };

    const handleFileChange = (i, e) => {
        const updated = [...certificates];
        updated[i].certificate_file = e.target.files[0];
        setCertificates(updated);
    };

    const handleRemove = (i) => {
        const updated = certificates.filter((_, index) => index !== i);
        setCertificates(updated);
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            console.log("📤 Sending certificates:", certificates);
            
            const formData = new FormData();
            formData.append("tech_id", tech_id);

            certificates.forEach((cert, i) => {
                formData.append(`certificates[${i}][oem_company_name]`, cert.oem_company_name);
                formData.append(`certificates[${i}][instrument_name]`, cert.instrument_name);
                formData.append(`certificates[${i}][certificate_name]`, cert.certificate_name);
                formData.append(`certificates[${i}][certificate_number]`, cert.certificate_number);
                formData.append(`certificates[${i}][issue_date]`, cert.issue_date);
                formData.append(`certificates[${i}][expiry_date]`, cert.expiry_date);
                if (cert.certificate_file) {
                    formData.append(`certificates[${i}][certificate_file]`, cert.certificate_file);
                }
            });

            const res = await fetch(
                `http://localhost/instrument-care-back-end/public/tech/profile/certificates/${tech_id}`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const result = await res.json();
            console.log("📥 Response:", result);

            if (res.ok) {
                alert("✅ Certificates updated successfully!");
                fetchCertificates();
            } else {
                console.error("❌ API Error:", result);
                alert("Failed to update Certificates");
            }
        } catch (err) {
            console.error("❌ Error updating Certificates:", err);
            alert("Error updating Certificates");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#ffffff80] shadow rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg mb-3">Certificates</h3>

            <div className="space-y-3">
            {oldCertificates.map((cert, i) => (
                <div
                key={i}
                className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                <p className="font-semibold text-gray-800">
                    {cert.certificate_name}
                </p>

                <p className="text-sm text-gray-600">
                    Company Name: {cert.oem_company_name}
                </p>

                <p className="text-sm text-gray-600">
                    Instrument Name: {cert.instrument_name}
                </p>

                <p className="text-sm text-gray-500">
                    Certificate No: {cert.certificate_number}
                </p>

                <p className="text-xs text-gray-500">
                    Issued: {cert.issue_date} | Expiry: {cert.expiry_date}
                </p>

                {cert.certificate_file && (
                    <a
                    href={`http://localhost/instrument-care-back-end/public/${cert.certificate_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm underline mt-1 inline-block"
                    >
                    View Certificate
                    </a>
                )}
                </div>
            ))}
            </div>

            {certificates.map((cert, i) => (
                <div key={i} className="grid grid-cols-2 gap-4 border p-4 rounded">
                    
                    <input
                        name="oem_company_name"
                        value={cert.oem_company_name}
                        onChange={(e) => handleChange(i, e)}
                        placeholder="OEM Company Name"
                        className="border p-2 rounded"
                    />

                    <input
                        name="instrument_name"
                        value={cert.instrument_name}
                        onChange={(e) => handleChange(i, e)}
                        placeholder="Instrument Name"
                        className="border p-2 rounded"
                    />
                    <input
                        name="certificate_name"
                        value={cert.certificate_name}
                        onChange={(e) => handleChange(i, e)}
                        placeholder="Certificate Name"
                        className="border p-2 rounded"
                    />

                    <input
                        name="certificate_number"
                        value={cert.certificate_number}
                        onChange={(e) => handleChange(i, e)}
                        placeholder="Certificate Number"
                        className="border p-2 rounded"
                    />

                    <input
                        name="issue_date"
                        value={cert.issue_date}
                        onChange={(e) => handleChange(i, e)}
                        placeholder="Issue Date"
                        className="border p-2 rounded"
                        type="date"
                    />

                    <input
                        name="expiry_date"
                        value={cert.expiry_date}
                        onChange={(e) => handleChange(i, e)}
                        placeholder="Expiry Date"
                        className="border p-2 rounded"
                        type="date"
                    />

                    <input
                        type="file"
                        // value={cert.certificate_file}
                        onChange={(e) => handleFileChange(i, e)}
                        className="border p-2 rounded"
                    />

                    {certificates.length > 1 && (
                        <button
                            type="button"
                            onClick={() => handleRemove(i)}
                            className="text-red-500 text-sm col-span-2"
                        >
                            × Remove
                        </button>
                    )}
                </div>
            ))}

            <button
                type="button"
                onClick={addRow}
                className="text-orange-500 text-sm"
            >
                + Add Certificate
            </button>

            {/* Debug Section */}
            {/* <pre className="mt-4 bg-gray-100 p-2 rounded text-xs">
                {JSON.stringify({ tech_id, certificates }, null, 2)}
            </pre> */}

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-500"
                >
                    {loading ? "Updating..." : "Update Certificates"}
                </button>
            </div>
        </div>
    );
}

