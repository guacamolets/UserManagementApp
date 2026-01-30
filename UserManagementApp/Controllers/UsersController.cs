using Microsoft.AspNetCore.Mvc;

namespace UserManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        [HttpGet(Name = "GetUsers")]
        public IEnumerable<IActionResult> GetUsers()
        {
            return new List<IActionResult>
            {
                Ok(new { Id = 1, Name = "Alice", Age = 30 }),
                Ok(new { Id = 2, Name = "Bob", Age = 25 }),
                Ok(new { Id = 3, Name = "Charlie", Age = 35 })
            };
        }
    }
}
