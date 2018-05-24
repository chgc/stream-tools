export class SourceRenderToggle {
  static readonly type = '[source] set source toggle';
  constructor(public source) {}
}

export class GetSourceMuteState {
  static readonly type = '[source] get source mute state';
}

export class SourceMuteToggle {
  static readonly type = '[source] toggle source mute state';
  constructor(public source) {}
}
