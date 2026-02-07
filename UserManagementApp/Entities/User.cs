using System.ComponentModel.DataAnnotations;

namespace UserManagementApp.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Status { get; set; } = "unverified"; // unverified / active / blocked
        public DateTime? LastLogin { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string EmailConfirmationToken { get; set; }
        public DateTime? EmailConfirmationTokenExpires { get; set; }
    }
}
