import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/folders";
import { Dialog } from "@microsoft/sp-dialog";

const relativeDestinationUrl:string = "/sites/Kenzhosa/"

export async function createFolder(nombreSousDossier:number, FolderPere:string, referenceDevis:string, id_contrat:number){
    const destinationUrl:string = FolderPere+"/"+referenceDevis;
    let folderName:string = null;
    try{
        const referenceFolderIsExist: boolean = await (await sp.web.getFolderByServerRelativePath(destinationUrl).get()).Exists;
        if(referenceFolderIsExist && FolderPere === "Grands actifs") {
            for(let index=0; index<nombreSousDossier; index++){
                let folderName = relativeDestinationUrl+FolderPere+'/'+referenceDevis+'/'+referenceDevis+'-'+(index+1);
                await createForlderPere(folderName, id_contrat);
            }
        }
    }catch{
        if(FolderPere === "Grands actifs") {
            folderName = relativeDestinationUrl+FolderPere+'/'+referenceDevis;
            await createForlderPere(folderName, id_contrat);
            for(let index=0; index<nombreSousDossier; index++){
                folderName = relativeDestinationUrl+FolderPere+'/'+referenceDevis+'/'+referenceDevis+' - A'+(index+1);
                var folderName2 = folderName+'/Documents '+referenceDevis+' - A'+(index+1);
                var folderName3 = folderName+'/Photos '+referenceDevis+' - A'+(index+1);
                var folderName4 = folderName+'/Dossier des annonces '+referenceDevis+' - A'+(index+1);
                await createForlderPere(folderName, id_contrat);
                await createForlder(folderName2);
                await createForlder(folderName3);
                await createForlder(folderName4);
                await _createExcelSuiviCommercial(referenceDevis, "Grands%20actifs/", folderName)
                await _createExcelSuiviMarketing(referenceDevis, "Grands%20actifs/", folderName)
                console.log("folderName", folderName)
            }
        }
        else if(FolderPere === "Actifs simlpes") {
            folderName = relativeDestinationUrl+FolderPere+'/'+referenceDevis;
            var folderName2 = folderName+'/Documents - '+referenceDevis;
            var folderName3 = folderName+'/Photos - '+referenceDevis;
            var folderName4 = folderName+'/Dossier des annonces - '+referenceDevis;
            await createForlderPere(folderName, id_contrat);
            await createForlder(folderName2);
            await createForlder(folderName3);
            await createForlder(folderName4);
            await _createExcelSuiviCommercial(referenceDevis, "Actifs%20simlpes", folderName)
            await _createExcelSuiviMarketing(referenceDevis, "Grands%20actifs/", folderName)
            console.log("folderName", folderName)
        }
    }
}
export async function createForlder(folderName:string){
    await sp.web.folders.add(folderName);
}
export async function createForlderPere(folderName:string, id_contrat:any){
    //console.log("folderName", folderName);
    await sp.web.folders.add(folderName);
    const folder: any = await sp.web.getFolderByServerRelativePath(folderName).getItem();
    const contrat: any = await sp.web.lists.getByTitle("Contrats").items.getById(id_contrat).get();
    console.log("folder", folder.get())
    console.log("contrat", contrat)
    console.log()
    await folder.update({
        R_x00e9_f_x00e9_rence_x0020_contratId: contrat.Id,
        Soci_x00e9_t_x00e9__x0020_clientId: contrat.Soci_x00e9_t_x00e9__x0020_clientId,
        Montant_x0020_commercialisation: contrat.Montant_x0020_commercialisation,
        Statut_x0020_d_x0027_actif: "En cours de vente"
    });
}
export  const generateCodeFacture = () => {
    const date = new Date();                    //yymmddhhmm
    let code: any = 22*Math.pow(10, 8);         //22=2022
    code += (date.getMonth()+1)*Math.pow(10, 6);//mois*10^6
    code += date.getDate()*Math.pow(10, 4);     //jour*10^4
    code += date.getHours()*Math.pow(10, 2);
    code += date.getMinutes();
    const finale_code = code*75937;
    return finale_code;
}
export function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return day + '/' + month + '/' + year;
}
export async function getSocieteClientInfo(SocieteId:number):Promise<any>{
    //console.log("SocieteId", SocieteId);
    let societe:any = await sp.web.lists.getByTitle("Entreprises").items.getById(SocieteId).get();
    //console.log("societe", societe.WorkAddress);
    return societe;
}
export async function getClientInfo(clientId:number):Promise<any>{
    //console.log("clientId", clientId);
    let client:any = await sp.web.lists.getByTitle("Clients").items.getById(clientId).get();
    //console.log("client", client);
    return client;
}
export async function getVilleInfo(VilleId:number):Promise<any>{
    //console.log("VilleId", VilleId);
    let ville:any = await sp.web.lists.getByTitle("l_villes").items.getById(VilleId).get();
    //console.log("ville", ville);
    return ville;
}
export async function _createExcelSuiviCommercial(referenceDevis:string, TypeActif:string, folderName:string){
    const fileName:string = "Suivi Commercial - "+referenceDevis+".xlsx";
    const templateUrl = "/sites/Kenzhosa/"+TypeActif+"/Forms/SuiviCommercial/SuiviCommercialModel.xlsx";
    await sp.web.getFileByServerRelativeUrl(templateUrl).getBuffer()
    .then(templateData => {
        return sp.web.getFolderByServerRelativeUrl(folderName)
            .files.add(fileName, templateData);
    }).then(file=>{
        return file.file.getItem()
        .then(async item=>{
            await item.get();
            return item.update({
                ContentTypeId: "0x0101000F01C5A4DE868142BF20CD126FD5A4C501"
            })
        });
    });
}
export async function _createExcelSuiviMarketing(referenceDevis:string, TypeActif:string, folderName:string){
    const fileName:string = "Suivi Marketing - "+referenceDevis+".xlsx";
    const templateUrl = "/sites/Kenzhosa/"+TypeActif+"/Forms/SuiviMarketing/SuiviMarketingModel.xlsx";
    await sp.web.getFileByServerRelativeUrl(templateUrl).getBuffer()
    .then(templateData => {
        return sp.web.getFolderByServerRelativeUrl(folderName)
            .files.add(fileName, templateData);
    }).then(file=>{
        return file.file.getItem()
        .then(async item=>{
            await item.get();
            return item.update({
                ContentTypeId: "0x0101000F01C5A4DE868142BF20CD126FD5A4C502"
            })
        });
    });
}