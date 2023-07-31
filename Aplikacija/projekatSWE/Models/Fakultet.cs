using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models;
public class Fakultet
{
    [Key]
    public int FID { get; set; }
    [Required]
    public string? Grad {get; set;}
    [Required]
    public string? Naziv {get; set;}
    
    [Required]
    [JsonIgnore]
    public List <Predmet>? FakultetPredmet {get; set;}
[JsonIgnore]
    public List<Student>? FakultetStudent {get; set;}

}