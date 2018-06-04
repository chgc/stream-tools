using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace stream_tools.Models
{
  public class AreaPosition
  {
    public int Id { get; set; }
    public string Uid { get; set; }
    public decimal? MaxHeight { get; set; }
    public decimal? MaxWidth { get; set; }
    public decimal? StartX { get; set; }
    public decimal? StartY { get; set; }
  }
}
