import { TestBed, inject } from '@angular/core/testing';
import { HubService } from './hub.service';

describe('HubService', () => {
  let hubService: HubService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HubService]
    });

    hubService = TestBed.get(HubService);
  });

  it('should create hubConnection when service is create', () => {
    expect(hubService['hubConnection']).not.toBeUndefined();
  });

  it('should call start method', () => {
    spyOn(hubService['hubConnection'], 'start').and.returnValue(
      Promise.resolve()
    );
    hubService.start();
    expect(hubService['hubConnection'].start).toHaveBeenCalled();
  });

  it('should call start and fail', async () => {
    spyOn(hubService['hubConnection'], 'start').and.returnValue(
      Promise.reject('error')
    );
    hubService.start();
    hubService['hubConnection'].start().catch(err => {
      expect(err).toBe('error');
    });
  });

  it('should registerMehtods', () => {
    const spy = spyOn(hubService['hubConnection'], 'on');
    const methodName = 'methodName';
    const callback = () => {};
    hubService.registerMethods(methodName, callback);
    expect(spy).toHaveBeenCalledWith(methodName, callback);
  });

  it('should unregisterMethods', () => {
    const spy = spyOn(hubService['hubConnection'], 'off');
    const methodName = 'methodName';
    hubService.unregisterMethods(methodName);
    expect(spy).toHaveBeenCalledWith(methodName);
  });

  it('should invokeCommand with success', () => {
    const spy = spyOn(hubService['hubConnection'], 'invoke').and.returnValue(
      Promise.resolve()
    );
    const methodName = 'methodName';
    const args = 'arg1';
    hubService.invokeCommand(methodName, args);
    expect(spy).toHaveBeenCalledWith(methodName, args);
  });

  it('should invokeCommand with fail', () => {
    const spy = spyOn(hubService['hubConnection'], 'invoke').and.returnValue(
      Promise.reject(new Error('error'))
    );
    const methodName = 'methodName';
    const args = 'arg1';
    hubService.invokeCommand(methodName, args);
    expect(spy).toHaveBeenCalledWith(methodName, args);
  });
});
