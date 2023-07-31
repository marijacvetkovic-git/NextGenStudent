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
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
//using UserService.ActiveMQ.Connect;

namespace projekatSWE.Controllers
{

   [ApiController]
[Route("api/[controller]")]
 
    public class AdministratorController : ControllerBase
    {


           private readonly IConfiguration _configuration;
              private readonly IUserService _userService;

        public Context Context { get; set; }
         public AdministratorController(IConfiguration configuration, Context context,IUserService userService)

        {

            _configuration = configuration;

            Context = context;
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
       return idrole;
    }
    catch
    {
        return null;
    }
        }
      
           private  bool  proveriUseraAdmin(){
             Request.Headers.TryGetValue("Authorization", out var token);
            string jwt = token.ToString().Split(" ")[1];
            var idandrole= ValidateToken(jwt);
            var userId= int.Parse(idandrole.Split(" ")[0]);
            var  userRole= idandrole.Split(" ")[1];
            if(userRole!="Administrator"){
                return false;// los role
            }        
            return true;
        }
        private bool proveriKorisnika(int id, Role stud){
            Request.Headers.TryGetValue("Authorization", out var token);
            string jwt = token.ToString().Split(" ")[1];
            var idandrole= ValidateToken(jwt);
            var userId= int.Parse(idandrole.Split(" ")[0]);
            var  userRole= idandrole.Split(" ")[1];
            if(userId!=id){
                return false;
            }
            if(userRole!=stud.ToString()){
                return false;
            }
            return true;
        }

        
        [Route("BanUser"),Authorize]
        [HttpPut]
        public async Task<ActionResult> BanUser([FromBody]Administrator admin)//da li treba da mu se oduzme role nekako? ili samo da se proverava pri login da li mu je status banovan
        {
            try{  
            var user = Context.Clanovi.Where(p=>p.Username==admin.Username).FirstOrDefault();
            if(user==null)
            {
                return StatusCode(402,"Ne postoji user sa tim username");
            }
            if(proveriUseraAdmin()==true){
            if(user.Banovan==false)
             {
             user.Banovan=true;
            await Context.SaveChangesAsync();

               return Ok("Uspesno izmenjeni podaci!");
             }
            else{
                return StatusCode(202,"User je vec banovan");
                }
             }            
             else
             {
             return StatusCode(403,"Niste autorizovani!");
             }
            }
            catch (Exception e){
                return BadRequest(e.InnerException.Message);
            }
        }


        [Route("ListAllBanUsers"),Authorize]
        [HttpGet]
        public async Task<ActionResult> ListAllBanUsers()
        {
            try{
             
                if(proveriUseraAdmin()==true)
                {
                    var list= await Context.Clanovi.Where(p=>p.Banovan==true).ToListAsync();
                       return Ok(
                    list.Select(p=>
                    new{
                      Username= p.Username,
                      Ime= p.Ime,
                      Prezime=p.Prezime,
                      Banovan = p.Banovan

                    }

                    )
                );  
                }
               else
             {
             return StatusCode(403,"Niste autorizovani!");
             }
            }
           catch(Exception e){
            return BadRequest(e.Message);
        }
    }

        [Route("ListAllNonBanUsers"),Authorize]
        [HttpGet]
        public async Task<ActionResult> ListAllNonBanUsers()
        {
            try{
                 if(proveriUseraAdmin()==true)
                {
                    var list= await Context.Clanovi.Where(p=>p.Banovan==false && p.Uloga!=Role.Administrator).ToListAsync();

             return Ok(
                    list.Select(p=>
                    new{
                      Username= p.Username,
                      Ime= p.Ime,
                      Prezime=p.Prezime,
                      Banovan = p.Banovan

                    }

                    )
                );  
                }
                 else
             {
             return StatusCode(403,"Niste autorizovani!");
             }
            
            }
           catch(Exception e){
            return BadRequest(e.Message);
        }
    }
        
        [Route("ListAllUsers"),Authorize]
        [HttpGet]
        public async Task<ActionResult> ListAllUsers()
        {
            try{

            if(proveriUseraAdmin()==true)
               {
                    var list= await Context.Clanovi.Where(p=>p.Uloga!=Role.Administrator).ToListAsync();

             return Ok(
                    list.Select(p=>
                    new{
                      Username= p.Username,
                      Ime= p.Ime,
                      Prezime=p.Prezime,
                      Banovan = p.Banovan

                    }

                    )
                );  
               }
               else
             {
             return StatusCode(403,"Niste autorizovani!");
             }
            }
           catch(Exception e){
            return BadRequest(e.Message);
        }
    }

        [Route("PrijaviKorisnika"),Authorize] //u koji kontroler da stavim ovu fju da bih mogla clana da proverim? 
        [HttpPost]
        public async Task<ActionResult> PrijaviKorisnika([FromBody]PrijavaDto prijava){
           try{
        
            var prijavljen= await Context.Clanovi.Where(p=>p.Username== prijava.UsernamePrijavljenog).FirstOrDefaultAsync();
            var prijavio= await Context.Clanovi.Where(p=>p.Username== prijava.UsernameKoJe).FirstOrDefaultAsync();
            if(prijavljen==null || prijavio==null){
                return StatusCode(404,"Wrong username");
            }    
            if(proveriKorisnika(prijavio.CID,prijavio.Uloga)){
            Prijava pr= new Prijava();
            pr.Razlog= prijava.Razlog;
            pr.UsernameKoJe= prijava.UsernameKoJe;
            pr.UsernamePrijavljenog= prijava.UsernamePrijavljenog;
            pr.provereno= false;
            Context.Prijave?.Add(pr);
            await Context.SaveChangesAsync();
            return Ok("Uspesno ste prijavili korisnika!");
                }else{
                    return StatusCode(403,"Niste autorizovani!");
                }
           }catch(Exception e){
             return BadRequest(e.Message);
           }
        }

        [Route("PrikaziSvePrijave")]
        [HttpGet]
        public async Task<ActionResult> PrikaziSvePrijave(){
            try{

                var listaPrijava= await Context.Prijave.ToListAsync();
                if(listaPrijava!=null){
                    return Ok(listaPrijava.Select(p=> new{
                        PrijavaId= p.idPrijave,
                        Prijavljen= p.UsernamePrijavljenog,
                        Razlog= p.Razlog,
                        Prijavio= p.UsernameKoJe,
                    }));
                }
                else{
                    return StatusCode(202,"Nema neproverenih prijava!");
                }
            }catch(Exception e){
                return BadRequest(e.Message);
            }
        }

        [Route("ProvernaPrijava/{idPrijave}"),Authorize]
        [HttpDelete]
        public async Task<ActionResult> ProverenaPrijava(int idPrijave){
                //usernameKoJe nek bude id administratora zbog prijave
                try{
                    if(proveriUseraAdmin()==true){
                        var pr= await Context.Prijave.Where(p=>p.idPrijave==idPrijave).FirstOrDefaultAsync();
                        if(pr!=null){
                        Context.Prijave.Remove(pr);
                        await Context.SaveChangesAsync();
                        return Ok("Provereno!");
                        }else{
                            return StatusCode(404,"Los id prijave!");
                        }
                    }else{
                        return StatusCode(403,"Niste autorizovani!");
                    }
                }catch(Exception e){
                    return BadRequest(e.Message);
                }
        }

}
}