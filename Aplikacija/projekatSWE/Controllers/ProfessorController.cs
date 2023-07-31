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
using projekatSWE.Dtos;
//using UserService.ActiveMQ.Connect;

namespace projekatSWE.Controllers
{

  // [ApiController]
   [Route("api/[controller]")]
 
    public class ProfessorController : ControllerBase
    {


        public Context Context {get; set; }
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;

        public ProfessorController(IConfiguration configuration, Context context, IUserService userService)
        {
            _configuration = configuration;
            Context= context;
            _userService= userService;
        
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
        var userBan= jwtToken.Claims.First(x=> x.Type== ClaimTypes.Actor).Value;
        idrole= idrole + " " + userBan;
       return idrole;
    }
    catch
    {
        return null;
    }
        }

        private bool  proveriUsera(int idProf){
             Request.Headers.TryGetValue("Authorization", out var token);
            string jwt = token.ToString().Split(" ")[1];
            var idandrole= ValidateToken(jwt);
            var userId= int.Parse(idandrole.Split(" ")[0]);
            var  userRole= idandrole.Split(" ")[1];
            if(userRole!="Profesor"){
                 return false; //nije dobra uloga
            }
            if(userId==null || idProf!= userId ){
                return false; //nije dobar username
            }
            return true;
        }

        private bool proveriBanovan(int idProf){
             Request.Headers.TryGetValue("Authorization", out var token);
            string jwt = token.ToString().Split(" ")[1];
            var roles= ValidateToken(jwt);
            var userBan = roles.Split(" ")[2];
            if(userBan=="False"){
                return false;
            }else{
                return true;
            }
            
        }
        [HttpPost]
        [Route("AddClassesToShedule/{rid}"),Authorize]
        public async Task<ActionResult> AddClassesToShedule(int rid,int cena,DateTime pocetak, DateTime kraj )
        {
              
              try{
                  var r = await Context.Rasporedi.Where(p=>p.RID==rid).Include(p=>p.RasporedCas).Include(p=>p.RasporedProfesor).FirstOrDefaultAsync();
                  if(r!=null)
                {
                    int idProf= r.RasporedProfesor.CID;
                    bool provera=proveriUsera(idProf);
                    if(provera==true){
                        Cas c = new Cas();
                        c.Zakazan=false;
                        c.Cena=cena;
                        c.Pocetak=pocetak;
                        c.Zavrsetak=kraj;
                        r.RasporedCas.Add(c);
                        await Context.SaveChangesAsync();
                        return Ok("Kreiran raspored");
                    }
                    else{
                         return StatusCode(403,"Niste autorizovani!");
                    }
                }
                else{
                    return BadRequest("Nema rasporeda");
                }
              }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("AddClass2"),Authorize] //ako ga odavde izbrisemo vidi li se url
         public async Task<ActionResult> AddClass2([FromBody]ProbaDto ss)
        {
         
            try
            {
                bool provera= proveriUsera(ss.Prof);
                if(provera==true){
            if (ss.Price<= 0)
            {
                return BadRequest("Price can not be 0 or less!");//nema se desi,ali aj
            }
            if (ss.Start==null)
            {
                return BadRequest("U need to entry start time!");//nema se desi,ali aj
            }
          
            if (ss.End==null)
            {
                return BadRequest("U need to entry end time!");//nema se desi,ali aj
            }
              var cl=  Context.Rasporedi.Where(p=>p.RasporedProfesor.CID==ss.Prof).FirstOrDefault();
            //   var pr=await Context.Predmeti.FindAsync(pid);
              if(cl==null)
              {
                return BadRequest("Schedule is null!");//nema se desi,ali aj
              }
              
              Cas c = new Cas();
                string s=ss.Start.Replace("_"," ");
                DateTime pocetak=Convert.ToDateTime(s);
                 string k=ss.End.Replace("_"," ");
                DateTime kraj=Convert.ToDateTime(k);
            //   c.CasPredmet=pr;
              c.CasRaspored=cl;
              c.Pocetak=pocetak;
              c.Zavrsetak=kraj;
              c.Cena=ss.Price;
    
              Context.Casi?.Add(c);
              cl.RasporedCas?.Add(c);
            //   pr.PredmetCas.Add(c);
              
              await Context.SaveChangesAsync();
              return Ok("Unet cas!");
                }
                else {
                     return StatusCode(403,"Niste autorizovani!");
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException.Message);
            }
        }


