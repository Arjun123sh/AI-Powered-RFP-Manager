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
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Vendor Management</h1>
                <p className="page-description">
                    Add and manage your vendor database for RFP distribution
                </p>
            </div>

            <div className="content-section">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Add New Vendor</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Vendor Name</label>
                        <input
                            placeholder="Enter vendor name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            placeholder="vendor@company.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Company Name</label>
                        <input
                            placeholder="Company name"
                            value={form.company}
                            onChange={e => setForm({ ...form, company: e.target.value })}
                        />
                    </div>
                </div>
                <button
                    onClick={addVendor}
                    className="btn-primary"
                    disabled={loading}
                    style={{
                        marginTop: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {loading ? (
                        <>
                            <span className="loading"></span>
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

            <div className="content-section">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                    Vendor List
                    <span style={{
                        marginLeft: '0.75rem',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-secondary)',
                        fontWeight: '400'
                    }}>
                        ({vendors.length} {vendors.length === 1 ? 'vendor' : 'vendors'})
                    </span>
                </h3>

                {vendors.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: 'var(--color-text-secondary)'
                    }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <p>No vendors added yet. Add your first vendor above.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1rem'
                    }}>
                        {vendors.map((v, index) => (
                            <div
                                key={v._id}
                                className="fade-in"
                                style={{
                                    padding: '1.5rem',
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'all var(--transition-normal)',
                                    cursor: 'pointer',
                                    animationDelay: `${index * 0.05}s`
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = 'var(--color-border-focus)';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'var(--color-border)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'var(--color-bg-secondary)',
                                        border: '1px solid var(--color-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem',
                                        fontWeight: '600'
                                    }}>
                                        {v.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontWeight: '600',
                                            fontSize: '1.1rem',
                                            marginBottom: '0.25rem'
                                        }}>
                                            {v.name}
                                        </div>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--color-text-secondary)'
                                        }}>
                                            {v.company}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.9rem',
                                    color: 'var(--color-text-secondary)'
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    {v.email}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
