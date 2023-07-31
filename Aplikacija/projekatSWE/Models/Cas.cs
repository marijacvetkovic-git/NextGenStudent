using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models;
public class Cas
{
    [Key]
    public int CASID {get; set;}

    public DateTime Pocetak { get; set; }

    public DateTime Zavrsetak { get; set; }

    public int Cena { get; set; }    

    public bool Zakazan {get; set;}

    public Predmet? CasPredmet {get; set;}//dodala

    public Student? CasStudent {get; set;}
    [JsonIgnore]
    public Raspored? CasRaspored {get; set;}

}