using System.ComponentModel.DataAnnotations.Schema;
using Models;
namespace Dtos{

public class RegisterProfessor
{
public string? Ime {get; set;}
public string? Prezime {get;set;}
public string?  Username { get; set; }
public string? Password {get; set;}
public string? Email { get; set; }
public Pol Polic { get; set; }
public DateTime DatumRodjenja { get; set; }
public string? Opis { get; set; }
 public string? NastavnoZvanje { get; set; }
public string? Obrazovanje { get; set; }

}
}