using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models;
public class Predmet
{
    [Key]
    public int ID { get; set; }
    [Required]
    public string? Naziv {get; set;}

    [Required]
    public Fakultet? PredmetFakultet {get; set;}
  [JsonIgnore]
    [Required]
    public List<Profesor>? PredmetProf { get; set; }
    //  [JsonIgnore]
    public List<OglasZaStudyBuddy>? PredmetOglasZaBuddy {get; set;}
      [JsonIgnore]
    public List<OglasZaTutora>? PredmetOglasZaTutora {get; set;}
      [JsonIgnore]
    public List <Cas>? PredmetCas {get; set;}

    //treba li da ima listu casova? ili preko Profe




}