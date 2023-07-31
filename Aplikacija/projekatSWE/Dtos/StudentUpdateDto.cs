using Models;

namespace projekatSWE.Dtos
{
    public class StudentUpdateDto
    {
       public int CID { get; set; }
       public string? Ime { get; set; }
       public string? Prezime { get; set; }
       public Pol Polic { get; set; }
       public string? Username { get; set; }
       public string? Opis { get; set; }

       public int? Idfaksa { get; set; }
       public string? Grad { get; set; }
       public int GodinaStudija { get; set; }
       public TipStudija TipStudija { get; set; }
    }
}