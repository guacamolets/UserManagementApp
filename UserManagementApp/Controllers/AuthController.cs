using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserManagementApp.Data;
using UserManagementApp.Entities;
using UserManagementApp.Dto;

namespace UserManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserDbContext _db;

        public AuthController(UserDbContext db)
        {
            _db = db;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDto dto)
        {
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Status = "unverified",
                LastLogin = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                PasswordHash = dto.Password
            };

            _db.Users.Add(user);

            try
            {
                await _db.SaveChangesAsync();

                var confirmationLink = $"https://your-app.com/api/auth/confirm/{user.Id}";
                Console.WriteLine($"[Async email] Confirmation link for {user.Email}: {confirmationLink}");
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException?.Message.Contains("IX_Users_Email_Unique") == true)
                {
                    return BadRequest(new { message = "Email is already in use" });
                }
                throw;
            }

            return Ok(new { message = "Registration successful, status unverified" });
        }

        [HttpGet("confirm/{userId}")]
        public async Task<IActionResult> ConfirmEmail(int userId)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            if (user.Status == "blocked")
                return BadRequest(new { message = "User has been blocked" });

            if (user.Status == "unverified")
                user.Status = "active";

            await _db.SaveChangesAsync();

            return Ok(new { message = "Email confirmed, status active" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserRegistrationDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
                return BadRequest(new { message = "Invalid email" });

            if (user.Status == "blocked")
                return BadRequest(new { message = "User has been blocked" });

            if (user.PasswordHash != dto.Password)
                return BadRequest(new { message = "Invalid password" });

            user.LastLogin = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Login successful", status = user.Status });
        }
    }
}
