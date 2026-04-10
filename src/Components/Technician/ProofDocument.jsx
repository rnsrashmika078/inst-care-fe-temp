import { useState, useEffect } from "react";

export default function ProofDocument() {

    const userId = sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("token");

    const [tech_id, setTechId] = useState(null);

    const [documentFile, setDocumentFile] = useState(null);
    const [documentPreview, setDocumentPreview] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTechnicianID();
    }, []);

    const fetchTechnicianID = async () => {
        const res = await fetch(
            `http://localhost/instrument-care-back-end/public/tech/profile/${userId}`,
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

    useEffect(() => {
        if (tech_id) {
            fetchDocument();
        }
    }, [tech_id]);

    const fetchDocument = async () => {
        try {
            const res = await fetch(`http://localhost/instrument-care-back-end/public/tech/document/${tech_id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();


            if (data.proof) {
                setDocumentPreview(`http://localhost/instrument-care-back-end/public/${data.proof}`);
            }

        } catch (err) {
            console.error("Error fetching document:", err);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setDocumentFile(file);
        setDocumentPreview(URL.createObjectURL(file));
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("document", documentFile);
            formData.append("tech_id", tech_id);
            const res = await fetch(
                `http://localhost/instrument-care-back-end/public/tech/profile/document/${tech_id}`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const result = await res.json();
            console.log("📥 Response:", result);
            if (res.ok) {
                alert("✅ Document uploaded successfully!");
                fetchDocument();
            } else {
                alert(result.error || "Upload failed");
            }
        } catch (err) {
            console.error("❌ Error uploading document:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#ffffff80] shadow rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg">Gurantee Of Service</h3>
            {/* View existing document */}
            {documentPreview ? (
                <a
                    href={documentPreview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-100 text-orange-700 px-3 py-1 rounded-md text-sm hover:bg-orange-200"
                >
                    View Uploaded Document
                </a>
            ) : (
                <div>
                    <p className="text-gray-400">No document uploaded</p>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                    />
                </div>
            )}
            {/* Upload new document */}

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-500"
                >
                    {loading ? "Uploading..." : "Upload Document"}
                </button>
            </div>
        </div>
    );
}