using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace stream_tools
{
    public class SimpleHub : Hub
    {
        public async Task SendCommand(CommandModel command)
        {
            await Clients.All.SendAsync("ReceiveCommand", JsonConvert.SerializeObject(command));
        }
    }
}
