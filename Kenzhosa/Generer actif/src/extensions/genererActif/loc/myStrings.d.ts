declare interface IGenererActifCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'GenererActifCommandSetStrings' {
  const strings: IGenererActifCommandSetStrings;
  export = strings;
}
