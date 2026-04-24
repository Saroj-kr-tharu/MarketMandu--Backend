const EmailTemplate = (data = {}) => {
    const { 
        username = "Customer", 
        body = "", 
        app_url = "https://marketmandu.com",
        eventType = "USER_REGISTERED",
        subject = "Marketmandu Notification",
        currency = "NPR"
    } = data;

    // 1. Formatting Helpers
    const formatPrice = (val) => val ? Number(val).toFixed(2) : "0.00";
    const formatDate = (val) => val ? new Date(val).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) : "Soon";

    // Create a "Friendly Name" (removes @domain.com if username is an email)
    const friendlyName = (data.customerName || username || "Customer").split('@')[0];

    // 2. Define all possible placeholders
    const replacements = {
        // Identity (Handles both tags used in your images)
        username: friendlyName,
        customerName: friendlyName,
        
        // Order Info
        orderId: data.orderId || 'N/A',
        currency: currency,
        amount: formatPrice(data.amount),
        transactionId: data.transactionId || 'N/A',
        deliveryEstimatedDate: formatDate(data.deliveryEstimatedDate),
        shipping_fee: formatPrice(data.shipping_fee),
        tax: formatPrice(data.tax),
        
        // Links
        reset_link: data.reset_link || app_url,
        app_url: app_url
    };

    // 3. Dynamic Replacement Loop
    let processedBody = body;
    Object.keys(replacements).forEach(key => {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        processedBody = processedBody.replace(placeholder, replacements[key]);
    });

    // 4. Convert text body to styled HTML
    const formattedBodyContent = processedBody
        .split('\n')
        .map(line => {
            line = line.trim();
            if (!line) return '<div style="height: 12px;"></div>';
            
            // Welcome bullet points or Order summary items
            if (line.startsWith('•') || line.startsWith('*') || line.startsWith('-')) {
                return `<div style="padding: 4px 0; padding-left: 20px; color: #475569; position: relative;">• ${line.replace(/^[•*-]\s*/, '')}</div>`;
            }
            // Headers
            if (line.endsWith(':') || line === "Happy shopping!") {
                return `<p style="margin: 20px 0 10px; color: #1e293b; font-weight: 700; font-size: 16px;">${line}</p>`;
            }
            // Signature
            if (line.startsWith('—')) {
                return `<p style="margin-top: 25px; color: #64748b; font-style: italic; border-top: 1px solid #f1f5f9; padding-top: 15px;">${line}</p>`;
            }
            // Help text
            if (line.includes('Need help?')) {
                return `<p style="margin-top: 15px; color: #64748b; font-size: 14px;">${line}</p>`;
            }
            // Greeting
            if (line.startsWith('Hey') || line.startsWith('Hi')) {
                return `<p style="margin: 0 0 15px; color: #1e293b; font-size: 18px; font-weight: 800;">${line}</p>`;
            }
            return `<p style="margin: 0 0 10px; color: #475569; line-height: 1.6;">${line}</p>`;
        })
        .join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Inter', Arial, sans-serif;">
    <table role="presentation" style="width: 100%; background-color: #f8fafc;">
        <tr>
            <td style="padding: 40px 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #e11d48; font-size: 32px; font-weight: 800; letter-spacing: -1px;">Marketmandu</h1>
                            <p style="margin: 8px 0 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Your Ultimate Marketplace</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 20px 40px 40px 40px;">
                            <div style="font-size: 15px; color: #475569;">
                                ${formattedBodyContent}
                            </div>

                            <div style="text-align: center; margin-top: 35px;">
                                <a href="${app_url}" style="display: inline-block; background-color: #e11d48; color: #ffffff; padding: 16px 45px; text-decoration: none; border-radius: 10px; font-size: 16px; font-weight: 700; box-shadow: 0 4px 12px rgba(225,29,72,0.2);">
                                    ${eventType === 'USER_REGISTERED' ? 'Visit Store' : 'View Order'}
                                </a>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 25px 40px; background-color: #f8fafc; text-align: center; border-top: 1px solid #f1f5f9;">
                            <p style="margin: 0; color: #94a3b8; font-size: 12px;">© 2026 Marketmandu. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

module.exports = EmailTemplate;