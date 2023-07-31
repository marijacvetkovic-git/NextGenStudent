using System.Threading.Tasks;
using projekatSWE.Dtos;

namespace projekatSWE.Clients
{
    public interface IChatClient
    {
        Task ReceiveMessage(ChatMessage message);
    }
}