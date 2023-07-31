using System.ComponentModel.DataAnnotations.Schema;
using Models;
namespace Dtos
{

public class OglasZaCimeraDto
{
    public int StudentId {get;set;}
    public DateTime Datum { get; set; }
    public string? Opis {get; set;}
    public bool Stan { get; set; }  
    public string? Grad {get; set;}
    public int BrojCimera { get; set; }

}
}