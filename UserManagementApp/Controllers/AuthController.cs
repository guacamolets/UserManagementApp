using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserManagementApp.Data;
using UserManagementApp.Dto;
using UserManagementApp.Entities;
using UserManagementApp.Services;

namespace UserManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly IPasswordHasher<User> _passwordHasher;

        public AuthController(UserDbContext context, IConfiguration configuration, 
            IPasswordHasher<User> passwordHasher, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _passwordHasher = passwordHasher;
            _emailService = emailService;
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
                PasswordHash = dto.Password,
                EmailConfirmationToken = Guid.NewGuid().ToString("N"),
                EmailConfirmationTokenExpires = DateTime.UtcNow.AddHours(24)

            };

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

            _context.Users.Add(user);

            try
            {
                var confirmationLink = $"{_configuration["FrontendUrl"]}/confirm?token={user.EmailConfirmationToken}";
                
                await _context.SaveChangesAsync();

                //Task.Run(() => _emailService.SendConfirmationEmailAsync(user.Email, confirmationLink));

                await _emailService.SendConfirmationEmailAsync(user.Email, confirmationLink);
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException?.Message.Contains("IX_Users_Email_Unique") == true)
                {
                    return BadRequest(new { message = "Email is already in use" });
                }
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }

            return Ok(new { message = "Registration successful, status unverified" });
        }

        [AllowAnonymous]
        [HttpGet("confirm")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return BadRequest("Token missing");

            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.EmailConfirmationToken == token);

            if (user == null)
                return BadRequest("Invalid or expired token");

            user.Status = "active";
            user.EmailConfirmationToken = string.Empty;

            await _context.SaveChangesAsync();

            return Ok("Email confirmed successfully, status active");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return Unauthorized("Invalid credentials");
            if (user.Status == "blocked")
                return Forbid("User is blocked");
            var result = _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                dto.Password
            );
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid credentials");

            user.LastLogin = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return Ok(new { token });
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
                //new Claim("isBlocked", user.Status)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
