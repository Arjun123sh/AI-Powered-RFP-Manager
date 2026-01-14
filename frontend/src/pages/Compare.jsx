import { useState, useEffect } from "react";

export default function Compare() {
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [rfps, setRfps] = useState([]);
    const [selectedRfp, setSelectedRfp] = useState("");

    useEffect(() => {
        loadRfps();
    }, []);

    useEffect(() => {
        if (selectedRfp) {
            loadProposals();
        }
    }, [selectedRfp]);

    async function loadRfps() {
        try {
            const res = await fetch("http://localhost:5000/api/rfp");
            const data = await res.json();
            setRfps(data.filter(rfp => rfp.status === 'sent'));
        } catch (error) {
            console.error("Error loading RFPs:", error);
        }
    }

    async function loadProposals() {
        try {
            const res = await fetch(`http://localhost:5000/api/proposals/rfp/${selectedRfp}`);
            const data = await res.json();
            setProposals(data);
            setRecommendation(null);
        } catch (error) {
            console.error("Error loading proposals:", error);
        }
    }

    async function getRecommendation() {
        if (!selectedRfp) {
            alert("Please select an RFP first");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/proposals/compare", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rfpId: selectedRfp })
            });
            const data = await res.json();
            setRecommendation(data);
        } catch (error) {
            console.error("Error getting recommendation:", error);
            alert("Failed to get recommendation");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-7xl mx-auto py-12 px-6">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
                        Proposal Comparison
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Compare vendor proposals side-by-side and get AI-powered recommendations
                    </p>
                </div>

                {/* RFP Selection */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl mb-8">
                    <label className="block mb-3 font-semibold text-slate-200">Select RFP</label>
                    <select
                        value={selectedRfp}
                        onChange={e => setSelectedRfp(e.target.value)}
                        className="w-full py-3.5 px-4 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all cursor-pointer"
                    >
                        <option value="">Choose an RFP...</option>
                        {rfps.map(rfp => (
                            <option key={rfp._id} value={rfp._id}>
                                RFP - {new Date(rfp.createdAt).toLocaleDateString()} ({rfp.selectedVendors?.length || 0} vendors)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Proposals Table */}
                {selectedRfp && proposals.length > 0 && (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h3 className="text-2xl font-bold text-white">
                                Vendor Proposals ({proposals.length})
                            </h3>
                            <button
                                onClick={getRecommendation}
                                disabled={loading}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                            <line x1="12" y1="17" x2="12.01" y2="17" />
                                        </svg>
                                        Get AI Recommendation
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-700/50">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-900/70 border-b border-slate-700/50">
                                        <th className="p-4 text-left font-semibold text-white">Vendor</th>
                                        <th className="p-4 text-left font-semibold text-white">Total Price</th>
                                        <th className="p-4 text-left font-semibold text-white">Delivery</th>
                                        <th className="p-4 text-left font-semibold text-white">Warranty</th>
                                        <th className="p-4 text-left font-semibold text-white">Payment Terms</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proposals.map((proposal, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-slate-700/50 hover:bg-slate-900/30 transition-all"
                                        >
                                            <td className="p-4">
                                                <div className="font-semibold text-white">{proposal.vendorId?.name}</div>
                                                <div className="text-sm text-slate-400">
                                                    {proposal.vendorId?.company}
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-300">
                                                {proposal.extractedData?.totalPrice || 'N/A'}
                                            </td>
                                            <td className="p-4 text-slate-300">
                                                {proposal.extractedData?.deliveryDays ? `${proposal.extractedData.deliveryDays} days` : 'N/A'}
                                            </td>
                                            <td className="p-4 text-slate-300">
                                                {proposal.extractedData?.warranty || 'N/A'}
                                            </td>
                                            <td className="p-4 text-slate-300">
                                                {proposal.extractedData?.paymentTerms || 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* AI Recommendation */}
                {recommendation && (
                    <div className="bg-gradient-to-br from-blue-900/30 to-slate-800/50 backdrop-blur-sm border-2 border-blue-500/50 rounded-2xl p-8 shadow-2xl shadow-blue-500/10">
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                    <h3 className="text-2xl font-bold text-white">
                                        AI Recommendation
                                    </h3>
                                    <span className="text-xs py-1.5 px-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold shadow-lg">
                                        BEST MATCH
                                    </span>
                                    {recommendation.score && (
                                        <span className="text-sm py-1.5 px-3 bg-slate-800/80 border border-slate-600/50 text-white rounded-lg font-semibold">
                                            Score: {recommendation.score}/10
                                        </span>
                                    )}
                                </div>
                                <div className="text-xl font-bold text-blue-300 mb-4">
                                    {recommendation.recommendedVendor}
                                </div>
                                <p className="text-slate-300 leading-relaxed text-base">
                                    {recommendation.reason}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Proposals Message */}
                {selectedRfp && proposals.length === 0 && (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-slate-500">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <p className="text-slate-400 text-lg">
                            No proposals received for this RFP yet. Check the Proposals page to fetch vendor replies.
                        </p>
                    </div>
                )}

                {/* Select RFP Message */}
                {!selectedRfp && (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-slate-500">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                        <p className="text-slate-400 text-lg">
                            Select an RFP above to view and compare vendor proposals.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}