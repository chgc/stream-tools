using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace stream_tools.Models
{
  public class EnvSetting
  {
    public int Id { get; set; }
    [StringLength(100)]
    public string Uid { get; set; }
    public decimal MaxHeight { get; set; }
    public decimal MaxWidth { get; set; }
    public decimal StartX { get; set; }
    public decimal StartY { get; set; }
    [StringLength(2000)]
    public string CssStyle { get; set; }
  }
}
