using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models;
public class Profesor: Clan
{

    public string? NastavnoZvanje { get; set; }

    public string? Obrazovanje { get; set; }

    public List<Komentar>? ProfaKomentar{get;set;}
    [JsonIgnore]
    public Raspored? ProfesorRaspored { get; set;}

    public int? RasporedForeignKey {get; set;}

    public List<Predmet>? ProfPredmet { get; set; }
    public List<Ocena>? ProfOcene { get; set; }

    public double ocenaProsek { get; set; }

   

}