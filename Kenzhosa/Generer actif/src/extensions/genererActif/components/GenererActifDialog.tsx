import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog, Dialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import GenererActifDialogContent from './GenererActifDialogContent';
import { createFolder } from '../utils';
import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/folders";

export default class GenererActifDialog extends BaseDialog {
    public message: string;
    public referenceContrat: string;
    public nombre_dossier: number;
    public Statut: string;
    public id_contrat:number;
    public constructor() {
        super();

    }
    public render(): void {
        ReactDOM.render(<GenererActifDialogContent
        close={ this.close }
        message={ this.message }
        submit={ this._submit }
        />, this.domElement);
    }
    
    public getConfig(): IDialogConfiguration {
        return {
        isBlocking: false
        };
    }
    
    protected onAfterClose(): void {
        super.onAfterClose();
        ReactDOM.unmountComponentAtNode(this.domElement);
    }
    
    private _submit = async (nombre_dossier: number, FolderPere:string) => {
        this.close();
        this.nombre_dossier = nombre_dossier;
        await sp.web.lists.getByTitle("Contrats").items.getById(this.id_contrat).get().then(res => {
            console.log("RES =>", res)
        })
        .then(async res=>{
            if(FolderPere === "Actifs simlpes"){
                await createFolder(this.nombre_dossier, FolderPere, this.referenceContrat, this.id_contrat);
                Dialog.alert(`L'actif est généré avec succès.`);
            }
            else{
                await createFolder(this.nombre_dossier, FolderPere, this.referenceContrat, this.id_contrat);
                Dialog.alert(`Les actifs sont générés avec succès.`);
            }
        }).catch(error => {
            if(error.response.status === 423)
              Dialog.alert(`Le fichier est verrouillé, Veuillez fermer ce fichier pour continuer.`);
        });
    }
}