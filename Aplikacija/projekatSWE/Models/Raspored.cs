using System.ComponentModel.DataAnnotations;

namespace Models;
public class Raspored
{
    [Key]
    public int RID { get; set;}

    public List<Cas>? RasporedCas {get; set;}
    
    [Required]
    public Profesor? RasporedProfesor {get; set;}

}