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
using System.IO;
//using UserService.ActiveMQ.Connect;

namespace projekatSWE.Controllers
{

   [ApiController]
[Route("api/[controller]")]
 
    public class AuthenticateController : ControllerBase
    {


        public Context Context {get; set; }
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        private readonly IWebHostEnvironment _hostEnvironment;

        public AuthenticateController(IConfiguration configuration, Context context, IUserService userService, IWebHostEnvironment hostEnvironment)
        {
            _configuration = configuration;
            Context= context;
            _userService= userService;
            this._hostEnvironment= hostEnvironment;
        
        }
        [HttpGet,Authorize]
        public ActionResult<string> GetUser(){
            var userName= _userService.GetMyRole();
            var userRole= _userService.GetMyName();

            return Ok(new {userName, userRole});
        }

       [HttpPost]
        [Route("Loginfunc"),AllowAnonymous]
          public async Task<ActionResult<string>> Login([FromBody]LogInForm forma)
        {           
		      var n = new Clan();
              n = Context?.Clanovi?.Where(p=>p.Username.Equals(forma.Username)).FirstOrDefault();
                if(n==null)
                {
                return StatusCode(202,"Ne nalazi username"+ forma.Username);
                }
            // if(n.Banovan==true)
            // return StatusCode(500,"User banovan!");

            var  PasswordHash= n.PasswordHash;
            var PasswordSalt= n.PasswordSalt;
        
            if (!VerifyPasswordHash(forma.Password, PasswordHash,PasswordSalt))
            {
                return StatusCode(202,"Ne nalazi pass");
            }
            if(n.Banovan==true)
            return StatusCode(505,"Banovan je, ne kreiraj token!");

            string token = CreateToken(n);

            return Ok(
                new
                {
                    Token = token   
                }        
            );
        }

        [Route("register-student"),AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<Student>> RegisterStudent([FromBody]RegisterStudentDto s){

           var userExists = await Context.Clanovi.Where(p=>p.Username ==s.Username).FirstOrDefaultAsync();
                 if (userExists != null)
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "User with this username already exists, please try another username!"});

