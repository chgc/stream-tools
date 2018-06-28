using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace stream_tools.Models
{
    public class PrizeDrawHistory
    {
        public int Id { get; set; }
        public string Uid { get; set; }
        public string EventTitle { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Keyword { get; set; }
        public string JoinPlayers { get; set; }
        public ICollection<PrizeDrawDetail> PrizeDetails { get; set; }
    }
}
