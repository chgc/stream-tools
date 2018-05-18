export class GetCaptionList {
  static readonly type = '[caption] query captions list';
}

export class AddCaption {
  static readonly type = '[caption] add caption';
  constructor(public payload) {}
}

export class UpdateCaption {
  static readonly type = '[caption] update caption';
  constructor(public payload) {}
}

export class RemoveCaption {
  static readonly type = '[caption] remove caption';
  constructor(public id) {}
}
