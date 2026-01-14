import { useState, useEffect } from "react";

export default function CreateRfp() {
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [selectedVendors, setSelectedVendors] = useState([]);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        loadVendors();
    }, []);

    async function loadVendors() {
        try {
            const res = await fetch("http://localhost:5000/api/vendors");
            setVendors(await res.json());
        } catch (error) {
            console.error("Error loading vendors:", error);
        }
    }

    async function submit() {
        if (!text.trim()) return;
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/rfp/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            const data = await res.json();
            setResult(data);
            setSent(false);
        } catch (error) {
            alert("Failed to create RFP");
        } finally {
            setLoading(false);
        }
    }

    async function sendToVendors() {
        if (selectedVendors.length === 0) return alert("Select at least one vendor");

        setSending(true);
        try {
            const res = await fetch(
                `http://localhost:5000/api/email/send/${result._id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ vendorIds: selectedVendors }),
                }
            );
            const data = await res.json();
            alert(data.message);
            setSent(true);
        } catch {
            alert("Failed to send emails");
        } finally {
            setSending(false);
        }
    }

    function toggleVendor(id) {
        setSelectedVendors((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
                        Create RFP
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Describe your requirements and generate a structured RFP
                    </p>
                </div>

                {/* Input Card */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    <label className="block mb-3 text-base font-semibold text-slate-200">
                        RFP Description
                    </label>

                    <textarea
                        rows="7"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Example: Need 20 laptops with i7, 16GB RAM, delivery in 30 days..."
                        className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />

                    <button
                        onClick={submit}
                        disabled={loading || !text.trim()}
                        className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? "Processing..." : "Generate Structured RFP"}
                    </button>
                </div>

                {/* Result */}
                {result && (
                    <>
                        {/* Structured Output */}
                        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                            <h3 className="text-2xl font-bold text-white mb-6">Structured RFP Output</h3>

                            <pre className="bg-slate-900/70 border border-slate-700/50 p-6 rounded-xl text-sm text-slate-200 overflow-auto max-h-96 shadow-inner">
                                {JSON.stringify(result.structured, null, 2)}
                            </pre>

                            {/* Quick Stats */}
                            <div className="grid md:grid-cols-3 gap-4 mt-6">
                                {result.structured?.budget && (
                                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-5 rounded-xl text-center shadow-lg">
                                        <p className="text-slate-400 text-sm font-medium mb-1">Budget</p>
                                        <p className="text-xl font-bold text-white">{result.structured.budget}</p>
                                    </div>
                                )}
                                {result.structured?.deliveryDays && (
                                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-5 rounded-xl text-center shadow-lg">
                                        <p className="text-slate-400 text-sm font-medium mb-1">Delivery</p>
                                        <p className="text-xl font-bold text-white">
                                            {result.structured.deliveryDays} days
                                        </p>
                                    </div>
                                )}
                                {result.structured?.warranty && (
                                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-5 rounded-xl text-center shadow-lg">
                                        <p className="text-slate-400 text-sm font-medium mb-1">Warranty</p>
                                        <p className="text-xl font-bold text-white">{result.structured.warranty}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Vendor Selection */}
                        {!sent && (
                            <div className="mt-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                                <h3 className="text-2xl font-bold text-white mb-2">Select Vendors</h3>
                                <p className="text-slate-400 mb-6">
                                    Choose vendors to send this RFP
                                </p>

                                <div className="grid md:grid-cols-3 gap-4">
                                    {vendors.map((v) => (
                                        <div
                                            key={v._id}
                                            onClick={() => toggleVendor(v._id)}
                                            className={`p-5 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                                                selectedVendors.includes(v._id)
                                                    ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                                                    : "border-slate-700/50 bg-slate-900/30 hover:border-slate-600 hover:bg-slate-900/50"
                                            }`}
                                        >
                                            <p className="font-semibold text-white">{v.name}</p>
                                            <p className="text-sm text-slate-400 mt-1">{v.company}</p>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={sendToVendors}
                                    disabled={sending || selectedVendors.length === 0}
                                    className="mt-6 px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {sending
                                        ? "Sending..."
                                        : `Send to ${selectedVendors.length} Vendor${selectedVendors.length !== 1 ? 's' : ''}`}
                                </button>
                            </div>
                        )}

                        {/* Success */}
                        {sent && (
                            <div className="mt-8 text-center bg-gradient-to-br from-green-900/30 to-slate-800/50 backdrop-blur-sm border-2 border-green-500/50 rounded-2xl p-12 shadow-2xl">
                                <div className="text-6xl mb-4">✅</div>
                                <h3 className="text-3xl font-bold text-white mb-3">
                                    RFP Sent Successfully
                                </h3>
                                <p className="text-slate-300 mb-8 text-lg">
                                    Your RFP was sent to selected vendors.
                                </p>
                                <button
                                    onClick={() => {
                                        setText("");
                                        setResult(null);
                                        setSelectedVendors([]);
                                        setSent(false);
                                    }}
                                    className="px-8 py-3 border-2 border-slate-600 bg-slate-800/50 text-white rounded-xl font-semibold hover:border-slate-500 hover:bg-slate-700/50 transition-all"
                                >
                                    Create Another RFP
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}