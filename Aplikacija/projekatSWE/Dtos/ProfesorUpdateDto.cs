using Models;

namespace projekatSWE.Dtos
{
    public class ProfesorUpdateDto
    {
       public int CID { get; set; }
       public string? Ime { get; set; }
       public string? Prezime { get; set; }
       public Pol Polic { get; set; }
       public string? Username { get; set; }
       public string? Opis { get; set; }
       public string? NastavnoZvanje { get; set; }
       public string? Obrazovanje { get; set; }
       public int PredmetId { get; set; }


    }
}