using System.ComponentModel.DataAnnotations;

public class Prijava{
    [Key]
    public int idPrijave { get; set; }
    public string? Razlog { get; set; }
    public string? UsernamePrijavljenog { get; set; }
    public string? UsernameKoJe { get; set; }
    public bool provereno { get; set; }
}