using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using stream_tools.Models;

namespace stream_tools
{
  public class StreamDbContext : IdentityDbContext<ApplicationUser>

  {
    public StreamDbContext(DbContextOptions<StreamDbContext> options) : base(options) { }

  }
}
