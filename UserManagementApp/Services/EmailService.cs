using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using UserManagementApp.Entities;

namespace UserManagementApp.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(IOptions<EmailSettings> options)
        {
            _settings = options.Value;
        }

        public async Task SendConfirmationEmailAsync(string email, string confirmationLink)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(MailboxAddress.Parse(_settings.From));
                message.To.Add(MailboxAddress.Parse(email));
                message.Subject = "Confirm your email";
                message.Body = new TextPart("html")
                {
                    Text = $"""
                    <p>Click the link to confirm:</p><a href="{confirmationLink}">{confirmationLink}</a>
                    """
                };

                using var client = new MailKit.Net.Smtp.SmtpClient();

                await client.ConnectAsync(
                    _settings.Host,
                    _settings.Port,
                    SecureSocketOptions.StartTls
                );
                await client.AuthenticateAsync(
            _settings.Username,
            _settings.Password
        );
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
                //client.EnableSsl = true;
                //client.Credentials = new NetworkCredential(_settings.Username, _settings.Password);

                Console.WriteLine($"[DEBUG] Sending confirmation email to {email} with link {confirmationLink}");

                //await client.SendMailAsync(message);
            }
            catch (Exception ex)
            {
                Console.WriteLine("EMAIL ERROR: " + ex.Message);
            }
        }
    }
}
