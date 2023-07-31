using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Dtos;
using Models;
using projekatSWE.Dtos;

namespace projekatSWE.Controllers
{
  [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public Context Context { get; set; }
        public Student? UserNameExists { get; private set; }
        public Student? student { get; private set; }

        public StudentController(IConfiguration configuration, Context context)
        {
            _configuration = configuration;
            Context = context;
        }
        private string? ValidateToken(string token)
        {
                if (token == null) 
                return null;

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value);
                try
                {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

        var jwtToken = (JwtSecurityToken)validatedToken;
        var userId = int.Parse(jwtToken.Claims.First(x => x.Type == 
        ClaimTypes.NameIdentifier).Value);
        var roleUser= jwtToken.Claims.First(x=> x.Type== ClaimTypes.Role).Value;
        string idrole= userId.ToString()+ " "+ roleUser;
        return idrole;
    }
    catch
    {
        return null;
    }
    }


        [Route("AddStudentsToSchadule"),Authorize]
        [HttpPut]
        public async Task<ActionResult> AddStudentsToSchadule([FromBody]CasZakazivanjeDto cas)
        {
            
              try{
                  var r = await Context.Rasporedi.Where(p=>p.RasporedProfesor.Username==cas.UsernameProf).Include(p=>p.RasporedCas).Include(p=>p.RasporedProfesor).FirstOrDefaultAsync();
                  var cg= await Context.Studenti.Where(p=>p.CID==cas.ClanId).Include(p=>p.StudentCas).FirstOrDefaultAsync();
                  var s = await Context.Casi.Where(p=>p.CASID==cas.CasId).Include(p=>p.CasStudent).Include(p=>p.CasRaspored).Include(p=>p.CasPredmet).FirstOrDefaultAsync();
                  var p = await Context.Predmeti.FindAsync(cas.PredmetId);
                
                  if(cg==null || s==null ||r==null )
                    return StatusCode(202,"Nevalidan id");
                if(proveriUseraStudent(cas.ClanId)==true)
               {
                    s.Zakazan=true; 
                    cg.StudentCas?.Add(s);
                    s.CasStudent=cg;
                    s.CasPredmet=p;
                    r.RasporedCas?.Add(s);
                await Context.SaveChangesAsync();
                return Ok(cg.Username);
               }
            else
            {
                return StatusCode(403,"Niste autorizovani!");
            }
            }

            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    



    [HttpPut]
    [Route("CancelClass"),Authorize]
    public async Task<ActionResult>CancelClass([FromBody]CasDto c)
    {
        try{
        var cas = Context.Casi?.Include(p=>p.CasPredmet).Where(p=>p.CASID==c.CasId).FirstOrDefault();
        var student = Context.Studenti?.Where(p=>p.CID==c.ClanId).FirstOrDefault();
        var predmet= Context.Predmeti?.Where(p=>p.ID== cas.CasPredmet.ID).FirstOrDefault();
        student.StudentCas?.Remove(cas);
        predmet.PredmetCas?.Remove(cas);
        cas.Zakazan=false;
        await Context.SaveChangesAsync();
        return Ok("Otkazan cas");
        }catch(Exception e){
            return BadRequest(e.InnerException);
        }
        
    }
        private bool  proveriUseraStudent(int id){
             Request.Headers.TryGetValue("Authorization", out var token);
            string jwt = token.ToString().Split(" ")[1];
            var idandrole= ValidateToken(jwt);
            var userId= int.Parse(idandrole.Split(" ")[0]);
            var  userRole= idandrole.Split(" ")[1];
            if(userRole!="Student"){
                 return false;
            }
            if(userId==null || id!= userId ){
                return false;
            }
            return true;
        }

        [HttpPost]
        [Route("StudenCollegesAdd"),Authorize]
        public async Task<ActionResult> StudenCollegesAdd(string name, string username)
        {
            
            try{
            var stud = Context.Studenti.Where(p=>p.Username==username).Include(p=>p.NazivFakulteta).FirstOrDefault();
            var faks=Context.Fakulteti.Where(p=>p.Naziv==name).Include(p=>p.FakultetStudent).FirstOrDefault();
            if (stud==null || faks == null)
                return StatusCode(202,"Ne postoji faks ili user");//nece se desi,ali ajde

            if(proveriUseraStudent(stud.CID)==true)
            {
                stud.NazivFakulteta.Add(faks);
                faks.FakultetStudent.Add(stud);

                await Context.SaveChangesAsync();
                return Ok("Student "+stud.Username+"je na fakultetu"+faks.Naziv);
            }
            
            else
            {
                return StatusCode(403,"Niste autorizovani!");
            }
            }

            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
          

        }

         [HttpPut]
        [Route("UpdateStudent"),Authorize] //isprobajte ovu funkciju isto kao sto ste radile za UpdateInfoStudent samo je fromBody i sve sto moze da se promeni prenestie kroz fromBody
        public async Task<ActionResult> UpdateStudent([FromBody]StudentUpdateDto stud){
            try{
                bool provera= proveriUseraStudent(stud.CID);
                if(provera==true){
                    var student= await Context.Studenti.FindAsync(stud.CID);
                    if(student!=null){
                        if(student.Username!= stud.Username){ //znaci da je izmenjen u body
                          var UserNameExists= await Context.Clanovi.Where(p=>p.Username== stud.Username).FirstOrDefaultAsync();
                            if(UserNameExists!= null){
                                return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "Professor with this username already exists, please try another username!"});
                            }
                        }
                        var faks= await Context.Fakulteti.Include(p=>p.FakultetStudent).Where(p=>p.FID== stud.Idfaksa).FirstOrDefaultAsync();
                        if(faks !=null){
                           // return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "Professor with this username already exists, please try another username!"});

                            student.NazivFakulteta?.Add(faks);
                            faks.FakultetStudent?.Add(student);
                        }
                        student.Username= stud.Username;
                        student.Ime= stud.Ime;
                        student.Prezime= stud.Prezime;
                        student.Polic= stud.Polic;
                        student.Opis= stud.Opis;
                        student.GodinaStudija= stud.GodinaStudija;
                        student.Grad= stud.Grad;
                        student.Studija= stud.TipStudija;
                     
                        await Context.SaveChangesAsync();
                        return Ok("Uspesno izmenjeni podaci!");
                    }
                    else{
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "There is no user with this id!"});
                    }
                }
                else{
                     return StatusCode(403,"Niste autorizovani!");
                }

            }catch(Exception e){
                 return BadRequest(e.Message);   
            }
        }

          [Route("UpdateStudent/{id}/{ime}/{prezime}/{username}/{email}/{pol}/{datumRodjenja}/{opis}/{grad}/{godinaStudija}/{studija}"),Authorize]
          [HttpPut]
      // da li da brisme id?
          public async Task<ActionResult> UpdateInfoStudent(int id, string ime, string prezime, string username, string email, Pol pol, DateTime datumRodjenja, string opis, string grad, int godinaStudija, TipStudija studija ){
              
              var student= await Context.Studenti.FindAsync(id);
          

              if(student!=null){    
                if(proveriUseraStudent(id)==true)
               {
              if(student.Username!=username){
                  var UserNameExists= await Context.Studenti.Where(p=>p.Username== username).FirstOrDefaultAsync();
                         if (UserNameExists != null)
                            return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "User with this username already exists, please try another username!"});
              }
                  student.Username= username;
                
                if(!string.IsNullOrWhiteSpace(ime))
                    student.Ime= ime;

                if(!string.IsNullOrWhiteSpace(prezime))
                    student.Prezime= prezime;

                /*
                if(!string.IsNullOrWhiteSpace(stud.Slika))
                    student.Slika= stud.Slika;*/

                if(pol!=student.Polic)
                    student.Polic= pol;

                if(godinaStudija!= student.GodinaStudija)
                    student.GodinaStudija= godinaStudija;
                
                if(studija!= student.Studija)
                    student.Studija= studija;
                
                if(!string.IsNullOrWhiteSpace(opis))
                    student.Opis= opis;
                else
                    student.Opis= opis;

                if(!string.IsNullOrWhiteSpace(grad))
                    student.Grad= grad;
               }
               else
               {
                return StatusCode(403,"Niste autorizaovani!");
               }

                //mislim da ne treab da menjamo datum rodjenja, email, br licne karte

               }
               else{
                 return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "There is no user with this id!"});
                }
  
              try{
              await Context.SaveChangesAsync();
               return Ok("Uspesno izmenjeni podaci!");
              }
              catch(Exception e){
                  return BadRequest(e.Message);
              }
          
          }


         [Route("CreateNewAdForRoommate"),Authorize]
          [HttpPost]
          public async Task<ActionResult> CreateNewAdForRoommate(OglasZaCimeraDto oglas)
          {
            try{
            
             var s= await Context.Studenti.FindAsync(oglas.StudentId);
             if(s==null || oglas.BrojCimera == null || oglas.Datum==null|| oglas.Grad==null|| oglas.Opis==""||oglas.Stan==null){
             return BadRequest("User doesn't exist!");
            }

                 if(proveriUseraStudent(s.CID)==true)
               {
                  
            //        OglasZaCimera ozc= new OglasZaCimera();
                    OglasZaCimera og = new OglasZaCimera();
                    og.StudentOglas= s;
                    og.BrojCimera=oglas.BrojCimera;
                    og.Datum=oglas.Datum;
                    og.Grad=oglas.Grad;
                    og.Opis=oglas.Opis;
                    og.Stan=oglas.Stan;
                    Context.OglasZaCimere.Add(og);
                    await Context.SaveChangesAsync();
                    if(og.OID==null)
                    return StatusCode(202,"Nije se kreirao id");
                    s.StudentOglas.Add(og);
                    return Ok("Oglas za cimera dodat!");
               }
               else
               {
                return StatusCode(403,"Niste autorizovani!");
               }
                }

            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
          }

        [Route("CreateNewAdStuddyBuddy"),Authorize]
          [HttpPost]
          public async Task<ActionResult> CreateNewAdForStuddyBuddy(OglasZaStuddyBuddyDto oglas)
          {
              try{
                  
                  var s= await Context.Studenti.FindAsync(oglas.StudentId);
                  var p= await Context.Predmeti.FindAsync(oglas.PredmetId);
                  //jel ce to preko id-a ili preko imena predmeta?
                  if(s==null){
                      return BadRequest("User doesn't exist!");
                  }
                  if( p== null){
                      return BadRequest("Subject doesn't exist!");
                  }

                       if(proveriUseraStudent(s.CID)==true)
               {
                    OglasZaStudyBuddy ozc= new OglasZaStudyBuddy();
                    ozc.StudentOglas= s;
                    ozc.Predmet= p;
                    ozc.BuddyStudije= oglas.BuddyStudije;
                    ozc.Datum= oglas.Datum;
                    ozc.GodinaStudija= oglas.GodinaStudija;
                    ozc.Opis= oglas.Opis;
                    Context.OglasZaStudyBuddies.Add(ozc);
                    await Context.SaveChangesAsync();
                    s.StudentOglas.Add(ozc);
                    p.PredmetOglasZaBuddy.Add(ozc);
                    return Ok("Oglas za studdy buddy-a dodat!");
               }
               else
               {
                return StatusCode(403,"Niste autorizovani");
               }
                }

            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
          }

           [Route("CreateNewAdTutor"),Authorize]
          [HttpPost]
          public async Task<ActionResult> CreateNewAdForTutor([FromBody]OglasZaTutoraDto oglas)
          {
              try{
                var s= await Context.Studenti.FindAsync(oglas.StudentId);
                var p= await Context.Predmeti.FindAsync(oglas.PredmetId);
                if(s==null || p==null){
                      return BadRequest("Wrong id!");
                  }
                if(proveriUseraStudent(s.CID)==true)
               {
                    OglasZaTutora ogt= new OglasZaTutora();
                    ogt.StudentOglas= s;
                    ogt.TutorPredmet= p;
                    ogt.Opis= oglas.Opis;
                    ogt.Datum= oglas.Datum;
                    ogt.TutorStudije= oglas.TutorStudije;
                    ogt.GodinaStudija= oglas.GodinaStudija;
                    Context.OglasZaTutore.Add(ogt);
                    await Context.SaveChangesAsync();
                    s.StudentOglas.Add(ogt);
                    p.PredmetOglasZaTutora.Add(ogt);
                    return Ok("Oglas za tutora dodat!");
               }
               else{
                return StatusCode(403,"Niste autorizovani!");
               }
                }

            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
          }



        [Route("DeleteAdForRoommate/{idOglasa}"),Authorize]
        [HttpDelete]
        public async Task<ActionResult> DeleteForRoommate(int idOglasa){
            try{
           var oglas= await Context.OglasZaCimere.Include(p=>p.StudentOglas).Where(p=>p.OID==idOglasa).FirstOrDefaultAsync();
           var idi = oglas.StudentOglas.CID;
        if(oglas==null)
        return StatusCode(402,"Ne postoji oglas");
                if(proveriUseraStudent(idi)==true)
               {
                    //nisam sigurna da li se automatski brise sa druge strane? myb ne?
                  //  Student s= oglas.StudentOglas;
                 //   s.StudentOglas.Remove(oglas);
                    Context.OglasZaCimere.Remove(oglas);
                    await Context.SaveChangesAsync();
                    return Ok("Obrisan oglas za cimera");
                }
                else {
                    return StatusCode(403,"Niste auotrizovani!");
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("DeleteAd/{idOglasa}"),Authorize]
        [HttpDelete]
        public async Task<ActionResult> DeleteAd(int idOglasa){
            try{
                var oglas= await Context.Oglasi.Include(p=>p.StudentOglas).Where(p=>p.OID==idOglasa).FirstOrDefaultAsync();
                   var idi = oglas.StudentOglas.CID;
                if(proveriUseraStudent(idi)==true)
               {
              
                    Context.Oglasi.Remove(oglas);
                    await Context.SaveChangesAsync();
                    return Ok("Obrisan oglas");
                }
                else {
                    return StatusCode(403,"Nisi autorizovan!");
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

          [Route("DeleteAdForStuddyBuddy"),Authorize]
        [HttpDelete]
        public async Task<ActionResult> DeleteForStuddyBuddy(int idOglasa){
            try{
                var oglas= await Context.OglasZaStudyBuddies.Include(p=>p.StudentOglas).Where(p=>p.OID==idOglasa).FirstOrDefaultAsync();
                 var idi = oglas.StudentOglas.CID;
                 if (oglas ==null)
                 {
                    return StatusCode(402,"Ne postoji oglas");
                 }
               if(proveriUseraStudent(idi)==true)
               {
                    Context.OglasZaStudyBuddies.Remove(oglas);
                    await Context.SaveChangesAsync();
                    return Ok("Obrisan oglas za studdy buddy");
                }
                else {
                    return StatusCode(403,"Niste autorizovani!");
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }

          [Route("DeleteAdForTutor"),Authorize]
        [HttpDelete]
        public async Task<ActionResult> DeleteForTutor(int idOglasa){

        try{
            var oglas= await Context.OglasZaTutore.Include(p=>p.StudentOglas).Where(p=>p.OID==idOglasa).FirstOrDefaultAsync();
            var idi = oglas.StudentOglas.CID;
            if (oglas ==null)
            {
                return StatusCode(402,"Ne postoji oglas");
            }
            if(proveriUseraStudent(idi)==true)
            {
                Context.OglasZaTutore.Remove(oglas);
                await Context.SaveChangesAsync();
                return Ok("Obrisan oglas za tutore");
            }
            else
            {
                return StatusCode(403,"Niste autorizovani!");
            }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }





        }


         [Route("UpdateAdRoommate"),Authorize]
          [HttpPut]
          public async Task<ActionResult> UpdateAdRoommate( [FromBody] OglasZaCimera ozc){
            var oglas = Context.OglasZaCimere.Find(ozc.OID);
            var stud = Context.Studenti.Include(p=>p.StudentOglas).Where(p=>p.StudentOglas.Contains(oglas)).FirstOrDefault();
            if(stud==null || oglas ==null)
            return StatusCode(403,"Ne postoji user");
            if(proveriUseraStudent(stud.CID)==true)
               {

                if(!string.IsNullOrWhiteSpace(ozc.Opis))
                    oglas.Opis= ozc.Opis;
    
                if(ozc.Stan!= oglas.Stan)
                    oglas.Stan= ozc.Stan;
                if(!string.IsNullOrWhiteSpace(ozc.SlikeStana))
                    oglas.SlikeStana= ozc.SlikeStana;
                if(!string.IsNullOrWhiteSpace(ozc.Grad))
                    oglas.Grad= ozc.Grad;
                oglas.Datum=DateTime.Now;
               }

               else return StatusCode(403,"Niste autorizovani!");
              try{
              await Context.SaveChangesAsync();
               return Ok("Uspesno izmenjeni podaci!");
              }
              catch(Exception e){
                  return BadRequest(e.Message);
              }
          }

           [Route("UpdateAdStuddyBuddy"),Authorize]
          [HttpPut]
          public async Task<ActionResult> UpdateAdStuddyBuddy([FromBody] OglasZaStudyBuddy ozc){
           
            var oglas= await Context.OglasZaStudyBuddies.FindAsync(ozc.OID);
            var stud = Context.Studenti.Include(p=>p.StudentOglas).Where(p=>p.StudentOglas.Contains(oglas)).FirstOrDefault();
            if(stud==null || oglas ==null)
            return StatusCode(403,"Ne postoji user");
           if(proveriUseraStudent(stud.CID)==true)
               {

            if(!string.IsNullOrWhiteSpace(ozc.Opis))
                oglas.Opis= ozc.Opis;
   
            if(!string.IsNullOrWhiteSpace(ozc.GodinaStudija))
                oglas.GodinaStudija= ozc.GodinaStudija;
            if(ozc.BuddyStudije!= oglas.BuddyStudije)
                oglas.BuddyStudije= ozc.BuddyStudije;
                 oglas.Datum=DateTime.Now;
               }
            else
            {
                return StatusCode(403,"Niste autorizovani!");
            }
              try{
              await Context.SaveChangesAsync();
               return Ok("Uspesno izmenjeni podaci!");
              }
              catch(Exception e){
                  return BadRequest(e.Message);
              }
          }

          [Route("UpdateAdStuddyBuddy2"),Authorize]
          [HttpPut]
          public async Task<ActionResult> UpdateAdStuddyBuddy2([FromBody] OglasZaStuddyBuddyDto ozc){
           
            var oglas= await Context.OglasZaStudyBuddies.FindAsync(ozc.Oid);
            var stud = Context.Studenti.Include(p=>p.StudentOglas).Where(p=>p.StudentOglas.Contains(oglas)).FirstOrDefault();
            var pred = Context.Predmeti.Where(p=>p.ID==ozc.PredmetId).FirstOrDefault();
            if(stud==null || oglas ==null || pred ==null)
            return StatusCode(403,"Ne postoji user");
           if(proveriUseraStudent(stud.CID)==true)
               {
                oglas.Opis= ozc.Opis;
                oglas.GodinaStudija= ozc.GodinaStudija;
                oglas.BuddyStudije= ozc.BuddyStudije;
                oglas.Predmet= pred;
                oglas.Datum=DateTime.Now;
               }
            else
            {
                return StatusCode(403,"Niste autorizovani!");
            }
              try{
              await Context.SaveChangesAsync();
              return Ok(
              new{
               pred.Naziv,
               oglas.Datum

              }
             
            );          

              }
              catch(Exception e){
                  return BadRequest(e.Message);
              }
          }

          [Route("UpdateAdTutor"),Authorize]
          [HttpPut]
          public async Task<ActionResult> UpdateAdTutor( [FromBody] OglasZaTutoraDto ozc){
         
              var oglas= await Context.OglasZaTutore.FindAsync(ozc.Oid);
               var stud = Context.Studenti.Include(p=>p.StudentOglas).Where(p=>p.StudentOglas.Contains(oglas)).FirstOrDefault();
               var pred = Context.Predmeti.Where(p=>p.ID==ozc.PredmetId).FirstOrDefault();
            if(stud==null || oglas ==null || pred ==null)
            if(stud==null || oglas ==null)
            return StatusCode(403,"Ne postoji user");
            if(proveriUseraStudent(stud.CID)==true)
               {  

                if(!string.IsNullOrWhiteSpace(ozc.Opis))
                    oglas.Opis= ozc.Opis;
                if(ozc.GodinaStudija!= oglas.GodinaStudija)
                    oglas.GodinaStudija= ozc.GodinaStudija;
                if(ozc.TutorStudije!= oglas.TutorStudije)
                    oglas.TutorStudije= ozc.TutorStudije;
                    oglas.Datum=DateTime.Now;
                    oglas.TutorPredmet= pred;
               }
               else
               return StatusCode(403,"Niste autorizovani!");
  
              try{
              await Context.SaveChangesAsync();
               return Ok("Uspesno izmenjeni podaci!");
              }
              catch(Exception e){
                  return BadRequest(e.Message);
              }
          }

        [Route("AddComment"),Authorize]
        [HttpPost]
        public async Task<ActionResult> AddComment([FromBody]KomentarDto kom){
            try{
            bool provera= proveriUseraStudent(kom.studId);
            if(provera==true){
                var student= await Context.Studenti.FindAsync(kom.studId);
                var profesor= await Context.Profesori.Where(p=>p.Username== kom.usernameProf).FirstOrDefaultAsync();
                if(student!= null && profesor!= null){
                    Komentar komentar= new Komentar();
                    komentar.datumPostavljanja= DateTime.Now;
                    komentar.Tekst= kom.tekst;
                    komentar.KomentarProfa= profesor;
                    komentar.KomentarStudent= student;
                    Context.Komentari?.Add(komentar);
                    await Context.SaveChangesAsync();
                    student.StudentKomentar?.Add(komentar);
                    profesor.ProfaKomentar?.Add(komentar);
                    return Ok("Komentar postavljen!");
                }else{
                     return StatusCode(202,"Ne postoji student ili profesor");
                }
            }else{
                    return StatusCode(403,"Niste autorizovani!");
            }
            }catch(Exception e){
                return BadRequest(e.Message);
            }
        }

        [Route("DeleteComment/{idKom}"),Authorize]
        [HttpDelete]
        public async Task<ActionResult> DeleteComment(int idKom){
            try{
                 var komentar= await Context.Komentari.Include(p=>p.KomentarStudent).Where(p=>p.idKomentara==idKom).FirstOrDefaultAsync();
                bool provera= proveriUseraStudent(komentar.KomentarStudent.CID);
                if(provera==true){
                    Context.Komentari?.Remove(komentar);
                    await Context.SaveChangesAsync();
                    return Ok("Obrisan komentar!");
                }
                else {
                    return StatusCode(403,"Nisi autorizovan!");
                }
            }
            catch(Exception e){
                return BadRequest(e.Message);
            }
        }
    
        [Route("UpdateAComment"),Authorize] //mozda nam i ne treba ova funkcija ali ajde neka je
        [HttpPut]
        public async Task<ActionResult> UpdateComment([FromBody]KomentarDto kom){
            try{
                bool provera= proveriUseraStudent(kom.studId);
                if(provera==true){
                    var komentar= await Context.Komentari.FindAsync(kom.komentarId);
                    if(komentar!=null){
                        komentar.Tekst= kom.tekst;
                        komentar.datumPostavljanja= DateTime.Now;
                        await Context.SaveChangesAsync();
                        return Ok("Uspesno izmenjen komentar!");
                    }
                    else{
                        return StatusCode(202, "Lose ste preneli komentar id");
                    }
                }
                else{
                     return StatusCode(403,"Niste autorizovani!");
                }
            }
            catch(Exception e){
                return BadRequest(e.Message);
            }
        }
    

        [Route("RateProf"),Authorize]
        [HttpPost]
        public async Task<ActionResult> RateProf([FromBody]OcenaDto ocena){
            try{
                bool provera= proveriUseraStudent(ocena.idStud);
                if(provera==true){
                    var student= await Context.Studenti.FindAsync(ocena.idStud);
                    var profesor= await Context.Profesori.Where(p=>p.Username== ocena.usernameProf).FirstOrDefaultAsync();
                    var o=  Context.Ocene.Include(p=> p.prof).Include(p=>p.stud).Where(p=>p.stud.CID== student.CID && p.prof.CID== profesor.CID).FirstOrDefault();
                    if(o!=null){
                        return StatusCode(202,"Vec ste ocenili ovog profesora!");
                    }
                    if(student==null || profesor== null){
                        return StatusCode(202,"Profesor ili student ne postoje!");
                    }
                    Ocena oc= new Ocena();
                    oc.ocena= ocena.ocena;
                    oc.prof= profesor;
                    oc.stud= student;
                    Context.Ocene.Add(oc);
                    await Context.SaveChangesAsync();
                    student.StudentOcenio?.Add(oc);
                    profesor.ProfOcene?.Add(oc);
                    profesor.ocenaProsek= izracunajProsek(profesor.CID, ocena.ocena);
                    await Context.SaveChangesAsync();
                    return Ok("Ocenjen!");
                    
                }
                else{
                      return StatusCode(403,"Niste autorizovani!");
                }
            }
            catch(Exception e){
                return BadRequest(e.Message);
            }
        }


        [Route("ChangeRate"),Authorize]
        [HttpPut]
        public async Task<ActionResult> ChangeRate([FromBody]OcenaDto ocena){
            try{
                bool provera= proveriUseraStudent(ocena.idStud);
                if(provera==true){
                    var oc= await Context.Ocene.Include(p=>p.stud).Include(p=>p.prof).Where(p=>p.idOcene==ocena.idOcene).FirstOrDefaultAsync();
                    if(oc!=null){
                     oc.ocena= ocena.ocena;
                     oc.prof.ocenaProsek= izracunajProsek(oc.prof.CID, ocena.ocena);
                     await Context.SaveChangesAsync();
                        return Ok("Uspesno izmenjen rating!!");
                    }
                    else{
                        return StatusCode(202, "Lose ste preneli ocenu id");
                    }
                }
                else{
                     return StatusCode(403,"Niste autorizovani!");
                }
            }
            catch(Exception e){
                return BadRequest(e.Message);
            }
        }
        private double izracunajProsek(int idProf,int ocenaNova){
            var prof= Context.Profesori.Include(p=> p.ProfOcene).Where(p=>p.CID== idProf).FirstOrDefault();
            double rating=0;
            int count=0;
            foreach(Ocena p in prof.ProfOcene){
                rating= p.ocena+ rating;
                count++;
            }
            rating= ((double)rating)/count;
            return rating;
        }
    }
}