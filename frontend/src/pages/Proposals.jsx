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
            // Reload proposals after parsing
            setTimeout(() => loadProposals(), 1000);
        } catch (error) {
            console.error("Error reading inbox:", error);
            setMessage("Failed to check inbox. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Vendor Proposals</h1>
                <p className="page-description">
                    Fetch and review vendor responses to your RFP requests
                </p>
            </div>

            <div className="content-section">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem',
                    padding: '2rem'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'var(--color-bg-card)',
                        border: '2px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    </div>

                    <div style={{ textAlign: 'center', maxWidth: '500px' }}>
                        <h3 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>
                            Check Email Inbox
                        </h3>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                            Click the button below to fetch vendor responses from your configured email inbox.
                            The system will automatically parse and extract proposal details.
                        </p>
                    </div>

                    <button
                        onClick={readInbox}
                        className="btn-primary"
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            minWidth: '220px',
                            justifyContent: 'center'
                        }}
                    >
                        {loading ? (
                            <>
                                <span className="loading"></span>
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
                        <div
                            className="fade-in"
                            style={{
                                padding: '1rem 1.5rem',
                                background: 'var(--color-bg-card)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--color-text-primary)',
                                textAlign: 'center',
                                maxWidth: '500px'
                            }}
                        >
                            {message}
                        </div>
                    )}
                </div>
            </div>

            <div className="content-section">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                    Received Proposals
                    <span style={{
                        marginLeft: '0.75rem',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-secondary)',
                        fontWeight: '400'
                    }}>
                        ({proposals.length} {proposals.length === 1 ? 'proposal' : 'proposals'})
                    </span>
                </h3>

                {proposals.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: 'var(--color-text-secondary)'
                    }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                        <p>No proposals received yet. Fetch vendor replies to see them here.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gap: '1rem'
                    }}>
                        {proposals.map((proposal, index) => (
                            <div
                                key={proposal._id}
                                className="fade-in"
                                style={{
                                    padding: '1.5rem',
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'all var(--transition-normal)',
                                    animationDelay: `${index * 0.05}s`
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = 'var(--color-border-focus)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'var(--color-border)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '1rem'
                                }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                                            {proposal.vendorId?.name || 'Unknown Vendor'}
                                        </h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                            {proposal.vendorId?.company || ''}
                                        </p>
                                    </div>
                                    <div style={{
                                        padding: '0.5rem 1rem',
                                        background: 'var(--color-bg-secondary)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.85rem',
                                        color: 'var(--color-text-secondary)'
                                    }}>
                                        {new Date(proposal.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                    gap: '1rem',
                                    marginTop: '1rem'
                                }}>
                                    {proposal.extractedData?.totalPrice && (
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                                                Total Price
                                            </div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                                {proposal.extractedData.totalPrice}
                                            </div>
                                        </div>
                                    )}
                                    {proposal.extractedData?.deliveryDays && (
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                                                Delivery
                                            </div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                                {proposal.extractedData.deliveryDays} days
                                            </div>
                                        </div>
                                    )}
                                    {proposal.extractedData?.warranty && (
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                                                Warranty
                                            </div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                                {proposal.extractedData.warranty}
                                            </div>
                                        </div>
                                    )}
                                    {proposal.extractedData?.paymentTerms && (
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                                                Payment Terms
                                            </div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
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
    );
}
