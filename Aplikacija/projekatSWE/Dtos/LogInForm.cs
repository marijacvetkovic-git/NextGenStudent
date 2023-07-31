using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Dtos
{
    public class LogInForm
    {
        [Key]
        public string? Username { get; set; }= string.Empty;
       // [JsonIgnore]
        public string? Password {get; set;}
        // public string? RefreshToken { get; set; } 
        // public DateTime TokenCreated { get; set; }
        // public DateTime TokenExpires { get; set; }
    
    }
}