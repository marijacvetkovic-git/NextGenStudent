using System.ComponentModel.DataAnnotations;
using Models;
    public class Ocena
    {
        [Key]
        public int idOcene {get; set; }
        public int ocena { get; set; }
        public Profesor? prof {get; set; }
        public Student? stud { get; set; }
    }