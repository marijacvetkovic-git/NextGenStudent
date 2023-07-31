using System.ComponentModel.DataAnnotations;

namespace Models;

public class OglasZaTutora:Oglas
{
    public int GodinaStudija { get; set; }
    public TipStudija TutorStudije { get; set;}

    public Predmet? TutorPredmet {get; set;}

}