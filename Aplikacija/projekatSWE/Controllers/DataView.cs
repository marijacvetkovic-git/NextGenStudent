
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Models;
using projekatSWE.Controllers;

namespace projekatSWE.Controllers
{
  [Route("api/[controller]")]
    [ApiController]
    public class DataView : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public Context Context { get; set; }
        public Student? UserNameExists { get; private set; }
        public Student? student { get; private set; }

        public DataView(IConfiguration configuration, Context context)
        {
            _configuration = configuration;
            Context = context;
        }

        [HttpGet]
        [Route("DataView/{username}")]
        public async Task<ActionResult> View(string username)
        {
            var s = Context.Clanovi?.Where(p=> p.Username == username).FirstOrDefault();
            if (s == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User doesn't exists!" });
            }
            if (s.Uloga == Role.Student)
            {
                var l = Context.Studenti?.Include(p=>p.NazivFakulteta).Where(p=> p.Username == username).FirstOrDefault();
                return Ok(l);
            }
            else
            {
                var l = Context.Profesori.Where(p=> p.Username == username).FirstOrDefault(); 
                return Ok(l);
            }
        }

        [HttpGet]
        [Route("FiltersRoomate")]
        public async Task<ActionResult> FiltersRoomate()
        {
            try
            {
                //kao samo bool? ima stan nema
                //Grad?
                var list = await Context.OglasZaCimere.ToListAsync();
                return Ok(
                    list.Select(p=>
                    new{
                    p.Grad,
                    p.BrojCimera//moze i ne mora, kako frontovci kazu
                    //dodaj za lokaciju, ali ne mora filter
                    }

                    )
                );
      

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpGet]
        [Route("ReturnSchedule/{username}")]
        public async Task<ActionResult> ReturnSchedule(string username)
        {
            try
            {

                var f= Context.Profesori.Where(p=>p.Username == username).FirstOrDefault();
                if(f==null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Proffesor don't exists!" });
                }
                var sc= Context.Rasporedi.Include(p=>p.RasporedProfesor).Include(p=>p.RasporedCas).Where(p=>p.RasporedProfesor.CID==f.CID).FirstOrDefault();
               var c1 =Context.Casi.Include(p=>p.CasPredmet).Include(p=>p.CasStudent).Where(p=>p.CasRaspored==sc).ToList();
               if(c1.Count!=0){
                return Ok
                (
                    c1.Select(p=>
                    new
                    {
                        Id= p.CASID,
                        PocetakDatum = p.Pocetak.ToString("dd/MM/yyyy"),
                        PocetakVreme= p.Pocetak.ToString("HH:mm"),
                        ZavrsetakDatum= p.Zavrsetak.ToString("dd/MM/yyyy"),
                        ZavrsetakVreme= p.Zavrsetak.ToString("HH:mm"),
                        Zakazan =p.Zakazan,
                        Cena = p.Cena,
                        Predmet = p.CasPredmet?.Naziv,
                        PredmetId= p.CasPredmet?.ID,
                        Student = p.CasStudent?.Username
                    }).ToList()
                ); 
            }else{
                  return StatusCode(202,"Nema casova u rasporedu!");
            }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("ViewProfByCertainFilters/{pid}")]
        [HttpGet]
        public async Task<ActionResult> ViewProfByCertainFilters(int pid)
        {
            try
            {
                var f= await Context.Predmeti.FindAsync(pid);
                var subj = Context.Profesori.Include(p=>p.ProfPredmet).Where(p=>p.Banovan==false).ToList();

                var profe = subj.Where(p=>p.ProfPredmet.Contains(f)).ToList();
                if(profe.Count!=0){
                return Ok(
                    profe.Select(p=>
                    new{
                        ID = p.CID,
                        Ime =p.Ime,
                        Prezime = p.Prezime,
                        Username= p.Username,
                        Role= p.Uloga,
                        Opis= p.Opis,
                        NastavnoZvanje= p.NastavnoZvanje,
                        Obrazovanje= p.Obrazovanje
                    }
                    )
                );
                }
                else{
                      return StatusCode(202,"Couldn't find professors!");
                }

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

        }

        [Route("ListAllAdsForRoommate")]
        [HttpGet]
        public async Task<ActionResult> ListAllAdsForRoomates(){
        try{
            var list= await Context.OglasZaCimere.Include(p=>p.StudentOglas).Where(p=>p.StudentOglas.Banovan==false).ToListAsync();

             return Ok(
                    list.Select(p=>
                    new{
                        Oid=p.OID,
                        ID = p.StudentOglas.CID,
                        Role = p.StudentOglas.Uloga,
                        Username = p.StudentOglas.Username,
                        Opis=p.Opis,
                        Datum=p.Datum.ToString("MM/dd/yyyy H:mm"),
                        Grad=p.Grad,
                        BrojCimera=p.BrojCimera,
                        Stan=p.Stan
                    }

                    )
                );    
        }
        catch(Exception e){
            return BadRequest(e.Message);
        }
    
    }
    


        [Route("ListAllAdsForStuddyBuddy")]
        [HttpGet]
        public async Task<ActionResult> ListAllAdsForStuddyBuddy(){
        try{
            var list= await Context.OglasZaStudyBuddies.Include(p=>p.StudentOglas).Include(p=>p.Predmet).Where(p=>p.StudentOglas.Banovan==false).ToListAsync();


             return Ok(
                    list.Select(p=>
                    new{
                        Oid=p.OID,
                        ID = p.StudentOglas.CID,
                        Username = p.StudentOglas.Username,
                        Opis=p.Opis,
                        Role = p.StudentOglas.Uloga,
                        Datum=p.Datum,
                        Predmet=p.Predmet.Naziv,
                        BuddyStudije= p.BuddyStudije,
                        GodinaStudija=p.GodinaStudija,

                    }

                    )
                );    
        }
        catch(Exception e){
            return BadRequest(e.Message);
        }
    
    
    }
    
        [Route("ListAllAdsForTutors")]
        [HttpGet]
        public async Task<ActionResult> ListAllAdsForTutors(){
        try{
            var list= await Context.OglasZaTutore.Include(p=>p.StudentOglas).Include(p=>p.TutorPredmet).Where(p=>p.StudentOglas.Banovan==false).ToListAsync();

             return Ok(
                    list.Select(p=>
                    new{
                        Oid=p.OID,
                         ID = p.StudentOglas.CID,
                        Username = p.StudentOglas?.Username,
                            Role = p.StudentOglas.Uloga,
                        Opis=p.Opis,
                        Datum=p.Datum,
                        Predmet=p.TutorPredmet.Naziv,
                        TutorStudije= p.TutorStudije,
                        GodinaStudija=p.GodinaStudija   
                    }

                    )
                );    
        }
        catch(Exception e){
            return BadRequest(e.Message);
        }
    
    }

        [Route("ViewAddByCertainFiltersForRoomeate/{grad}/{brojcimera}/{stan}")]
        [HttpGet]
        public async Task<ActionResult> ViewAddByCertainFiltersForRoomeate(string grad, int brojcimera,bool stan)//kazi tei i stesji ako se nista ne izabere grad da stave ""
        {
            try
            {

                if(brojcimera<1000)
                {
                    var apartmants = Context.OglasZaCimere.Include(p=>p.StudentOglas).Where(p=>p.BrojCimera==brojcimera).Where(p=>p.StudentOglas.Banovan==false).ToList();
                    if(apartmants.Count()==0)
                    {
                        return StatusCode(202,"Trenutno ne postoje oglasi koji odgovaraju odabranom broju cimera"+apartmants.Count());
                    }

                    var m = apartmants.Where(p=>p.Grad==grad ).ToList();
                    if(m.Count()==0)
                    {
                        return StatusCode(202,"Trenutno ne postoje oglasi o cimeru u odabranom gradu za odabrani broj cimera");
                    } 
                    var s = m.Where(p=>p.Stan==stan).ToList();
                     if(s.Count()==0)
                    {
                        return StatusCode(202,"Trenutno ne postoje oglasi o cimeru sa datim podacima o stanu");
                    } 
                     
                return Ok(
                    s.Select(p=>
                    new{
                        Oid=p.OID,
                        Username = p.StudentOglas?.Username,
                        Role= p.StudentOglas?.Uloga,
                        Opis=p.Opis,
                        Datum=p.Datum,
                        Grad=p.Grad,
                        BrojCimera=p.BrojCimera,
                        Stan=p.Stan
                    }

                    )
                );     
                }
                else
                {
                    var apartmants = Context.OglasZaCimere.Include(p=>p.StudentOglas).Where(p=>p.Grad==grad).Where(p=>p.StudentOglas.Banovan==false).ToList();
                      if(apartmants.Count()==0)
                    {
                        return StatusCode(202,"Trenutno ne postoje oglasi o cimeru u odabranom gradu ");
                    }  
                    var s = apartmants.Where(p=>p.Stan==stan).ToList();
                     if(s.Count()==0)
                    {
                        return StatusCode(202,"Trenutno ne postoje oglasi o cimeru sa datim podacima o stanu");
                    } 
                     
                    return Ok(
                    s.Select(p=>
                    new{
                        Oid=p.OID,
                        Username = p.StudentOglas?.Username,
                        Role= p.StudentOglas?.Uloga,
                        Opis=p.Opis,
                        Datum=p.Datum,
                        Grad=p.Grad,
                        BrojCimera=p.BrojCimera,
                        Stan=p.Stan                    }

                    )
                );
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("ViewAddByCertainFiltersForStuddyBuddy/{idp}")]
        [HttpGet]
        public async Task<ActionResult> ViewAddByCertainFiltersForStuddyBuddy(int idp)
            {
                try
                {
                var s = Context.OglasZaStudyBuddies.Include(p=>p.Predmet).Include(p=>p.StudentOglas).Where(p=>p.Predmet.ID==idp).Where(p=>p.StudentOglas.Banovan==false).ToList();
                if(s.Count()==0)
                {
                    return StatusCode(202,"Trenutno ne postoje oglasi koji odgovaraju kriterijumu");
                }
                return Ok(s.Select(p=>new{
                    Oid=p.OID,
                    Username = p.StudentOglas?.Username,
                    Role= p.StudentOglas?.Uloga,
                    Opis=p.Opis,
                    Datum=p.Datum,
                    Predmet=p.Predmet?.Naziv,
                    BuddyStudije= p.BuddyStudije,
                    GodinaStudija=p.GodinaStudija   
                }));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        
        [Route("ViewAddByCertainFiltersForTutor/{idp}")]
        [HttpGet]
        public async Task<ActionResult> ViewAddByCertainFiltersForTutor(int idp)// treba id i za faks
            {
                try
                {
                var s = Context.OglasZaTutore.Include(p=>p.TutorPredmet).Include(p=>p.StudentOglas).Where(p=>p.TutorPredmet.ID==idp).Where(p=>p.StudentOglas.Banovan==false).ToList();
                if(s.Count()==0)
                {
                    return StatusCode(202,"Trenutno ne postoje oglasi koji odgovaraju kriterijumu");
                }
                    return Ok(s.Select(p=>new{
                        Oid=p.OID,
                        Username = p.StudentOglas?.Username,
                        Role= p.StudentOglas?.Uloga,
                        Opis=p.Opis,
                        Datum=p.Datum,
                        Predmet=p.TutorPredmet?.Naziv,
                        TutorStudije= p.TutorStudije,
                        GodinaStudija=p.GodinaStudija   
                    }));
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }

        [Route("ReturnAllProfessors")]
        [HttpGet]
        public async Task<ActionResult> ReturnAllProfessors(){

            var lista= await Context.Profesori.Where(p=>p.Banovan==false).ToListAsync();
             return Ok(lista.Select(p=>new{
                    ID = p.CID,
                    Ime= p.Ime,
                    Prezime= p.Prezime,
                    Username= p.Username,
                    Role = p.Uloga,
                    Opis= p.Opis,
                    NastavnoZvanje= p.NastavnoZvanje,
                    Obrazovanje= p.Obrazovanje
             }));
        }

        [Route("ReturnAllSubjects")]
        [HttpGet]
        public async Task<ActionResult> ReturnAllSubjects(){

            var lista= await Context.Predmeti.Include(p=> p.PredmetFakultet).ToListAsync();
             return Ok(lista.Select(p=>new{
                    ID=p.ID,
                        Naziv= p.Naziv,
                        Fakultet= p.PredmetFakultet?.Naziv
                }));
        }
          // vrati sve predmete, vrati sve profesore,  
          // za filter umesto id predmeta, naziv predmeta je 

        [Route("ListAllAdsRoommateByStudent/{id}")]
        [HttpGet]
        public async Task<ActionResult> ListAllAdsRoommateByStudent(int id){

            var student= await Context.Studenti.FindAsync(id);
            var listAdsCimer= await Context.OglasZaCimere.Where(p=>p.StudentOglas==student).ToListAsync(); 
            if(listAdsCimer.Count!=0){
            return Ok(listAdsCimer.Select(p=> new{
                        Oid=p.OID,
                        Username = p.StudentOglas?.Username,
                        Opis=p.Opis,
                        Datum=p.Datum,
                        Grad=p.Grad,
                        BrojCimera=p.BrojCimera,
                        Stan=p.Stan
                }));
                }else{
                      return StatusCode(202,"There are no ads!");
                }
        }

        [Route("ListAllAdsStuddyBuddyByStudent/{id}")]
        [HttpGet]
        public async Task<ActionResult> ListAllAdsStudyBuddyByStudent(int id){

            var student= await Context.Studenti.FindAsync(id); 
            var listAdsStuddyBuddy= await Context.OglasZaStudyBuddies.Include(p=>p.Predmet).Where(p=>p.StudentOglas==student).ToListAsync();
            if(listAdsStuddyBuddy.Count!=0){
            return Ok(listAdsStuddyBuddy.Select(pp=> new{
                    Oid=pp.OID,
                    Username = pp.StudentOglas?.Username,
                    Opis=pp.Opis,
                    Datum=pp.Datum,
                    PredmetBuddy=pp.Predmet?.Naziv,
                    BuddyStudije= pp.BuddyStudije,
                    GodinaStudija=pp.GodinaStudija  ,
                     PredmetId = pp.Predmet.ID

                }));
            }else{
                  return StatusCode(202,"There are no ads!");
            }
        }

        [Route("ListAllAdsTutorByStudent/{id}")]
        [HttpGet]
        public async Task<ActionResult> ListAllAdsTutorByStudent(int id){

            var student= await Context.Studenti.FindAsync(id);
            var listAdsTutor= await Context.OglasZaTutore.Include(p=>p.TutorPredmet).Where(p=>p.StudentOglas== student).ToListAsync();
            if(listAdsTutor.Count!=0){
            return Ok(listAdsTutor.Select(ppp=> new{
                        Oid=ppp.OID,
                        Username = ppp.StudentOglas?.Username,
                        Opis=ppp.Opis,
                        Datum=ppp.Datum,
                        PredmetTutor=ppp.TutorPredmet?.Naziv,
                        TutorStudije= ppp.TutorStudije,
                        GodinaStudija=ppp.GodinaStudija,
                        PredmetId = ppp.TutorPredmet.ID   
                }));
            }else{
                  return StatusCode(202,"There are no ads!");
            }
        }


        [Route("ListAllUsers")]
        [HttpGet]
        public async Task<ActionResult> ListAllUsers()
        {
            var users = await Context.Clanovi.Where(p=>p.Banovan==false).ToListAsync();
            return Ok(users.Select(p=> new{
                        p.Username,
                        p.Ime,
                        p.Prezime,
                        p.Email,
                        p.Banovan

                    }));
        }

        [Route("ListAllColl")]
        [HttpGet]
        public async Task<ActionResult>ListAllColl()
        {
            var col = await Context.Fakulteti.ToListAsync();
            return Ok(col.Select(p=> new{
                        p.FID,
                        p.Grad,
                        p.Naziv

            }));
        }

        [HttpGet]
        [Route("FiltersProFac")]
        public async Task<ActionResult> FiltersProfFac()
        {
            try
            {
                var l = await Context.Fakulteti.ToListAsync();
                return Ok(l.Select(p =>new{
                         Naziv = p.Naziv,
                         FID = p.FID,
                         Grad= p.Grad
                     }).ToList()
                    );
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("FiltersProfCours/{id}")]
        public async Task<ActionResult> FiltersProfCours(int id)
        {
            try
            {
                var f= await Context.Fakulteti.FindAsync(id);
                var list = await Context.Predmeti.Include(p=>p.PredmetFakultet).Where(p=>p.PredmetFakultet.FID==id).ToListAsync();
                if(list!=null){
                return Ok(
                list.Select(p =>
                     new
                     {
                         Naziv = p.Naziv,
                         PID = p.ID

                     }).ToList()

                    );
            }else{
                  return StatusCode(202,"There are no courses for this faculty!");
            }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("ListAllCommentsForProf/{username}")]
        [HttpGet]
        public async Task<ActionResult> ListAllCommentsForProf(string username){
            try{
                var prof= await Context.Profesori.Where(p=> p.Username==username).ToListAsync();
                 var komentari= await Context.Komentari.Include(p=>p.KomentarProfa).Include(p=>p.KomentarStudent).Where(p=> p.KomentarProfa.Username==username).ToListAsync();
                if(komentari.Count!=0){
                 return Ok(komentari.Select(p=>
                    new{
                        KomentarId= p.idKomentara, 
                        Tekst= p.Tekst,
                        DatumPostavljanja= p.datumPostavljanja,
                        Student= p.KomentarStudent?.Username
                    }).ToList()
                    );
                }else{
                      return StatusCode(202,"There are no comments!");
                }
            }catch(Exception e){
                return BadRequest(e.Message);
            }
        }

        [Route("ListAllRatesForProf/{username}")]
        [HttpGet]
        public async Task<ActionResult> ListAllRatesForProf(string username){
            try{
                var prof= await Context.Profesori.Where(p=> p.Username==username).ToListAsync();
                 var ocene= await Context.Ocene.Include(p=>p.prof).Include(p=>p.stud).Where(p=> p.prof.Username==username).ToListAsync();
                 if(ocene.Count!=0){
                 return Ok(ocene.Select(p=>
                    new{
                        OcenaId= p.idOcene,
                        Student= p.stud.Username,
                        Ocena= p.ocena
                    }).ToList()
                    );
                 }else{
                      return StatusCode(202,"Professor is not rated yet!");
                 }
            }catch(Exception e){
                return BadRequest(e.Message);
            }
        }

        [Route("ListAllSubjectsProf/{username}")]
        [HttpGet]
        public async Task<ActionResult> ListtAllSubjectsProf(string username){
            try{
                var prof= await Context.Profesori.Include(p=>p.ProfPredmet).ThenInclude(p=>p.PredmetFakultet).Where(p=>p.Username==username).FirstOrDefaultAsync();
                if(prof!=null){
                    var listaPredmeta= prof.ProfPredmet;
                    if(listaPredmeta.Count!=0){
                    return Ok(listaPredmeta.Select(p=> new{
                        PredmetNaziv= p.Naziv,
                        PredmetId= p.ID,
                        FakultetNaziv= p.PredmetFakultet?.Naziv
                    }));
                }else{
                      return StatusCode(202,"There are no subjects!");
                }
                }
                else{
                    return StatusCode(404,"Couldn't find professor!");
                }
            }
            catch(Exception e){
                return BadRequest(e.Message);
            }
        }

        [Route("GetAllColByStudent/{username}")]
        [HttpGet]
        public async Task<ActionResult> GetAllColByStudent(string username){
            try{
                var student= await Context.Studenti.Include(p=>p.NazivFakulteta).Where(p=>p.Username== username).FirstOrDefaultAsync();
                if(student!=null){
                    var listaFakulteta= student.NazivFakulteta;
                    if(listaFakulteta?.Count!=0){
                        return Ok(listaFakulteta?.Select(p=> new{
                            FakultetNaziv= p.Naziv,
                            FakultetId= p.FID
                        }));
                    }else{
                        return StatusCode(202,"Empty!");
                    }
                }else{
                    return StatusCode(404, "Couldn't find student!");
                }
            }catch(Exception e){
                return BadRequest(e.Message);
            }
        }

       [Route("GetAdByCertainId/{idAd}")]
       [HttpGet]
       public async Task<ActionResult> GetAdByCertainId(int idAd){
           var oglas= await Context.Oglasi.FindAsync(idAd);
            if(oglas.GetType().ToString()=="Models.OglasZaCimera"){

                var oglasZaCimera= await Context.OglasZaCimere.Include(p=>p.StudentOglas).Where(p=>p.OID==idAd).FirstOrDefaultAsync();
                return Ok(oglasZaCimera);
            }
            else if(oglas.GetType().ToString()=="Models.OglasZaStudyBuddy"){
                    var oglasZaStuddy= await Context.OglasZaStudyBuddies.Where(p=>p.OID==idAd).FirstOrDefaultAsync();
                    return Ok(oglasZaStuddy);
            }
            else{
                var oglasZaTutor= await Context.OglasZaTutore.Where(p=>p.OID==idAd).FirstOrDefaultAsync();
                return Ok(oglasZaTutor);
            }
                
            }

        }
    }
