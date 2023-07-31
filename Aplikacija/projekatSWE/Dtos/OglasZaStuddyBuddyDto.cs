using System.ComponentModel.DataAnnotations.Schema;
using Models;
namespace Dtos
{

public class OglasZaStuddyBuddyDto
{

    public int Oid { get; set; }
    public int StudentId {get;set;}

    public int PredmetId {get; set; }
    public DateTime Datum { get; set; }
    public string? Opis {get; set;}
   
    public string? GodinaStudija { get; set;}

    public TipStudija BuddyStudije {get; set;}

}
}