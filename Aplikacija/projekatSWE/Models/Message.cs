using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System;

namespace Models{
    public class Message{
      [Key]
       public int ID { get; set;}

       public int PrimaocId { get; set; }
       public int PosiljaocId { get; set; }
       public string? Tekst { get; set; }
       public DateTime? Vreme { get; set;}
    }
}
