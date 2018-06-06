export interface CommandModel {
  command: string;
  message: string;
  className: string;
  style: { [key: string]: string };
}

export interface CommandModelTemp {
  Command: string;
  Message: string;
  ClassName: string;
  Style: { [key: string]: string };
}
