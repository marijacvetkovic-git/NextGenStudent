using System.ComponentModel.DataAnnotations;

namespace Models;
public class Oglas
{
    [Key]
    public int OID { get; set; }

    public DateTime Datum { get; set; }
    public string? Opis {get; set;}
    
    public Student? StudentOglas { get; set; }


}