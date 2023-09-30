export interface CommandValue {
  command: string; value?: any; id?: string;
}

export interface IPCListener {
  notify(args: CommandValue): boolean;
}
