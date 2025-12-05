const formatDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

const formatCurrency = (amount = 0, currency = 'INR') => {
    try {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0
        }).format(amount);
    } catch (err) {
        return `${currency} ${amount?.toLocaleString('en-IN')}`;
    }
};

const companyDetails = {
    name: 'TerraVue Journeys',
    address: 'Gondia, Maharashtra, India',
    email: 'rounakukey73@gmail.com',
    phone: '+91 9673806883',
    gst: 'GSTIN 29ABCDE1234F1Z5'
};

const generateInvoiceHtml = ({ booking, user }) => {
    const baseAmount = booking.totalPrice || 0;
    const taxAmount = Math.round(baseAmount * 0.18);
    const grandTotal = baseAmount + taxAmount;

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Invoice ${booking.bookingReference}</title>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap');

    :root {
        color-scheme: only light;
        --bg: #f4f5fb;
        --text: #0f172a;
        --muted: #636b78;
        --border: #e5e7f0;
        --accent: #0b1220;
        --accent-light: #f4f6ff;
    }

    * {
        box-sizing: border-box;
    }

    body {
        font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
        background: var(--bg);
        color: var(--text);
        margin: 0;
        padding: 48px 0;
    }

    .invoice-wrapper {
        max-width: 800px;
        margin: 0 auto;
        background: #fff;
        border-radius: 28px;
        border: 1px solid var(--border);
        box-shadow: 0 30px 80px rgba(15, 23, 42, 0.12);
        padding: 52px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        gap: 32px;
        border-bottom: 1px solid var(--border);
        padding-bottom: 28px;
    }

    .brand h1 {
        margin: 6px 0 0;
        font-size: 36px;
        letter-spacing: -0.5px;
    }

    .brand-tag {
        text-transform: uppercase;
        letter-spacing: 0.5em;
        font-size: 12px;
        color: var(--muted);
    }

    .summary {
        text-align: right;
    }

    .summary strong {
        display: block;
        font-size: 22px;
    }

    .muted {
        color: var(--muted);
        font-size: 14px;
        margin: 2px 0;
    }

    .section {
        margin-top: 36px;
    }

    .section-title {
        font-size: 13px;
        letter-spacing: 0.45em;
        text-transform: uppercase;
        color: var(--muted);
        margin-bottom: 18px;
    }

    .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 18px;
    }

    .info-card {
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 22px;
        background: var(--accent-light);
    }

    .info-card strong {
        display: block;
        font-size: 20px;
        margin-bottom: 4px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 15px;
    }

    th {
        text-align: left;
        padding-bottom: 10px;
        color: var(--muted);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.35em;
        border-bottom: 1px solid var(--border);
    }

    td {
        padding: 18px 0;
        border-bottom: 1px solid var(--border);
        vertical-align: top;
    }

    td:first-child {
        font-weight: 500;
    }

    .line-note {
        font-size: 12px;
        color: var(--muted);
        margin-top: 6px;
    }

    .totals {
        margin-top: 24px;
        border-radius: 24px;
        background: var(--accent);
        color: white;
        padding: 26px;
    }

    .totals-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 15px;
    }

    .totals-row:last-child {
        font-size: 22px;
        font-weight: 600;
        margin-top: 8px;
    }

    .badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 999px;
        background: #f3f4ff;
        color: #0f172a;
        font-size: 12px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
    }

    .notes {
        font-size: 13px;
        color: var(--muted);
        line-height: 1.7;
    }

    .footer {
        margin-top: 36px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: var(--muted);
    }

    .footer strong {
        color: var(--text);
        letter-spacing: 0.35em;
    }
</style>
</head>
<body>
    <div class="invoice-wrapper">
        <header class="header">
            <div class="brand">
                <span class="brand-tag">TerraVue</span>
                <h1>Journey Invoice</h1>
                <p class="muted">Reference · ${booking.bookingReference}</p>
            </div>
            <div class="summary">
                <strong>${formatCurrency(grandTotal, booking.currency)}</strong>
                <p class="muted">Invoice Date · ${formatDate(new Date())}</p>
                <p class="muted">Payment · ${booking.paymentStatus}</p>
            </div>
        </header>

        <section class="section">
            <div class="section-title">Passenger & journey</div>
            <div class="card-grid">
                <div class="info-card">
                    <strong>${user?.name || 'TerraVue Traveler'}</strong>
                    <p class="muted">${user?.email || 'Email on file'}</p>
                    <p class="muted">${companyDetails.address}</p>
                </div>
                <div class="info-card">
                    <strong>${booking.tour?.title || 'Custom Experience'}</strong>
                    <p class="muted">${booking.tour?.country || ''}</p>
                    <p class="muted">${formatDate(booking.startDate)} → ${formatDate(booking.endDate)}</p>
                    <p class="muted">${booking.adults} adults · ${booking.children} children</p>
                    <span class="badge">${booking.status}</span>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="section-title">Experience ledger</div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            ${booking.tour?.title || 'Signature journey'}
                            <div class="line-note">${booking.quantity} room(s) • concierge curated</div>
                        </td>
                        <td>${booking.quantity}</td>
                        <td>${formatCurrency((booking.totalPrice || 0) / Math.max(1, booking.quantity), booking.currency)}</td>
                        <td>${formatCurrency(baseAmount, booking.currency)}</td>
                    </tr>
                    <tr>
                        <td>Travellers</td>
                        <td>${booking.adults + booking.children}</td>
                        <td>${formatCurrency(Math.round(baseAmount / Math.max(1, booking.adults + booking.children)), booking.currency)}</td>
                        <td>${formatCurrency(baseAmount, booking.currency)}</td>
                    </tr>
                </tbody>
            </table>

            <div class="totals">
                <div class="totals-row">
                    <span>Subtotal</span>
                    <span>${formatCurrency(baseAmount, booking.currency)}</span>
                </div>
                <div class="totals-row">
                    <span>GST (18%)</span>
                    <span>${formatCurrency(taxAmount, booking.currency)}</span>
                </div>
                <div class="totals-row">
                    <span>Total due</span>
                    <span>${formatCurrency(grandTotal, booking.currency)}</span>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="section-title">Concierge note</div>
            <p class="notes">Payment Status · <strong>${booking.paymentStatus}</strong></p>
            <p class="notes">Special Requests · ${booking.specialRequests || 'None shared'}</p>
            <p class="notes">Thank you for choosing TerraVue Journeys. Any changes? Ping our concierge at billing@terravue.co or call ${companyDetails.phone}.</p>
        </section>

        <footer class="footer">
            <div>
                <strong>TerraVue</strong>
                <p>${companyDetails.address}</p>
            </div>
            <div>
                <p class="muted">${companyDetails.email}</p>
                <p class="muted">${companyDetails.phone}</p>
                <p class="muted">${companyDetails.gst}</p>
            </div>
        </footer>
    </div>
</body>
</html>`;
};

module.exports = generateInvoiceHtml;
