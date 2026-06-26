namespace Application.Common.Emails;

public static class EmailTemplates
{
    public static string ForgotPassword(string code) => $@"
        <!DOCTYPE html>
        <html lang=""uk"">
        <head>
            <meta charset=""UTF-8"">
            <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
            <title>Reset Password — Esthetic</title>
        </head>
        <body style=""margin:0; padding:0; background-color:#0f0f0f; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;"">

            <div style=""max-width:560px; margin:0 auto; padding:48px 24px;"">

                <div style=""text-align:center; margin-bottom:40px;"">
                    <span style=""font-size:26px; font-weight:800; letter-spacing:-0.5px; color:#ffffff;"">Esthetic</span>
                    <span style=""display:block; width:32px; height:3px; background:#1DB954; border-radius:2px; margin:8px auto 0;""></span>
                </div>

                <div style=""background:#1a1a1a; border:1px solid #2a2a2a; border-radius:16px; padding:40px 36px;"">

                    <table role=""presentation"" cellpadding=""0"" cellspacing=""0"" style=""margin:0 auto 24px;"">
                        <tr>
                            <td style=""width:52px; height:52px; background:#1a2e1e; border:1.5px solid #1DB954; border-radius:50%; text-align:center; vertical-align:middle; font-size:22px; line-height:1;"">
                                🔐
                            </td>
                        </tr>
                    </table>

                    <h1 style=""margin:0 0 12px; font-size:22px; font-weight:700; color:#ffffff; text-align:center; letter-spacing:-0.3px;"">
                        Password Reset
                    </h1>

                    <p style=""margin:0 0 32px; font-size:14px; color:#a1a1a1; text-align:center; line-height:1.6;"">
                        We received a request to reset the password for your Esthetic account.
                        Use the code below to continue in the app.
                    </p>

                    <div style=""background:#121212; border:1.5px solid #1DB954; border-radius:12px; padding:20px 16px; text-align:center; margin-bottom:28px;"">
                        <p style=""margin:0 0 6px; font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#1DB954;"">
                            Confirmation code
                        </p>
                        <div style=""font-size:36px; font-weight:800; letter-spacing:10px; color:#ffffff; font-variant-numeric:tabular-nums;"">
                            {code}
                        </div>
                        <p style=""margin:8px 0 0; font-size:11px; color:#555555;"">valid for 15 minutes</p>
                    </div>

                    <p style=""margin:0; font-size:12px; color:#555555; text-align:center; line-height:1.6;"">
                        If you didn't request a password reset, simply ignore this email.<br>
                        Your password will remain unchanged.
                    </p>

                </div>

                <div style=""text-align:center; margin-top:32px;"">
                    <p style=""margin:0; font-size:11px; color:#3a3a3a; letter-spacing:0.3px;"">
                        © 2026 Esthetic. All rights reserved.
                    </p>
                </div>

            </div>
        </body>
        </html>";
}