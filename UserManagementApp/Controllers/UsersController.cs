using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserManagementApp.Data;
using UserManagementApp.Dto;

namespace UserManagementApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserDbContext _context;

        public UsersController(UserDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
            .OrderByDescending(u => u.LastLogin)
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.LastLogin,
                u.Status
            })
            .ToListAsync();

            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> ExecuteUserAction([FromBody] UserActionDto dto)
        {
            if (dto.UserIds == null || !dto.UserIds.Any())
            {
                return BadRequest(new { message = "No users selected" });
            }

            var users = await _context.Users.Where(u => dto.UserIds.Contains(u.Id)).ToListAsync();

            switch (dto.Action)
            {
                case UserAction.Block:
                    users.ForEach(u => u.Status = "blocked");
                    break;
                case UserAction.Unblock:
                    users.ForEach(u => u.Status = "active");
                    break;
                case UserAction.Delete:
                    _context.Users.RemoveRange(users);
                    break;
                case UserAction.DeleteUnverified:
                    _context.Users.RemoveRange(users.Where(u => u.Status == "unverified"));
                    break;
                default:
                    return BadRequest(new { message = "Invalid action" });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Action completed successfully" });
        }
    }
}
