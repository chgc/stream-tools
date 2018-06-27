using System;
using System.Collections.Generic;

namespace stream_tools.Models
{
    public class GameInfo
    {
        public string eventTitle { get; set; }
        public string keyword { get; set; }
        public DateTime? startTime { get; set; }
        public DateTime? endTime { get; set; }
        public List<winnerInfo> winners { get; set; }
        public List<string> nameList { get; set; }
    }

    public class winnerInfo
    {
        public string winner { get; set; }
        public string prize { get; set; }
    }
}
