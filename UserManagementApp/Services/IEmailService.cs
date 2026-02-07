namespace UserManagementApp.Services
{
    public interface IEmailService
    {
        public Task SendConfirmationEmailAsync(string email, string confirmationLink);
    }
}