            var EmailExists= await Context.Clanovi.Where(p=>p.Email == s.Email).FirstOrDefaultAsync();
                if(EmailExists != null)
                     return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "User with this email already exists!"});
           
            if(s.Password==null)
            return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "Password is null"});

            CreatePasswordHash(s.Password, out byte[] passwordHash, out byte[] passwordSalt);

            // var faks= await Context.Fakulteti.FindAsync(s.FakultetId);

            Student novi= new Student();
            // if(faks!=null){
            //      novi.NazivFakulteta?.Add(faks);
            //     faks.FakultetStudent?.Add(novi);
            // }
            novi.Banovan= false;
            novi.Uloga=Role.Student;
            novi.PasswordHash= passwordHash;
            novi.PasswordSalt= passwordSalt;
            novi.Username= s.Username;
            novi.DatumRodjenja= s.DatumRodjenja;
            novi.Email= s.Email;
            novi.Grad= s.Grad;
            novi.Ime= s.Ime;
            novi.Prezime= s.Prezime;
            novi.Polic= s.Polic;
            novi.Opis= s.Opis;
            novi.Studija= s.Studija;
            novi.GodinaStudija= s.GodinaStudija;
            
            try{
            Context?.Clanovi?.Add(novi);
            await Context.SaveChangesAsync();
              return Ok("Student je uspesno registrovan!");
            }
            catch (Exception e){
                return BadRequest(e.InnerException.Message);
            }
        }

        [Route("UploadImage/{username}"),Authorize]
        [HttpPost]
        public async Task<ActionResult> UploadImage(string username,[FromForm]FileUpload fu){
             Request.Headers.TryGetValue("Authorization", out var token);
             var clan=Context.Clanovi.Where(p=>p.Username==username).FirstOrDefault();
                  string jwt = token.ToString().Split(" ")[1];
                  var idandrole= ValidateToken(jwt);
                  var userId= int.Parse(idandrole.Split(" ")[0]);
                  var  userRole= idandrole.Split(" ")[1];
                  if(userId==null || clan.CID!= userId ){
                  return StatusCode(403,"Pokusavas za drugog da kreiras a?");
                  }
            if(clan==null){
                  return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "Wrong!"});
            }
            clan.Slika= await SaveImage(fu,username);
              try{
            await Context.SaveChangesAsync();
              return Ok(clan.Slika);
            }
            catch (Exception e){
                return BadRequest(e.InnerException.Message);
            }
            return Ok("Bravo!");
        }

        [Route("register-professor"),AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<Profesor>> RegisterProfessor([FromBody]RegisterProfessor prof){

           var userExists = await Context.Clanovi.Where(p=>p.Username== prof.Username).FirstOrDefaultAsync();
                 if (userExists != null)
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "User with this username already exists, please try another username!"});

            var EmailExists= await Context.Clanovi.Where(p=>p.Email == prof.Email).FirstOrDefaultAsync();
                if(EmailExists != null)
                     return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "User with this email already exists!"});

            if(prof.Password==null)
            return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "Password is null"});

            CreatePasswordHash(prof.Password, out byte[] passwordHash, out byte[] passwordSalt);

            Profesor noviProf= new Profesor();
            noviProf.Banovan= false;
            noviProf.Uloga= Role.Profesor;
            noviProf.PasswordHash= passwordHash;
            noviProf.PasswordSalt= passwordSalt;
            noviProf.Ime= prof.Ime;
            noviProf.Prezime= prof.Prezime;
            noviProf.DatumRodjenja= prof.DatumRodjenja;
            noviProf.Email= prof.Email;
            noviProf.NastavnoZvanje= prof.NastavnoZvanje;
            noviProf.Obrazovanje= prof.Obrazovanje;
            noviProf.Opis= prof.Opis;
            noviProf.Polic= prof.Polic;
            noviProf.Username= prof.Username;
            noviProf.ocenaProsek= 0;
            Raspored sch = new Raspored();
         //   sch.RasporedProfesor=noviProf;
            Context.Rasporedi?.Add(sch);
            await Context.SaveChangesAsync();
            noviProf.ProfesorRaspored=sch;
            try{
            Context.Clanovi.Add(noviProf);
            await Context.SaveChangesAsync();
              return Ok("Profesor je uspesno registrovan!");
            }
            catch (Exception e){
                return BadRequest(e.InnerException.Message);
            }
        }

        
        [Route("DeleteProfile/{username}/{pass}"),Authorize]
        [HttpDelete]
        public async Task<ActionResult> DeleteProfile(string username,string pass)
        {
    try{
            Clan p =  Context.Clanovi.Where(p=>p.Username==username).FirstOrDefault();
            if(p!=null)
            {   
                bool provera= proveriUsera(p.CID, p.Uloga);
                if(provera==true){
            
                if (!VerifyPasswordHash(pass, p.PasswordHash,p.PasswordSalt))
                {
                return StatusCode(202,"Wrong password!");
                }
                    if(p.Uloga==Role.Profesor){
                    Profesor prof= Context.Profesori.Include(p=>p.ProfesorRaspored).Where(p=>p.Username==username).FirstOrDefault();
                    Raspored r =prof.ProfesorRaspored;
                    if(r!=null){
                     var casovi=  await Context.Casi.Include(p=>p.CasRaspored).Where(p=> p.CasRaspored== r).ToListAsync();
                        if(casovi.Count!=0){
                            casovi.ForEach(p=>{
                              Context.Casi.Remove(p);
                            });
                        }
                    Context.Rasporedi.Remove(r);
                    }

                       var komentari= await Context.Komentari.Include(p=>p.KomentarProfa).Where(p=> p.KomentarProfa== prof).ToListAsync();
                       if(komentari.Count!=0){
                            komentari.ForEach(p=>{
                                Context.Komentari.Remove(p);
                            });
                        }

                        var ocenee= await Context.Ocene.Include(p=>p.prof).Where(p=> p.prof== prof).ToListAsync();
                        if(ocenee.Count!=0){
                            ocenee.ForEach(p=>{
                                Context.Ocene.Remove(p);
                            });
                        }
                    Context.Profesori.Remove(prof);
                    await Context.SaveChangesAsync();
                    return Ok("Obrisan profesor!");
                    }else if(p.Uloga==Role.Student){
                        Student stud= Context.Studenti.Where(p=>p.Username==username).FirstOrDefault();
                        var lista= await Context.Oglasi.Include(p=>p.StudentOglas).Where(p=> p.StudentOglas== stud).ToListAsync();
                        if(lista.Count!=0){
                            lista.ForEach(p=>{
                                Context.Oglasi.Remove(p);
                            });
                        }
                        var komentari= await Context.Komentari.Include(p=>p.KomentarStudent).Where(p=> p.KomentarStudent== stud).ToListAsync();
                        if(komentari.Count!=0){
                            komentari.ForEach(p=>{
                                Context.Komentari.Remove(p);
                            });
                        }

                        var ocenee= await Context.Ocene.Include(p=>p.stud).Where(p=> p.stud== stud).ToListAsync();
                        if(ocenee.Count!=0){
                            ocenee.ForEach(p=>{
                                Context.Ocene.Remove(p);
                            });
                        }
                        var casovi=  await Context.Casi.Include(p=>p.CasStudent).Where(p=> p.CasStudent== stud).ToListAsync();
                        if(casovi.Count!=0){
                            casovi.ForEach(p=>{
                                p.Zakazan=false;
                            });
                        }
                        Context.Studenti.Remove(stud);
                        await Context.SaveChangesAsync();
                        return Ok("Obrisan student!");
                    }
                    else{
                         return StatusCode(StatusCodes.Status500InternalServerError, new Response {Status = "Error", Message= "Admin can not be deleted!"});
                    }
                }
                else {
                 return StatusCode(403,"Niste autorizovani!");
                }
            }
            else{
                    return BadRequest();
                }
            }catch(Exception e){
                return BadRequest(e.InnerException);
            }
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out  byte[] passwordSalt){
            using (var hkey= new HMACSHA512()){
                passwordSalt = hkey.Key;
                passwordHash = hkey.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }   

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt){
            using (var hkey= new HMACSHA512(passwordSalt)){
                var computedHash = hkey.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        private string CreateToken(Clan cl)
        {
            string uloga="";
            if(cl.Uloga==Role.Student)
            {
                uloga="Student";
            }
            else if(cl.Uloga==Role.Profesor)
            {
                uloga="Profesor";
            }
            else if(cl.Uloga==Role.Administrator)
            {
                uloga="Administrator";
            }
            List<Claim> claims = new List<Claim>
            {
               new Claim(ClaimTypes.NameIdentifier, cl.CID.ToString()),
               new Claim(ClaimTypes.Name, cl.Username),
               new Claim(ClaimTypes.Role, uloga),
               new Claim(ClaimTypes.Actor, cl.Banovan.ToString()),
               new Claim(ClaimTypes.Expiration, DateTime.Now.AddMinutes(60).ToString())
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        [NonAction]
        public async Task<string> SaveImage(FileUpload imageFile, string username)
        {
          try{
            string path =  username + "-" +  DateTime.Now.ToString("yymmssfff") + Path.GetExtension(imageFile.Slika.FileName);
            var user = Context.Clanovi.Where(p => p.Username == username).FirstOrDefault();
            
            if(user.Slika != null){
                string temppath =_hostEnvironment.ContentRootPath +"Images\\"+ user.Slika;
                System.IO.File.Delete(temppath);
            }

            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", path);
            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.Slika.CopyToAsync(fileStream);
            }
                return path;
          }
        catch(Exception e){
            Console.WriteLine(e.Message);
        }
        return null;
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
        var userId = int.Parse(jwtToken.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
        var roleUser= jwtToken.Claims.First(x=> x.Type== ClaimTypes.Role).Value;
        string idrole= userId.ToString()+ " "+ roleUser;
       return idrole;
    }
    catch
    {
        return null;
    }
        }

        
    private bool  proveriUsera(int idp, Role uloga){
             Request.Headers.TryGetValue("Authorization", out var token);
            string jwt = token.ToString().Split(" ")[1];
            var idandrole= ValidateToken(jwt);
            var userId= int.Parse(idandrole.Split(" ")[0]);
            var  userRole= idandrole.Split(" ")[1];
            if(userRole!= uloga.ToString()){
                 return false; //nije dobra uloga
            }
            if(userId==null || idp!= userId ){
                return false; //nije dobar username
            }
            return true;
        }





    
    }
}