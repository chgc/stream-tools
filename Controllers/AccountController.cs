using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using stream_tools.Models;

namespace stream_tools.Controllers
{

  [Route("[controller]")]
  public class AccountController : Controller
  {    
    private readonly UserManager<ApplicationUser> _userManager;    

    public AccountController(UserManager<ApplicationUser> userManager)
    {
      _userManager = userManager;
    }

    [HttpGet("Login")]
    public IActionResult Login()
    {
      return Json(false);
    }

    [Authorize]
    [HttpGet("/api/account/signup")]
    public async Task<IActionResult> SignUp()
    {
      var tokenInfo = HttpContext.User;

      var uid = tokenInfo.FindFirst("user_id");
      var name = tokenInfo.FindFirst("name");
      var email = tokenInfo.FindFirst(ClaimTypes.Email);
      var user = await _userManager.FindByIdAsync(uid.Value);
      if (user == null)
      {
        user = new ApplicationUser()
        {
          Id = uid.Value,
          UserName = uid.Value,
          DisplayName = name.Value,
          Email = email.Value
        };
        var result =
          await _userManager.CreateAsync(user, Convert.ToBase64String(Guid.NewGuid().ToByteArray()).Substring(0, 8));
        if (!result.Succeeded)
        {
          return BadRequest("");
        }
      }
      else
      {
        if (name.Value != user.DisplayName)
        {
          user.DisplayName = name.Value;
          await _userManager.UpdateAsync(user);
        }
      }
      return Json(true);
    }

  }
}
