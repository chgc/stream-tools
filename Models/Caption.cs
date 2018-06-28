using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace stream_tools.Models
{
  public class Caption
  {
    public int Id { get; set; }
    [StringLength(100)]
    public string Uid { get; set; }
    [StringLength(100)]
    public string ColorClass { get; set; }
    [StringLength(100)]
    public string DisplayClass { get; set; }
    [StringLength(100)]
    public string Label { get; set; }
    [StringLength(1000)]
    public string Style { get; set; }
    [StringLength(100)]
    public string Value { get; set; }
  }
}
