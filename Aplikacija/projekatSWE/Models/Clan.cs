using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models;
public enum Pol
{
    Muski,
    Zenski
}

public enum Role
{
    Student,
    Profesor,
    Administrator

}

public class Clan
{
    [Key]
    public int CID { get; set; }

    public string? Ime {get; set;}
    public string? Prezime {get;set;}
    public string? Slika {get; set;}

   [NotMapped]
   public FileUpload? ImageFile { get; set; }

   [NotMapped]
   public string? ImageSrc { get; set; }

    [Required]
    [MaxLength(20)]
    public string?  Username { get; set; }

   [JsonIgnore]
    public byte[]? PasswordHash {get; set;}

   [JsonIgnore]
    public byte[]? PasswordSalt { get; set; }


    [RegularExpression("^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$", ErrorMessage = "E-mail is not valid")]
    public string? Email { get; set; }

    public Pol Polic { get; set; }


    public DateTime DatumRodjenja { get; set; }

 
    public string? Opis { get; set; }

    public bool Banovan {get; set;}

    public Role Uloga { get; set;}

    




 //   public string PhotoPath { get ; set ;}// ce menjamo ako ne valja

}
