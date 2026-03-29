const EmailTemplate = (data = {}) => {
    const { 
        username = "Player", 
        body = "", 
        app_url = "#",
        eventType = "USER_REGISTERED",
        subject = "Power11 Notification"
    } = data;
    
    // Replace all placeholders in body
    let processedBody = body
        .replace(/\{\{username\}\}/g, username)
        .replace(/\{\{amount\}\}/g, data.amount || '')
        .replace(/\{\{transaction_id\}\}/g, data.transaction_id || '')
        .replace(/\{\{rank\}\}/g, data.rank || '')
        .replace(/\{\{reset_link\}\}/g, data.reset_link || '')
        .replace(/\{\{withdraw_amount\}\}/g, data.withdraw_amount || '')
        .replace(/\{\{reason\}\}/g, data.reason || '');
    
    // Convert plain text to HTML with proper formatting
    const formattedBody = processedBody
        .split('\n')
        .map(line => {
            line = line.trim();
            if (!line) return '<div style="height: 8px;"></div>';
            if (line.startsWith('- ')) {
                return `<div style="margin-left: 20px; margin-bottom: 6px; color: #cbd5f5;">• ${line.substring(2)}</div>`;
            }
            if (line.startsWith('—')) {
                return `<p style="margin: 12px 0 0; font-weight: 700; color: #ffffff;">${line}</p>`;
            }
            if (line.includes('Need help?') || line.includes('Questions?')) {
                return `<p style="margin: 4px 0 0; color: #94a3b8;">${line}</p>`;
            }
            if (line.includes('What you can do') || line.includes(':')) {
                return `<p style="margin: 16px 0 8px; color: #ffffff; font-weight: 700;">${line}</p>`;
            }
            if (line.startsWith('Hey ') || line.startsWith('Hi ')) {
                return `<p style="margin: 0 0 12px; color: #e5e7eb; font-size: 17px;">${line}</p>`;
            }
            if (line.includes('Let the games') || line.includes('Best regards') || line.includes('Stay safe')) {
                return `<p style="margin: 12px 0 0; color: #cbd5f5;">${line}</p>`;
            }
            return `<p style="margin: 0 0 12px; color: #cbd5f5;">${line}</p>`;
        })
        .join('');
    
    // Dynamic header emoji based on event type
    const getHeaderEmoji = () => {
        switch(eventType) {
            case 'USER_REGISTERED': return '⚡';
            case 'FORGOT_PASSWORD': return '🔒';
            case 'RESET_PASSWORD': return '✅';
            case 'WALLET_CREDITED': return '💰';
            case 'WITHDRAW_REQUESTED': return '📤';
            case 'WITHDRAW_APPROVED': return '✅';
            case 'WITHDRAW_REJECTED': return '❌';
            default: return '⚡';
        }
    };
    
    // Dynamic CTA based on event type
    const getCTA = () => {
        switch(eventType) {
            case 'USER_REGISTERED': 
                return { text: 'Enter the Arena ⚡', show: true };
            case 'FORGOT_PASSWORD': 
                return { text: 'Reset Password 🔒', show: true, url: data.reset_link };
            case 'RESET_PASSWORD': 
                return { text: 'Login Now ✅', show: true };
            case 'WALLET_CREDITED': 
                return { text: 'View Wallet 💰', show: true };
            case 'WITHDRAW_REQUESTED': 
                return { text: 'View Status 📊', show: true };
            case 'WITHDRAW_APPROVED': 
                return { text: 'View Transaction ✅', show: true };
            case 'WITHDRAW_REJECTED': 
                return { text: 'Contact Support 💬', show: true };
            default: 
                return { text: 'Go to Dashboard 🎯', show: true };
        }
    };
    
    const cta = getCTA();
    const ctaUrl = cta.url || app_url;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #0b1020;">
    <!-- Email Container -->
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #0b1020; font-family: 'Poppins', Arial, sans-serif;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #0f172a; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #ef4444 0%, #f59e0b 50%, #22c55e 100%); padding: 40px 0; text-align: center; border-radius: 18px 18px 0 0;">
                            <div style="background: rgba(0,0,0,0.25); padding: 24px; margin: 0 auto; width: fit-content; border-radius: 14px;">
                                <div style="font-size: 52px; margin-bottom: 8px;">${getHeaderEmoji()}</div>
                                <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 800; letter-spacing: 1px;">
                                    Power11
                                </h1>
                                <p style="margin: 6px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                                    Build • Battle • Win
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 32px 30px 28px 30px;">
                            <div style="color: #cbd5f5; font-size: 16px; line-height: 1.5;">
                                ${formattedBody}
                            </div>

                            <!-- CTA -->
                            ${cta.show ? `
                            <div style="text-align: center; margin: 24px 0 0 0;">
                                <a href="${ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #ef4444, #f59e0b); color: #ffffff; padding: 16px 44px; text-decoration: none; border-radius: 10px; font-size: 16px; font-weight: 700; box-shadow: 0 8px 20px rgba(239,68,68,0.4);">
                                    ${cta.text}
                                </a>
                            </div>
                            ` : ''}
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 26px; background-color: #020617; border-radius: 0 0 18px 18px; text-align: center;">
                            <p style="margin: 0 0 8px; color: #94a3b8; font-size: 13px;">
                                Need help? Reach us at 
                                <a href="mailto:support@power11.com" style="color: #f59e0b; text-decoration: none;">
                                    support@power11.com
                                </a>
                            </p>
                            <p style="margin: 0; color: #64748b; font-size: 12px;">
                                © 2025 Power11. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
};

module.exports = EmailTemplate;