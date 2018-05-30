using Microsoft.EntityFrameworkCore;

namespace stream_tools
{
    public class StreamContext : DbContext
    {
        public StreamContext(DbContextOptions<StreamContext> options) : base(options) { }
    }
}
