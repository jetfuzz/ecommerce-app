using backend.Data;
using backend.DTOs.Auth;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TokenService _tokenService;
        private readonly ApplicationDbContext _context;

        public AuthController(TokenService tokenService, ApplicationDbContext context)
        {
            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {

            var email = registerDto.Email.Trim().ToLowerInvariant();
            var username = registerDto.Username.Trim();

            if (await _context.Users.AnyAsync(u => u.Email == email))
            {
                return Conflict(new { message = "Email already exists" });
            }

            if (await _context.Users.AnyAsync(u => u.Username == username))
            {
                return Conflict(new { message = "Username already exists" });
            }

            var hasher = new PasswordHasher<User>();
            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = hasher.HashPassword(null!, registerDto.Password),
                Role = UserRole.User,
            };

            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Conflict(new { message = "An error occurred while registering the user" });
            }

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email.Trim().ToLowerInvariant());
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, loginDto.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var token = _tokenService.GenerateToken(user);
            var dto = new LoginResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Role = user.Role.ToString(),
                },
            };
            return Ok(dto);
        }
    }
}
