import { TestBed, inject } from '@angular/core/testing';
import { ToolsService } from './tools.service';
import { HubService } from './hub.service';
import { Subject } from 'rxjs';

describe('ToolsService', () => {
  const hubServiceSpy = {
    isStarted$: new Subject(),
    invokeCommand: () => {},
    registerMethods: () => {}
  };

  let service: ToolsService;
  let hubService: HubService;
  const roomName = 'testRoom';
  const commandName = 'testCommand';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ToolsService,
        { provide: HubService, useValue: hubServiceSpy }
      ]
    });
    service = TestBed.get(ToolsService);
    hubService = TestBed.get(HubService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should trigger registerToServer method', () => {
    spyOn(service, 'addReceiveCommand');
    spyOn<any>(service, 'registerToServer');
    service.init();
    hubService.isStarted$.next(true);
    expect(service.addReceiveCommand).toHaveBeenCalled();
    expect(service['registerToServer']).toHaveBeenCalled();
  });

  it('should not trigger registerToServer method before start', () => {
    spyOn(service, 'addReceiveCommand');
    spyOn<any>(service, 'registerToServer');
    service.init();
    hubService.isStarted$.next(false);
    expect(service.addReceiveCommand).toHaveBeenCalled();
    expect(service['registerToServer']).not.toHaveBeenCalled();
  });

  it('should joinRoom with Name', () => {
    service.joinRoom(roomName);
    expect(service['roomName']).toBe(roomName);
  });

  it('should leave room', () => {
    const spy = spyOn(hubService, 'invokeCommand');
    service['roomName'] = roomName;
    service.leaveRoom();
    expect(spy).toHaveBeenCalledWith('LeaveRoom', roomName);
  });

  it('should add receiveCommand', () => {
    const spy = spyOn(hubService, 'registerMethods');
    service.addReceiveCommand();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('ReceiveCommand', jasmine.any(Function));
  });

  it('should send command', () => {
    const spy = spyOn(hubService, 'invokeCommand');

    service['roomName'] = roomName;
    service.sendCommand(commandName);
    expect(spy).toHaveBeenCalledWith('SendCommand', roomName, commandName);
  });

  it('registerToServer should invokeCommand to joinRoom', () => {
    const spy = spyOn(hubService, 'invokeCommand');
    service['registerToServer']();
    expect(hubService.invokeCommand).not.toHaveBeenCalled();

    service['roomName'] = roomName;
    service['registerToServer']();
    expect(spy).toHaveBeenCalledWith('JoinRoom', roomName);
  });
});
