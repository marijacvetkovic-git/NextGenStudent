using Microsoft.EntityFrameworkCore;
namespace Models
{ 
    public class Context : DbContext
    {
         public DbSet<Administrator>? Administratori { get; set; }
        public DbSet<Cas>? Casi { get; set; }  
        public DbSet<Clan>? Clanovi { get; set; }   
        public DbSet<Fakultet>? Fakulteti { get; set; }
        public DbSet<Oglas>? Oglasi{ get; set; }
        public DbSet<OglasZaCimera>? OglasZaCimere { get; set; }
        public DbSet<OglasZaStudyBuddy>? OglasZaStudyBuddies { get; set; }
        public DbSet<OglasZaTutora>? OglasZaTutore{ get; set; }
        public DbSet<Predmet>? Predmeti { get; set; }
        public DbSet<Profesor>? Profesori { get; set; }
        public DbSet<Student>? Studenti { get; set; }
         public DbSet<Raspored>? Rasporedi { get; set; }
         public DbSet<Komentar>? Komentari {get;set;}
        public DbSet<Ocena>? Ocene {get; set;}
        public DbSet<Message>? Messages {get; set;}

        public DbSet<Prijava>? Prijave { get; set; }
  
        public Context(DbContextOptions<Context> options) : base (options)
        {

        }
         protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("nextGenCStud");
            optionsBuilder.UseSqlServer(connectionString);
        }
            protected override void OnModelCreating (ModelBuilder modelbuider)
        {
            base.OnModelCreating(modelbuider);
            modelbuider.Entity<Raspored>()
            .HasOne(b=>b.RasporedProfesor)
            .WithOne(p=>p.ProfesorRaspored)
            .HasForeignKey<Profesor>(b => b.RasporedForeignKey);

             modelbuider
             .Entity<Cas>()
             .HasOne(p => p.CasStudent)
             .WithMany(p => p.StudentCas);
            modelbuider
             .Entity<OglasZaTutora>()
             .HasOne(p => p.TutorPredmet)
             .WithMany(p => p.PredmetOglasZaTutora);
              modelbuider
             .Entity<OglasZaStudyBuddy>()
             .HasOne(p => p.Predmet)
             .WithMany(p => p.PredmetOglasZaBuddy);

             modelbuider
             .Entity<Predmet>()
             .HasMany(p => p.PredmetProf)
             .WithMany(p => p.ProfPredmet)
             .UsingEntity(j => j.ToTable("ProfIPredmet"));

     

         
            
        }
   
        /* 
        modelBuilder
    .Entity<Post>()
    .HasMany(p => p.Tags)
    .WithMany(p => p.Posts)
    .UsingEntity(j => j.ToTable("PostTags"));
        */


    }

}