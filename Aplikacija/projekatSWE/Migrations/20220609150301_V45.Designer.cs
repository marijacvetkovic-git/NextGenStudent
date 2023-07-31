﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Models;

#nullable disable

namespace projekatSWE.Migrations
{
    [DbContext(typeof(Context))]
    [Migration("20220609150301_V45")]
    partial class V45
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("CasStudent", b =>
                {
                    b.Property<int>("CasStudentCID")
                        .HasColumnType("int");

                    b.Property<int>("StudentCasCASID")
                        .HasColumnType("int");

                    b.HasKey("CasStudentCID", "StudentCasCASID");

                    b.HasIndex("StudentCasCASID");

                    b.ToTable("StudenICas", (string)null);
                });

            modelBuilder.Entity("FakultetStudent", b =>
                {
                    b.Property<int>("FakultetStudentCID")
                        .HasColumnType("int");

                    b.Property<int>("NazivFakultetaFID")
                        .HasColumnType("int");

                    b.HasKey("FakultetStudentCID", "NazivFakultetaFID");

                    b.HasIndex("NazivFakultetaFID");

                    b.ToTable("FakultetStudent");
                });

            modelBuilder.Entity("Models.Cas", b =>
                {
                    b.Property<int>("CASID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CASID"), 1L, 1);

                    b.Property<int>("CasPredmetID")
                        .HasColumnType("int");

                    b.Property<int?>("CasRasporedRID")
                        .HasColumnType("int");

                    b.Property<int>("Cena")
                        .HasColumnType("int");

                    b.Property<DateTime>("Pocetak")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("Zavrsetak")
                        .HasColumnType("datetime2");

                    b.HasKey("CASID");

                    b.HasIndex("CasPredmetID");

                    b.HasIndex("CasRasporedRID");

                    b.ToTable("Casi");
                });

            modelBuilder.Entity("Models.Clan", b =>
                {
                    b.Property<int>("CID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CID"), 1L, 1);

                    b.Property<bool>("Banovan")
                        .HasColumnType("bit");

                    b.Property<DateTime>("DatumRodjenja")
                        .HasColumnType("datetime2");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Ime")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Opis")
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte[]>("PasswordHash")
                        .HasColumnType("varbinary(max)");

                    b.Property<byte[]>("PasswordSalt")
                        .HasColumnType("varbinary(max)");

                    b.Property<int>("Polic")
                        .HasColumnType("int");

                    b.Property<string>("Prezime")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Slika")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Uloga")
                        .HasColumnType("int");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("CID");

                    b.ToTable("Clanovi");

                    b.HasDiscriminator<string>("Discriminator").HasValue("Clan");
                });

            modelBuilder.Entity("Models.Fakultet", b =>
                {
                    b.Property<int>("FID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("FID"), 1L, 1);

                    b.Property<string>("Grad")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Naziv")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("FID");

                    b.ToTable("Fakulteti");
                });

            modelBuilder.Entity("Models.Komentar", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"), 1L, 1);

                    b.Property<int?>("KomentarProfaCID")
                        .HasColumnType("int");

                    b.Property<int?>("KomentarStudentCID")
                        .HasColumnType("int");

                    b.Property<string>("Komentarcic")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Rate")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("KomentarProfaCID");

                    b.HasIndex("KomentarStudentCID");

                    b.ToTable("Komentari");
                });

            modelBuilder.Entity("Models.Oglas", b =>
                {
                    b.Property<int>("OID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OID"), 1L, 1);

                    b.Property<DateTime>("Datum")
                        .HasColumnType("datetime2");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Opis")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("StudentOglasCID")
                        .HasColumnType("int");

                    b.HasKey("OID");

                    b.HasIndex("StudentOglasCID");

                    b.ToTable("Oglasi");

                    b.HasDiscriminator<string>("Discriminator").HasValue("Oglas");
                });

            modelBuilder.Entity("Models.Predmet", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"), 1L, 1);

                    b.Property<string>("Naziv")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PredmetFakultetFID")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("PredmetFakultetFID");

                    b.ToTable("Predmeti");
                });

            modelBuilder.Entity("Models.Raspored", b =>
                {
                    b.Property<int>("RID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RID"), 1L, 1);

                    b.HasKey("RID");

                    b.ToTable("Rasporedi");
                });

            modelBuilder.Entity("PredmetProfesor", b =>
                {
                    b.Property<int>("PredmetProfCID")
                        .HasColumnType("int");

                    b.Property<int>("ProfPredmetID")
                        .HasColumnType("int");

                    b.HasKey("PredmetProfCID", "ProfPredmetID");

                    b.HasIndex("ProfPredmetID");

                    b.ToTable("ProfIPredmet", (string)null);
                });

            modelBuilder.Entity("Models.Administrator", b =>
                {
                    b.HasBaseType("Models.Clan");

                    b.Property<string>("Broj")
                        .HasColumnType("nvarchar(max)");

                    b.HasDiscriminator().HasValue("Administrator");
                });

            modelBuilder.Entity("Models.OglasZaCimera", b =>
                {
                    b.HasBaseType("Models.Oglas");

                    b.Property<int>("BrojCimera")
                        .HasColumnType("int");

                    b.Property<string>("Grad")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SlikeStana")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Stan")
                        .HasColumnType("bit");

                    b.HasDiscriminator().HasValue("OglasZaCimera");
                });

            modelBuilder.Entity("Models.OglasZaStudyBuddy", b =>
                {
                    b.HasBaseType("Models.Oglas");

                    b.Property<int>("BuddyStudije")
                        .HasColumnType("int");

                    b.Property<string>("GodinaStudija")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("PredmetID")
                        .HasColumnType("int");

                    b.HasIndex("PredmetID");

                    b.HasDiscriminator().HasValue("OglasZaStudyBuddy");
                });

            modelBuilder.Entity("Models.OglasZaTutora", b =>
                {
                    b.HasBaseType("Models.Oglas");

                    b.Property<int>("GodinaStudija")
                        .HasColumnType("int")
                        .HasColumnName("OglasZaTutora_GodinaStudija");

                    b.Property<int?>("TutorPredmetID")
                        .HasColumnType("int");

                    b.Property<int>("TutorStudije")
                        .HasColumnType("int");

                    b.HasIndex("TutorPredmetID");

                    b.HasDiscriminator().HasValue("OglasZaTutora");
                });

            modelBuilder.Entity("Models.Profesor", b =>
                {
                    b.HasBaseType("Models.Clan");

                    b.Property<string>("NastavnoZvanje")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Obrazovanje")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("RasporedForeignKey")
                        .HasColumnType("int");

                    b.HasIndex("RasporedForeignKey")
                        .IsUnique()
                        .HasFilter("[RasporedForeignKey] IS NOT NULL");

                    b.HasDiscriminator().HasValue("Profesor");
                });

            modelBuilder.Entity("Models.Student", b =>
                {
                    b.HasBaseType("Models.Clan");

                    b.Property<int>("GodinaStudija")
                        .HasColumnType("int");

                    b.Property<string>("Grad")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Studija")
                        .HasColumnType("int");

                    b.HasDiscriminator().HasValue("Student");
                });

            modelBuilder.Entity("CasStudent", b =>
                {
                    b.HasOne("Models.Student", null)
                        .WithMany()
                        .HasForeignKey("CasStudentCID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Models.Cas", null)
                        .WithMany()
                        .HasForeignKey("StudentCasCASID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("FakultetStudent", b =>
                {
                    b.HasOne("Models.Student", null)
                        .WithMany()
                        .HasForeignKey("FakultetStudentCID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Models.Fakultet", null)
                        .WithMany()
                        .HasForeignKey("NazivFakultetaFID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Models.Cas", b =>
                {
                    b.HasOne("Models.Predmet", "CasPredmet")
                        .WithMany("PredmetCas")
                        .HasForeignKey("CasPredmetID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Models.Raspored", "CasRaspored")
                        .WithMany("RasporedCas")
                        .HasForeignKey("CasRasporedRID");

                    b.Navigation("CasPredmet");

                    b.Navigation("CasRaspored");
                });

            modelBuilder.Entity("Models.Komentar", b =>
                {
                    b.HasOne("Models.Profesor", "KomentarProfa")
                        .WithMany("ProfaKomentar")
                        .HasForeignKey("KomentarProfaCID");

                    b.HasOne("Models.Student", "KomentarStudent")
                        .WithMany("StudentKomentar")
                        .HasForeignKey("KomentarStudentCID");

                    b.Navigation("KomentarProfa");

                    b.Navigation("KomentarStudent");
                });

            modelBuilder.Entity("Models.Oglas", b =>
                {
                    b.HasOne("Models.Student", "StudentOglas")
                        .WithMany("StudentOglas")
                        .HasForeignKey("StudentOglasCID");

                    b.Navigation("StudentOglas");
                });

            modelBuilder.Entity("Models.Predmet", b =>
                {
                    b.HasOne("Models.Fakultet", "PredmetFakultet")
                        .WithMany("FakultetPredmet")
                        .HasForeignKey("PredmetFakultetFID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PredmetFakultet");
                });

            modelBuilder.Entity("PredmetProfesor", b =>
                {
                    b.HasOne("Models.Profesor", null)
                        .WithMany()
                        .HasForeignKey("PredmetProfCID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Models.Predmet", null)
                        .WithMany()
                        .HasForeignKey("ProfPredmetID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Models.OglasZaStudyBuddy", b =>
                {
                    b.HasOne("Models.Predmet", "Predmet")
                        .WithMany("PredmetOglasZaBuddy")
                        .HasForeignKey("PredmetID");

                    b.Navigation("Predmet");
                });

            modelBuilder.Entity("Models.OglasZaTutora", b =>
                {
                    b.HasOne("Models.Predmet", "TutorPredmet")
                        .WithMany("PredmetOglasZaTutora")
                        .HasForeignKey("TutorPredmetID");

                    b.Navigation("TutorPredmet");
                });

            modelBuilder.Entity("Models.Profesor", b =>
                {
                    b.HasOne("Models.Raspored", "ProfesorRaspored")
                        .WithOne("RasporedProfesor")
                        .HasForeignKey("Models.Profesor", "RasporedForeignKey");

                    b.Navigation("ProfesorRaspored");
                });

            modelBuilder.Entity("Models.Fakultet", b =>
                {
                    b.Navigation("FakultetPredmet");
                });

            modelBuilder.Entity("Models.Predmet", b =>
                {
                    b.Navigation("PredmetCas");

                    b.Navigation("PredmetOglasZaBuddy");

                    b.Navigation("PredmetOglasZaTutora");
                });

            modelBuilder.Entity("Models.Raspored", b =>
                {
                    b.Navigation("RasporedCas");

                    b.Navigation("RasporedProfesor")
                        .IsRequired();
                });

            modelBuilder.Entity("Models.Profesor", b =>
                {
                    b.Navigation("ProfaKomentar");
                });

            modelBuilder.Entity("Models.Student", b =>
                {
                    b.Navigation("StudentKomentar");

                    b.Navigation("StudentOglas");
                });
#pragma warning restore 612, 618
        }
    }
}
