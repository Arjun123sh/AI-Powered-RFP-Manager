import { useState, useEffect } from "react";

export default function Vendors() {
    const [vendors, setVendors] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", company: "" });
    const [loading, setLoading] = useState(false);

    async function load() {
        try {
            const res = await fetch("http://localhost:5000/api/vendors");
            setVendors(await res.json());
        } catch (error) {
            console.error("Error loading vendors:", error);
        }
    }

    async function addVendor() {
        if (!form.name || !form.email || !form.company) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            await fetch("http://localhost:5000/api/vendors/add", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            setForm({ name: "", email: "", company: "" });
            load();
        } catch (error) {
            console.error("Error adding vendor:", error);
            alert("Failed to add vendor");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load() }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-7xl mx-auto py-12 px-6">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
                        Vendor Management
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Add and manage your vendor database for RFP distribution
                    </p>
                </div>

                {/* Add Vendor Form */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl mb-8">
                    <h3 className="mb-6 text-2xl font-bold text-white">Add New Vendor</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block mb-2 font-semibold text-slate-200">Vendor Name</label>
                            <input
                                placeholder="Enter vendor name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full py-3 px-4 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold text-slate-200">Email Address</label>
                            <input
                                type="email"
                                placeholder="vendor@company.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full py-3 px-4 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold text-slate-200">Company Name</label>
                            <input
                                placeholder="Company name"
                                value={form.company}
                                onChange={e => setForm({ ...form, company: e.target.value })}
                                className="w-full py-3 px-4 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                        </div>
                    </div>
                    <button
                        onClick={addVendor}
                        disabled={loading}
                        className="mt-6 px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Adding...
                            </>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                Add Vendor
                            </>
                        )}
                    </button>
                </div>

                {/* Vendor List */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    <h3 className="mb-6 text-2xl font-bold text-white">
                        Vendor List
                        <span className="ml-3 text-base text-slate-400 font-normal">
                            ({vendors.length} {vendors.length === 1 ? 'vendor' : 'vendors'})
                        </span>
                    </h3>

                    {vendors.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-slate-500">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <p className="text-lg">No vendors added yet. Add your first vendor above.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vendors.map((v) => (
                                <div
                                    key={v._id}
                                    className="p-6 bg-slate-900/30 border border-slate-700/50 rounded-xl transition-all hover:border-slate-600 hover:bg-slate-900/50 hover:-translate-y-1 hover:shadow-lg group"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
                                            {v.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-lg text-white mb-1 truncate">
                                                {v.name}
                                            </div>
                                            <div className="text-sm text-slate-400 truncate">
                                                {v.company}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 p-3 rounded-lg">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                        <span className="truncate">{v.email}</span>
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