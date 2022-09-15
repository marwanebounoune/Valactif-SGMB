export interface IGenererActifDialogContentProps {
    message: string;
    close: () => void;
    submit: (numbre_dossier:number, FolderPere:string) => void;
  }