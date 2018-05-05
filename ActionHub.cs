using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

public class ActionHub : Hub
{
    public async Task sendCommand(string message)
    {
        await Clients.All.SendAsync("receiveCommand", message);
    }
}
