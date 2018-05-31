using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using stream_tools.Models;

namespace stream_tools.Controllers
{
  [Route("[controller]/[action]")]
  public class AccountController : Controller
  {
    private readonly SignInManager<ApplicationUser> _signInManager;

    [TempData]
    public string ErrorMessage { get; set; }

    public AccountController(SignInManager<ApplicationUser> signInManager)
    {
      _signInManager = signInManager;
    }
    public IActionResult Login()
    {
      ViewData["ReturnUrl"] = @"https://localhost:5001/Account/ExternalLoginCallback";
      return View();
    }

    /// <summary>
    /// 執行第三方登入動作的啟動點
    /// </summary>
    /// <param name="provider"></param>
    /// <param name="returnUrl"></param>
    /// <returns></returns>
    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public IActionResult ExternalLogin(string provider, string returnUrl = null)
    {
      // Request a redirect to the external login provider.
      var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Account", new { returnUrl });
      var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
      return Challenge(properties, provider);
    }

    /// <summary>
    /// 當 Google Auth 登入成功後，回來的進入點
    /// </summary>
    /// <param name="returnUrl"></param>
    /// <param name="remoteError"></param>
    /// <returns></returns>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null)
    {
      if (remoteError != null)
      {
        ErrorMessage = $"Error from external provider: {remoteError}";
        return RedirectToAction(nameof(Login));
      }
      var info = await _signInManager.GetExternalLoginInfoAsync();
      if (info == null)
      {
        return RedirectToAction(nameof(Login));
      }

      // Sign in the user with this external login provider if the user already has a login.
      var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);
      if (result.Succeeded)
      {
        return RedirectToLocal(returnUrl);
      }
      if (result.IsLockedOut)
      {
        return RedirectToAction(nameof(Lockout));
      }
      else
      {
        // If the user does not have an account, then ask the user to create an account.
        ViewData["ReturnUrl"] = returnUrl;
        ViewData["LoginProvider"] = info.LoginProvider;
        var email = info.Principal.FindFirstValue(ClaimTypes.Email);
        return View("ExternalLogin", new ExternalLoginViewModel { Email = email });
      }
    }

    [HttpGet]
    [AllowAnonymous]
    public IActionResult Lockout()
    {
      return View();
    }

    private IActionResult RedirectToLocal(string returnUrl)
    {
      if (Url.IsLocalUrl(returnUrl))
      {
        return Redirect(returnUrl);
      }
      else
      {
        return RedirectToAction(nameof(AccountController.Login), "Account");
      }
    }
  }
}
