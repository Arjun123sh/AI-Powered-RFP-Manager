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
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Proposal Comparison</h1>
                <p className="page-description">
                    Compare vendor proposals side-by-side and get AI-powered recommendations
                </p>
            </div>

            <div className="content-section">
                <div className="form-group">
                    <label className="form-label">Select RFP</label>
                    <select
                        value={selectedRfp}
                        onChange={e => setSelectedRfp(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.875rem 1rem',
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--color-text-primary)',
                            fontSize: '0.95rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="">Choose an RFP...</option>
                        {rfps.map(rfp => (
                            <option key={rfp._id} value={rfp._id}>
                                RFP - {new Date(rfp.createdAt).toLocaleDateString()} ({rfp.selectedVendors?.length || 0} vendors)
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedRfp && proposals.length > 0 && (
                <div className="content-section">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <h3 style={{ fontSize: '1.25rem' }}>
                            Vendor Proposals ({proposals.length})
                        </h3>
                        <button
                            onClick={getRecommendation}
                            className="btn-primary"
                            disabled={loading}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {loading ? (
                                <>
                                    <span className="loading"></span>
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

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'separate',
                            borderSpacing: '0',
                        }}>
                            <thead>
                                <tr style={{
                                    background: 'var(--color-bg-secondary)',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Vendor</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Total Price</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Delivery</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Warranty</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Payment Terms</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proposals.map((proposal, index) => (
                                    <tr
                                        key={index}
                                        style={{
                                            borderBottom: '1px solid var(--color-border)',
                                            transition: 'all var(--transition-normal)'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = 'var(--color-bg-card)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>
                                            <div>{proposal.vendorId?.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                                {proposal.vendorId?.company}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>
                                            {proposal.extractedData?.totalPrice || 'N/A'}
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>
                                            {proposal.extractedData?.deliveryDays ? `${proposal.extractedData.deliveryDays} days` : 'N/A'}
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>
                                            {proposal.extractedData?.warranty || 'N/A'}
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>
                                            {proposal.extractedData?.paymentTerms || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {recommendation && (
                <div className="content-section fade-in" style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                    border: '2px solid var(--color-border-focus)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1.5rem'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'var(--color-text-primary)',
                            color: 'var(--color-bg-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: '1.5rem',
                                marginBottom: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                flexWrap: 'wrap'
                            }}>
                                AI Recommendation
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
                                    background: 'var(--color-text-primary)',
                                    color: 'var(--color-bg-primary)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: '600'
                                }}>
                                    BEST MATCH
                                </span>
                                {recommendation.score && (
                                    <span style={{
                                        fontSize: '0.9rem',
                                        padding: '0.25rem 0.75rem',
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontWeight: '600'
                                    }}>
                                        Score: {recommendation.score}/10
                                    </span>
                                )}
                            </h3>
                            <div style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                marginBottom: '1rem'
                            }}>
                                {recommendation.recommendedVendor}
                            </div>
                            <p style={{
                                color: 'var(--color-text-secondary)',
                                lineHeight: '1.7',
                                fontSize: '1rem'
                            }}>
                                {recommendation.reason}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {selectedRfp && proposals.length === 0 && (
                <div className="content-section">
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: 'var(--color-text-secondary)'
                    }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <p>No proposals received for this RFP yet. Check the Proposals page to fetch vendor replies.</p>
                    </div>
                </div>
            )}

            {!selectedRfp && (
                <div className="content-section">
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: 'var(--color-text-secondary)'
                    }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                        <p>Select an RFP above to view and compare vendor proposals.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
