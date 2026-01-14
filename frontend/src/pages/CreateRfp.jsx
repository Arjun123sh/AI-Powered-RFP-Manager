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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const data = await res.json();
            setResult(data);
            setSent(false);
        } catch (error) {
            console.error("Error creating RFP:", error);
            alert("Failed to create RFP. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function sendToVendors() {
        if (selectedVendors.length === 0) {
            alert("Please select at least one vendor");
            return;
        }

        setSending(true);
        try {
            const res = await fetch(`http://localhost:5000/api/email/send/${result._id}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vendorIds: selectedVendors })
            });
            const data = await res.json();
            alert(data.message);
            setSent(true);
        } catch (error) {
            console.error("Error sending emails:", error);
            alert("Failed to send emails");
        } finally {
            setSending(false);
        }
    }

    function toggleVendor(vendorId) {
        setSelectedVendors(prev =>
            prev.includes(vendorId)
                ? prev.filter(id => id !== vendorId)
                : [...prev, vendorId]
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Create RFP</h1>
                <p className="page-description">
                    Describe your requirements in natural language, and AI will convert it into a structured RFP
                </p>
            </div>

            <div className="content-section">
                <div className="form-group">
                    <label className="form-label">RFP Description</label>
                    <textarea
                        className="fade-in"
                        rows="8"
                        placeholder="Example: Need 20 laptops with 16GB RAM, Intel i7 processor, budget $50,000, delivery in 30 days, 2-year warranty..."
                        value={text}
                        onChange={e => setText(e.target.value)}
                        style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.95rem',
                            lineHeight: '1.6'
                        }}
                    />
                </div>

                <button
                    onClick={submit}
                    className="btn-primary"
                    disabled={loading || !text.trim()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        minWidth: '200px',
                        justifyContent: 'center'
                    }}
                >
                    {loading ? (
                        <>
                            <span className="loading"></span>
                            Processing...
                        </>
                    ) : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Generate Structured RFP
                        </>
                    )}
                </button>
            </div>

            {result && (
                <>
                    <div className="content-section fade-in" style={{ marginTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Structured RFP Output</h3>
                        <div style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1.5rem',
                            overflow: 'auto',
                            maxHeight: '500px'
                        }}>
                            <pre style={{
                                color: 'var(--color-text-primary)',
                                fontFamily: 'Monaco, Consolas, monospace',
                                fontSize: '0.9rem',
                                lineHeight: '1.6',
                                margin: 0,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {JSON.stringify(result.structured, null, 2)}
                            </pre>
                        </div>

                        {result.structured && (
                            <div style={{
                                marginTop: '1.5rem',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem'
                            }}>
                                {result.structured.budget && (
                                    <div style={{
                                        padding: '1rem',
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Budget</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{result.structured.budget}</div>
                                    </div>
                                )}
                                {result.structured.deliveryDays && (
                                    <div style={{
                                        padding: '1rem',
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Delivery</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{result.structured.deliveryDays} days</div>
                                    </div>
                                )}
                                {result.structured.warranty && (
                                    <div style={{
                                        padding: '1rem',
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Warranty</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{result.structured.warranty}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {!sent && (
                        <div className="content-section fade-in" style={{ marginTop: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Select Vendors</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                                Choose which vendors should receive this RFP
                            </p>

                            {vendors.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                                    No vendors available. Please add vendors first.
                                </div>
                            ) : (
                                <>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                        gap: '1rem',
                                        marginBottom: '1.5rem'
                                    }}>
                                        {vendors.map(v => (
                                            <div
                                                key={v._id}
                                                onClick={() => toggleVendor(v._id)}
                                                style={{
                                                    padding: '1rem',
                                                    background: selectedVendors.includes(v._id)
                                                        ? 'var(--color-bg-card-hover)'
                                                        : 'var(--color-bg-card)',
                                                    border: selectedVendors.includes(v._id)
                                                        ? '2px solid var(--color-text-primary)'
                                                        : '1px solid var(--color-border)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    cursor: 'pointer',
                                                    transition: 'all var(--transition-normal)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem'
                                                }}
                                            >
                                                <div style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '4px',
                                                    border: '2px solid var(--color-border)',
                                                    background: selectedVendors.includes(v._id)
                                                        ? 'var(--color-text-primary)'
                                                        : 'transparent',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    {selectedVendors.includes(v._id) && (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg-primary)" strokeWidth="3">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{v.name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{v.company}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={sendToVendors}
                                        className="btn-primary"
                                        disabled={sending || selectedVendors.length === 0}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            minWidth: '220px',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {sending ? (
                                            <>
                                                <span className="loading"></span>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="22" y1="2" x2="11" y2="13" />
                                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                                </svg>
                                                Send to {selectedVendors.length} Vendor{selectedVendors.length !== 1 ? 's' : ''}
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {sent && (
                        <div className="content-section fade-in" style={{
                            marginTop: '2rem',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                            border: '2px solid var(--color-border-focus)',
                            textAlign: 'center',
                            padding: '3rem'
                        }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" style={{ margin: '0 auto 1rem' }}>
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>RFP Sent Successfully!</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                                Your RFP has been sent to {selectedVendors.length} vendor{selectedVendors.length !== 1 ? 's' : ''}.
                                They will reply via email with their proposals.
                            </p>
                            <button
                                onClick={() => {
                                    setText("");
                                    setResult(null);
                                    setSelectedVendors([]);
                                    setSent(false);
                                }}
                                className="btn-secondary"
                            >
                                Create Another RFP
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
