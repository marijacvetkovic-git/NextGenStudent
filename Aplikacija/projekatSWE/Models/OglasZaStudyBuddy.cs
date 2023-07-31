using System.ComponentModel.DataAnnotations;

namespace Models;

public class OglasZaStudyBuddy:Oglas
{
    public string? GodinaStudija { get; set;}

    public TipStudija BuddyStudije {get; set;}
 
    public Predmet? Predmet {get; set;}


}