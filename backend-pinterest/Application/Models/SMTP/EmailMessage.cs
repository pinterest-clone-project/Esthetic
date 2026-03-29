namespace Application.Models.SMTP;

public class EmailMessage
{
    /// <summary>
    /// Тема листа
    /// </summary>
    public string Subject { get; set; } = string.Empty;
    /// <summary>
    /// Вміст листа
    /// </summary>
    public string Body { get; set; } = string.Empty;
    /// <summary>
    /// Кому на пошту піде лист
    /// </summary>
    public string To { get; set; } = string.Empty;
}