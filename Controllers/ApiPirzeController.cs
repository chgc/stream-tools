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
    [Route("api/prize")]
    [ApiController]
    [Authorize]
    public class ApiPrizeController : ControllerBase
    {
        private readonly StreamDbContext _dbContext;
        public ApiPrizeController(StreamDbContext DbContext)
        {
            _dbContext = DbContext;
        }

        [HttpPost("create")]
        public async Task CreatePrizeDrawHistory(PrizeDrawHistory item)
        {
            if (ModelState.IsValid)
            {
                var uid = HttpContext.User.FindFirst("user_id");
                item.Uid = uid.Value;
                _dbContext.Add(item);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
