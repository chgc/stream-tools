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
    private readonly SignInManager<ApplicationUser> _signInManager;

    public AccountController(SignInManager<ApplicationUser> signInManager)
    {
      _signInManager = signInManager;
    }

    [HttpGet("Login")]
    public IActionResult Login()
    {
      return Json(false);
    }

    [Authorize]
    [HttpGet("/api/account/test")]
    public IActionResult Test()
    {
      return Json(true);
    }

  }
}
