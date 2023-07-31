using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using projekatSWE.Clients;
using projekatSWE.Dtos;

namespace projekatSWE.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
       
    }
}