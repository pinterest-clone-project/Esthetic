namespace Application.Common.Emails;

public static class EmailTemplates
{
    public static string ForgotPassword(string code) => $@"
        <!DOCTYPE html>
        <html lang=""uk"">
            <head>
                <meta charset=""UTF-8"">
                <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                <title>Відновлення пароля</title>
            </head>
            <body style=""margin:0; padding:0; background-color:#000000; font-family:Arial,sans-serif; color:white;"">
                <div style=""max-width:600px; margin:0 auto; padding:40px 20px; text-align:center;"">

                    <h1 style=""font-size:28px; font-weight:bold; text-transform:uppercase; margin-bottom:16px;"">
                        Відновлення <span style=""color:#22c55e;"">пароля</span>
                    </h1>

                    <p style=""font-size:16px; color:#d1d5db; margin-bottom:32px;"">
                        Ми отримали запит на відновлення пароля для вашого акаунта.
                        Використайте наведений нижче код для зміни пароля в застосунку.
                    </p>

                    <div style=""font-size:32px; font-weight:bold; letter-spacing:8px; margin-bottom:24px;"">
                        {code}
                    </div>

                    <p style=""font-size:12px; color:#9ca3af; margin-top:24px;"">
                        Якщо ви не запитували відновлення пароля, просто ігноруйте цей лист.
                    </p>

                    <p style=""font-size:12px; color:#6b7280; margin-top:32px;"">
                        © 2026 F-track. Всі права захищені.
                    </p>

                </div>
            </body>
        </html>";
}
