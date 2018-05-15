using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace stream_tools
{
  public class ActionHub : Hub
  {
    public Dictionary<string, string> rooms;

    public ActionHub()
    {
      rooms = new Dictionary<string, string>();
    }

    public async Task JoinRoom(string roomName)
    {
      await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
    }

    public async Task LeaveRoom(string roomName)
    {
      await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
    }

    public async Task SendCommand(string roomName, CommandModel command)
    {
      await Clients.Group(roomName).SendAsync("ReceiveCommand", JsonConvert.SerializeObject(command));
    }
  }
}
