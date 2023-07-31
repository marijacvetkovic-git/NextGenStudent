using System.ComponentModel.DataAnnotations;

namespace Models;
public class Komentar
{
    [Key]
    public int idKomentara {get; set;}
    public string? Tekst {get; set;}
    public DateTime datumPostavljanja { get; set; }
    public Profesor? KomentarProfa {get; set;}
    public Student? KomentarStudent {get; set;}

}