using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace stream_tools
{
    public class SimpleHub : Hub
    {
        public async Task SendCommand(CommandModel command)
        {
          var settings = new JsonSerializerSettings()
          {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
          };
      await Clients.All.SendAsync("ReceiveCommand", JsonConvert.SerializeObject(command, settings));
        }
    }
}
