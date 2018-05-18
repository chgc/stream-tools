import { ObsService } from './obs.service';
import { Subject } from 'rxjs';
import { ObsSocketService } from './obs-socket.service';

describe('ObsService', () => {
  let service: ObsService;
  let ObsSocketServiceSpy;
  let mockObs: Subject<any>;

  beforeEach(() => {
    ObsSocketServiceSpy = jasmine.createSpyObj('ObsSocketService', ['connect']);
    service = new ObsService(ObsSocketServiceSpy);
  });

  beforeEach(() => {
    mockObs = new Subject();
    ObsSocketServiceSpy.connect.and.returnValue(mockObs);
  });

  it('should create ObsService', () => {
    expect(service).toBeTruthy();
  });

  it('requestTask should return an id and type', () => {
    const { id, type } = service.requestTask('test');
    expect(id).toBe('1');
    expect(type).toBe('test');
  });

  it('should create a request command with message-id', () => {
    service.connect();
    mockObs.subscribe(value => {
      expect(value).toEqual({ 'message-id': '2', 'request-type': 'test' });
    });
    service.requestCommand(service.requestTask('test'));
  });

  it('should clear task list if there is more than 100 tasks', () => {
    for (let i = 0; i < 51; ++i) {
      service.requestTask(i);
    }
    expect(service['task'].size).toBe(1);
  });

  it('should be able to get action type from Task with id', () => {
    const { id, type } = service.requestTask('mockAction');
    expect(service.getActionType({ 'message-id': id })).toEqual({
      id,
      actionType: type
    });
  });

  it('it should stop', () => {
    service.disconnect();
    expect(service['obs$']).toBeUndefined();
  });
});
