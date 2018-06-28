using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace stream_tools.Models
{
  public class ConnectionInfo
  {
    public int Id { get; set; }
    [StringLength(100)]
    public string Uid { get; set; }
    [StringLength(100)]
    public string Host { get; set; }
    [StringLength(10)]
    public string Port { get; set; }
  }
}
