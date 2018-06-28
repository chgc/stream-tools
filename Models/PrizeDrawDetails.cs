using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace stream_tools.Models
{
    public class PrizeDrawDetail
    {
        public int Id { get; set; }
        public int PrizeDrawHistoryId { get; set; }
        public string Winner { get; set; }
        public string Prize { get; set; }
    }
}
