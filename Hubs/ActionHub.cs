using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace stream_tools
{
    public class ActionHub : Hub
    {
        public async Task sendCommand(CommandModel command)
        {
            await Clients.All.SendAsync("receiveCommand", JsonConvert.SerializeObject(command));
        }
    }
}
