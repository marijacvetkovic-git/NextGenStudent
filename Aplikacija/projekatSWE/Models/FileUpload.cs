using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models;
public class FileUpload
{
    public IFormFile? Slika {get; set; }
}