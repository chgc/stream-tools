using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.WindowsAzure.Storage.Blob;
using stream_tools.Models;

namespace stream_tools.Controllers
{
  [Route("api/caption")]
  [ApiController]
  [Authorize]
  public class ApiCaptionController : ControllerBase
  {
    private readonly StreamDbContext _dbContext;    
    public ApiCaptionController(StreamDbContext DbContext)
    {
      _dbContext = DbContext;      
    }

    [HttpGet("list")]
    public IQueryable<Caption> GetCaptions()
    {
     var  uid = HttpContext.User.FindFirst("user_id");
      return _dbContext.Captions.Where(x => x.Uid == uid.Value);
    }

    [HttpPost("create")]
    public async Task CreateCaptions(Caption item)
    {
      if (ModelState.IsValid)
      {
        var uid = HttpContext.User.FindFirst("user_id");
        item.Uid = uid.Value;
        _dbContext.Captions.Add(item);
        await _dbContext.SaveChangesAsync();
      }
    }

    [HttpPut("update/{id}")]
    public async Task UpdateCaptions(int id, Caption item)
    {
      var _caption = await _dbContext.Captions.FindAsync(id);
      if (_caption != null)
      {
        _dbContext.Captions.Attach(item);
        await _dbContext.SaveChangesAsync();
      }
    }

    [HttpDelete("remove/{id}")]
    public async Task RemoveCaptions(int id)
    {
      var _caption = await _dbContext.Captions.FindAsync(id);
      if (_caption != null)
      {
        _dbContext.Remove(_caption);
        await _dbContext.SaveChangesAsync();
      }
    }

    [HttpGet("areaPosition")]
    public async Task<AreaPosition> GetAreaPosition()
    {
      var uid = HttpContext.User.FindFirst("user_id");
      return await _dbContext.EnvSettings.Select(x => new AreaPosition()
      {
        Id = x.Id,
        Uid = x.Uid,
        MaxHeight = x.MaxHeight,
        MaxWidth = x.MaxWidth,
        StartX = x.StartX,
        StartY = x.StartY
      }).FirstOrDefaultAsync(x => x.Uid == uid.Value);
    }

    [HttpPost("areaPosition")]
    public async Task UpdateAreaPosition(AreaPosition model)
    {
      var uid = HttpContext.User.FindFirst("user_id");
      if (ModelState.IsValid)
      {
        var _envSetting = await _dbContext.EnvSettings.FirstOrDefaultAsync(x => x.Uid == uid.Value);
        if (_envSetting == null)
        {
          _dbContext.EnvSettings.Add(new EnvSetting()
          {
            Uid = uid.Value,
            MaxHeight = model.MaxHeight,
            MaxWidth = model.MaxWidth,
            StartX = model.StartX,
            StartY = model.StartY
          });
        }
        else
        {
          _envSetting.MaxHeight = model.MaxHeight;
          _envSetting.MaxWidth = model.MaxWidth;
          _envSetting.StartX = model.StartX;
          _envSetting.StartY = model.StartY;
        }
        await _dbContext.SaveChangesAsync();
      }
    }

    [HttpGet("customCSS")]
    public async Task<CustomCSS> GetCustomCSS()
    {
      var uid = HttpContext.User.FindFirst("user_id");
      return await _dbContext.EnvSettings.Select(x => new CustomCSS()
      {
        Id = x.Id,
        Uid = x.Uid,
        CssStyle = x.CssStyle
      }).FirstOrDefaultAsync(x => x.Uid == uid.Value);
    }

    [HttpPost("customCSS")]
    public async Task UpdateCustomCSS(CustomCSS model)
    {
      var uid = HttpContext.User.FindFirst("user_id");
      if (ModelState.IsValid)
      {
        var _envSetting = await _dbContext.EnvSettings.FirstOrDefaultAsync(x => x.Uid == uid.Value);
        if (_envSetting == null)
        {
          _dbContext.EnvSettings.Add(new EnvSetting()
          {
            Uid = uid.Value,
            CssStyle = model.CssStyle
          });
        }
        else
        {
          _envSetting.CssStyle = model.CssStyle;
        }
        await _dbContext.SaveChangesAsync();
      }
    }

    [HttpGet("connectionInfo")]
    public async Task<Models.ConnectionInfo> GetConnectionInfo()
    {
      var uid = HttpContext.User.FindFirst("user_id");
      return await _dbContext.ConnectionInfos.FirstOrDefaultAsync(x => x.Uid == uid.Value);
    }

    [HttpPost("connectionInfo")]
    public async Task UpdateConnectionInfo(Models.ConnectionInfo model)
    {
      var uid = HttpContext.User.FindFirst("user_id");
      if (ModelState.IsValid)
      {
        var _connectionInfo = await _dbContext.ConnectionInfos.FirstOrDefaultAsync(x => x.Uid == uid.Value);
        if (_connectionInfo == null)
        {
          _dbContext.Add(new Models.ConnectionInfo()
          {
            Uid = uid.Value,
            Host = model.Host,
            Port = model.Port
          });
        }
        else
        {
          _connectionInfo.Host = model.Host;
          _connectionInfo.Port = model.Port;
        }
        await _dbContext.SaveChangesAsync();
      }
    }
  }
}
