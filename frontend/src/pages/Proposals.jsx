import { useState, useEffect } from "react";

export default function Proposals() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [proposals, setProposals] = useState([]);

    useEffect(() => {
        loadProposals();
    }, []);

    async function loadProposals() {
        try {
            const res = await fetch("http://localhost:5000/api/proposals");
            const data = await res.json();
            setProposals(data);
        } catch (error) {
            console.error("Error loading proposals:", error);
        }
    }

    async function readInbox() {
        setLoading(true);
        setMessage("");
        try {
            await fetch("http://localhost:5000/api/email/read");
            setMessage("Successfully checked inbox for vendor replies");
            setTimeout(() => loadProposals(), 1000);
        } catch (error) {
            console.error("Error reading inbox:", error);
            setMessage("Failed to check inbox. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-7xl mx-auto py-12 px-6">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
                        Vendor Proposals
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Fetch and review vendor responses to your RFP requests
                    </p>
                </div>

                {/* Email Fetch Card */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl mb-8">
                    <div className="flex flex-col items-center gap-8 py-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </div>

                        <div className="text-center max-w-lg">
                            <h3 className="mb-3 text-2xl font-bold text-white">
                                Check Email Inbox
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                Click the button below to fetch vendor responses from your configured email inbox.
                                The system will automatically parse and extract proposal details.
                            </p>
                        </div>

                        <button
                            onClick={readInbox}
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 min-w-[220px] justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Checking Inbox...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="23 4 23 10 17 10" />
                                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                                    </svg>
                                    Fetch Vendor Replies
                                </>
                            )}
                        </button>

                        {message && (
                            <div className="py-4 px-6 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white text-center max-w-lg shadow-lg">
                                {message}
                            </div>
                        )}
                    </div>
                </div>

                {/* Proposals List */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    <h3 className="mb-6 text-2xl font-bold text-white">
                        Received Proposals
                        <span className="ml-3 text-base text-slate-400 font-normal">
                            ({proposals.length} {proposals.length === 1 ? 'proposal' : 'proposals'})
                        </span>
                    </h3>

                    {proposals.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-slate-500">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                            <p className="text-lg">No proposals received yet. Fetch vendor replies to see them here.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {proposals.map((proposal, index) => (
                                <div
                                    key={proposal._id}
                                    className="p-6 bg-slate-900/30 border border-slate-700/50 rounded-xl transition-all hover:border-slate-600 hover:bg-slate-900/50 hover:shadow-lg"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-1">
                                                {proposal.vendorId?.name || 'Unknown Vendor'}
                                            </h4>
                                            <p className="text-sm text-slate-400">
                                                {proposal.vendorId?.company || ''}
                                            </p>
                                        </div>
                                        <div className="py-2 px-4 bg-slate-800/80 border border-slate-600/50 rounded-lg text-sm text-slate-300 whitespace-nowrap">
                                            {new Date(proposal.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        {proposal.extractedData?.totalPrice && (
                                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                                <div className="text-xs text-slate-400 mb-1 uppercase tracking-wide">
                                                    Total Price
                                                </div>
                                                <div className="text-lg font-bold text-white">
                                                    {proposal.extractedData.totalPrice}
                                                </div>
                                            </div>
                                        )}
                                        {proposal.extractedData?.deliveryDays && (
                                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                                <div className="text-xs text-slate-400 mb-1 uppercase tracking-wide">
                                                    Delivery
                                                </div>
                                                <div className="text-lg font-bold text-white">
                                                    {proposal.extractedData.deliveryDays} days
                                                </div>
                                            </div>
                                        )}
                                        {proposal.extractedData?.warranty && (
                                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                                <div className="text-xs text-slate-400 mb-1 uppercase tracking-wide">
                                                    Warranty
                                                </div>
                                                <div className="text-lg font-bold text-white">
                                                    {proposal.extractedData.warranty}
                                                </div>
                                            </div>
                                        )}
                                        {proposal.extractedData?.paymentTerms && (
                                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                                <div className="text-xs text-slate-400 mb-1 uppercase tracking-wide">
                                                    Payment Terms
                                                </div>
                                                <div className="text-lg font-bold text-white">
                                                    {proposal.extractedData.paymentTerms}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}