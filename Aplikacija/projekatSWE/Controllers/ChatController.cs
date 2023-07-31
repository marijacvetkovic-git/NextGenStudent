
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
using projekatSWE.Dtos;

namespace projekatSWE.Controllers
{
  [Route("api/[controller]")]
    [ApiController]
    public class ChatContorller : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public Context Context { get; set; }
        public Student? UserNameExists { get; private set; }
        public Student? student { get; private set; }

        public ChatContorller(IConfiguration configuration, Context context)
        {
            _configuration = configuration;
            Context = context;

        }


         [Route("AddMessage")]
        [HttpPost]

            public async Task<ActionResult> AddMessage ([FromBody]Message mess)

            {
                try
                {
                    if(mess.PosiljaocId ==null || mess.PrimaocId==null || mess.Tekst==null || mess.Vreme==null)
                    {
                        return StatusCode(500,"Nije se lepo prenelo, poruka je null");
                    }

                    Message message= new Message();
                    message.PosiljaocId=mess.PosiljaocId;
                    message.PrimaocId=mess.PrimaocId;
                    message.Tekst=mess.Tekst;
                    message.Vreme=mess.Vreme;
                    Context.Messages.Add(message);
                    await Context.SaveChangesAsync();
                    return Ok($"Uspesno dodata poruka {message.Tekst}!");
                }

                catch(Exception e)

                {
                    return BadRequest(e.StackTrace);
                }

            }
        [Route("ReturnMessages")]//ovo nisam sigurna
        [HttpGet]
            public async Task<ActionResult> ReturnMessages([FromBody]ChatMessage ids)
            {

                if(ids.PosiljaocId==null || ids.PrimaocId==null)
                {
                    return StatusCode(500,"Ne valjaju id-jevi");
                }

               var mess = Context.Messages.Where(p=>p.PosiljaocId==ids.PosiljaocId && p.PrimaocId==ids.PrimaocId).ToList();
                return Ok(
                mess.Select(p=> new{

                    Poslao = p.PosiljaocId,
                    Primio = p.PrimaocId,
                    Tekst= p.Tekst,
                    Vreme= p.Vreme
                  
                } 
                )
            );          


            }
    }
}