using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserManagementApp.Data;
using UserManagementApp.Dto;
using UserManagementApp.Entities;

namespace UserManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<User> _passwordHasher = new();

        public AuthController(UserDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

            _context.Users.Add(user);

            try
            {
                await _context.SaveChangesAsync();

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
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            if (user.Status == "blocked")
                return BadRequest(new { message = "User has been blocked" });

            if (user.Status == "unverified")
                user.Status = "active";

            await _context.SaveChangesAsync();

            return Ok(new { message = "Email confirmed, status active" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return Unauthorized("Invalid credentials");
            //if (user.Status == "blocked")
            //    return Forbid("User is blocked");
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