        [HttpPut]
        [Route("UpdateProf"),Authorize] //isprobajte ovu funkciju isto kao sto ste radile za UpdateInfoProf samo je fromBody i sve sto moze da se promeni prenestie kroz fromBody
        public async Task<ActionResult> UpdateProf([FromBody]ProfesorUpdateDto prof){
            try{
                bool provera= proveriUsera(prof.CID);
                if(provera==true){
                    var profesor= await Context.Profesori.Include(p=>p.ProfPredmet).Where(p=>p.CID== prof.CID).FirstOrDefaultAsync();
                    if(profesor!=null){
                        if(profesor.Username!= prof.Username){ //znaci da je izmenjen u body
                          var UserNameExists= await Context.Clanovi.Where(p=>p.Username== prof.Username).FirstOrDefaultAsync();
                            if(UserNameExists!= null){
                                return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "Professor with this username already exists, please try another username!"});
                            }
                        }
                        profesor.Username= prof.Username;
                        profesor.Ime= prof.Ime;
                        profesor.Prezime= prof.Prezime;
                        profesor.Polic= prof.Polic;
                        profesor.NastavnoZvanje= prof.NastavnoZvanje;
                        profesor.Opis= prof.Opis;
                        profesor.Obrazovanje= prof.Obrazovanje;
                        var predmet= await Context.Predmeti.Include(p=>p.PredmetProf).Where(p=>p.ID== prof.PredmetId).FirstOrDefaultAsync();
                        if(predmet!=null){
                            var daLi= predmet.PredmetProf?.Find(x=>x.CID== profesor.CID);
                            if(daLi!=null){
                                return StatusCode(202, "Vec ste dodali ovaj predmet!");
                            }
                                profesor.ProfPredmet?.Add(predmet);
                                predmet.PredmetProf?.Add(profesor);
                            }
                        await Context.SaveChangesAsync();
                        return Ok("Uspesno izmenjeni podaci!");
                    }
                    else{
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "There is no user with this id!"});
                    }
                }
                else {
                     return StatusCode(403,"Niste autorizovani!");
                }

            }catch(Exception e){
                 return BadRequest(e.Message);   
            }
        }
        
        [Route("UpdateProf/{id}/{ime}/{prezime}/{username}/{email}/{pol}/{datumRodjenja}/{opis}/{nastavnoZv}/{obrazovanje}")]// e sad nije li bolje ovde samo preko username?
        [HttpPut]
          public async Task<ActionResult> UpdateInfoProf(int id , string ime, string prezime, string username, string email, Pol pol, DateTime datumRodjenja, string opis, string nastavnoZv, string obrazovanje ){
              try{
                bool provera= proveriUsera(id);
                if(provera==true){
              var profesor= await Context.Profesori.FindAsync(id); 
              if(profesor!= null){
                 if(profesor.Username!=username)
                 {
                   var UserNameExists= await Context.Profesori.Where(p=>p.Username== username).FirstOrDefaultAsync();
                         if (UserNameExists != null)
                            return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "Professor with this username already exists, please try another username!"});
                 }
            profesor.Username= username;
                  
             if(!string.IsNullOrWhiteSpace(ime))
                    profesor.Ime= ime;

                if(!string.IsNullOrWhiteSpace(prezime))
                    profesor.Prezime=prezime;

                // if(!string.IsNullOrWhiteSpace( Slika))
                //     profesor.Slika=  Slika;

                if( pol!=profesor.Polic)
                    profesor.Polic=  pol;   

                if(!string.IsNullOrWhiteSpace( nastavnoZv))
                    profesor.NastavnoZvanje=  nastavnoZv;
                
                if(!string.IsNullOrWhiteSpace( obrazovanje))
                    profesor.Obrazovanje=  obrazovanje;
                
                  
                if(!string.IsNullOrWhiteSpace( opis))
                    profesor.Opis=  opis;
                else
                    profesor.Opis=  opis;
              }
                else{
                 return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "There is no user with this id!"});
                }

              await Context.SaveChangesAsync();
               return Ok("Uspesno izmenjeni podaci!");
              }
              else {
                 return StatusCode(403,"Niste autorizovani!");
              }
              }
              catch(Exception e){
                  return BadRequest(e.Message);
              }
          }

        [Route("AddSubjectProf/{username}/{subId}"),Authorize]
        [HttpPost]
        public async Task<ActionResult> AddSubjectProf(string username, int subId){
            try{
                var prof= await Context.Profesori.Include(p=>p.ProfPredmet).Where(p=>p.Username== username).FirstOrDefaultAsync();
                if(prof!=null){
                    if(proveriUsera(prof.CID)==true){
                        var subject= await Context.Predmeti.Include(p=>p.PredmetProf).Where(p=>p.ID== subId).FirstOrDefaultAsync();
                        if(subject!=null){
                            prof.ProfPredmet.Add(subject);
                            subject.PredmetProf.Add(prof);
                            await Context.SaveChangesAsync();
                            return Ok("Dodat je predmet!");
                        }
                        else{
                            return StatusCode(404,"Ne valja!");
                        }
                    }
                    else{
                        return StatusCode(403,"Niste autorizovani!");
                    }
                }else{
                    return StatusCode(404,"Ne valja nesto");
                }
            }
            catch(Exception e){
                return BadRequest(e.Message);
            }
        }


    //    [Route("CancelClassProf")]
    //    [HttpPut]
//        public async Task<ActionResult> CancelClassProf(){

  //      }
    }
}
