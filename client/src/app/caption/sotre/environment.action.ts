export class SetUserID {
  static readonly type = '[caption] set user id';
  constructor(public uid: string) {}
}

export class SetDisplayUrl {
  static readonly type = '[caption] set display url';
}

export class GetAreaPosition {
  static readonly type = '[caption] get areaPosition';
}

export class SetAreaPosition {
  static readonly type = '[caption] set areaPosition';
  constructor(public payload) {}
}
export class GetCustomCSS {
  static readonly type = '[caption] get customCSS';
  constructor(public payload = '') {}
}

export class SetCustomCSS {
  static readonly type = '[caption] set customCSS';
  constructor(public payload) {}
}
