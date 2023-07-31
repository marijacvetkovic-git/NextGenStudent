using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models;
public enum TipStudija
{
    Osnovne,
    Master,
    Doktorske
}
public class Student: Clan
{
    public List<Fakultet>? NazivFakulteta { get; set; }

    public string? Grad { get; set; }

    public int GodinaStudija { get; set; } //u front namesti

    public TipStudija Studija { get; set; }
    
    [JsonIgnore]
    public List<Oglas>? StudentOglas { get; set;}

    public List<Cas>? StudentCas {get; set;}

    public List <Komentar>? StudentKomentar {get; set;}

    public List <Ocena>? StudentOcenio { get; set; }


}