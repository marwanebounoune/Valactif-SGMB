import { ClientsideWebpart } from "@pnp/sp/clientside-pages";
import { IFolder, sp } from '@pnp/sp/presets/all';
import "@pnp/sp/folders";
import { siteRelativeUrl, web, webPartListId } from "./Constants";


export async function AddWebpartToPage2(page:any, ActifDestinationUrl:string, Actif:any){
   //const page = await sp.web.loadClientsidePage(webRelativePagesUrl+NameActif+".aspx");
    const partDefs = await sp.web.getClientsideWebParts();
    console.log("partDefs", partDefs)
    const partDef = partDefs.filter(c => c.Id === webPartListId);
    /* section du page */
    const section_1 = page.addSection();
    const column_1_1 = section_1.addColumn(6);
    const column_1_2 = section_1.addColumn(6);

    const section_divider = page.addSection();
    const column_divider_1 = section_divider.addColumn(6);
    const column_divider_2 = section_divider.addColumn(6);

    const section_2 = page.addSection();
    const column_2_1 = section_2.addColumn(6);
    const column_2_2 = section_2.addColumn(6);

    const section_divider2 = page.addSection();
    const column_divider_2_1 = section_divider2.addColumn(6);

    const section_3 = page.addSection();
    const column_3_1 = section_3.addColumn(6);

    const partDefDivider = partDefs.filter(c => c.Id ===  "2161a1c6-db61-4731-b97c-3cdb303f7cbb");
    console.log("partDefDivider", partDefDivider)
    if (partDefDivider.length < 1) {
        // we didn't find it so we throw an error
        throw new Error("Could not find the web part");
    }
    const DividerWebPart = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart.setProperties({
       length: 100,
       weight: 6
    });
    /*---------display actif--------------5621265B-7E03-4705-8AB5-EB790BCBF48F----------- 5621265b-7e03-4705-8ab5-eb790bcbf48f------- */
    const partDefDisplayInfo = partDefs.filter(c => c.Id ===  "{47CC7243-3B27-44C0-AA49-84BB894CD87B}");
    console.log("partDefDisplayInfo", partDefDisplayInfo)
    if (partDefDisplayInfo.length < 1) {
        // we didn't find it so we throw an error
        throw new Error("Could not find the web part");
    }
    const part_display_info = ClientsideWebpart.fromComponentDef(partDefDisplayInfo[0]);
    part_display_info.setProperties({
        title: "Informations générales",
        description: Actif.Title,//ActifTitle,//
    });
    column_1_1.addControl(part_display_info);

    /*-------------------bing map web part----------------------------- */
    let pins = [];
    //let location = new Microsoft.Maps.Location(40.05588912963867,-75.52118682861328)
    pins.push(location);
    const partDefBingMap = partDefs.filter(c => c.Id === "e377ea37-9047-43b9-8cdb-a761be2f8e09");

    const part_bing = ClientsideWebpart.fromComponentDef(partDefBingMap[0]);
    part_bing.setProperties({
        title: "Localisation du Bien",
        //address: "40.05588912963867,-75.52118682861328",
        pushPins: [{
            title: Actif.Title,//"label of the pin",
            location:{
                latitude: getLat(Actif.Latitude_x002d_Longitude),//33.51304233788905,
                longitude: getLng(Actif.Latitude_x002d_Longitude)//-7.560209352749043
            }
        }],
        center: {
            latitude: getLat(Actif.Latitude_x002d_Longitude),
            longitude: getLng(Actif.Latitude_x002d_Longitude)
        },

    });
    column_1_2.addControl(part_bing);
    /*divider webpart */
    const DividerWebPart1 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart1.setProperties({
       length: 100,
       weight: 6
    });
    column_divider_1.addControl(DividerWebPart1);
    const DividerWebPart2 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart2.setProperties({
       length: 100,
       weight: 6
    });
    column_divider_2.addControl(DividerWebPart2);
/*-----------------------les images ------------------------- */   
   const partDef_images = partDefs.filter(c => c.Id === "af8be689-990e-492a-81f7-ba3e4cd3ed9c");
   const part_images = ClientsideWebpart.fromComponentDef(partDef_images[0]);
   part_images.setProperties({
       title: "Photographies de l'actif",
   })
   column_2_1.addControl(part_images);
/*---------------------document actif----------------------------------- */
    const part_document_actif = ClientsideWebpart.fromComponentDef(partDef[0]);
    const serverRealtiveWebUrl7: string = (await sp.web.get()).ServerRelativeUrl;
    const library_document_actif = await sp.web.lists.getByTitle("Documents Actifs").expand("RootFolder").get();
    const selectedListId_document_actif: string = library_document_actif.Id;
    const selectedListUrl_document_actif: string = library_document_actif.RootFolder.ServerRelativeUrl;
    const webRelativeListUrl_document_actif: string = selectedListUrl_document_actif.substring(serverRealtiveWebUrl7.length);
    part_document_actif.setProperties({
       //title: "Documents d'Actif",
       isDocumentLibrary: true,
       selectedFolderPath: ActifDestinationUrl,//"Saham/Lot 1/TFZ",
       selectedListId: selectedListId_document_actif,
       selectedListUrl: selectedListUrl_document_actif,
       webRelativeListUrl: webRelativeListUrl_document_actif,
       hideCommandBar: false,
       selectedViewId:1,
       webpartHeightKey: 1,//set size of the webpart to small- about 5 items
       filterBy: {}
    });
    part_document_actif.setServerProcessedContent({
        searchablePlainTexts: {
            listTitle:"Dataroom - "+Actif.Title
        }
    });
    column_2_2.addControl(part_document_actif);

    /*divider webpart */
    const DividerWebPart2_1 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart2_1.setProperties({
       length: 100,
       weight: 6
     });
   
    column_divider_2_1.addControl(DividerWebPart2_1);
    /* save page */
    await page.save();
}
export async function CreatePage(ActifFolderName:string, Actif:any) {
    const ActifDestinationUrl:string = ActifFolderName;
    const actif:number = Actif.Id;
    const pageNameUrl = 'https://valactifcom.sharepoint.com/sites/SGMB/SitePages/'+ActifFolderName + ".aspx";
    const page = await sp.web.addClientsidePage(ActifFolderName, ActifFolderName, "Article");
    page.setBannerImage("/sites/SGMB/SiteAssets/__siteIcon__.jpg");
    let tempPage: any = page; //page object got from above implementation.    
    let pageItemId: number=tempPage.json.Id;
    await page.save();
    AddWebpartToPage2(page, ActifDestinationUrl, Actif);
    await web.lists.getByTitle("Actifs").items.getById(actif).update({
        Lien: {
            Description:"Voir plus ...",
            Url: pageNameUrl
        }
    });
}
//FolderPere === "Document Actif" ou Mes "Expertises" ou "IMAGES" ou "l_etat_locatif"
export async function createFolder(FolderPere:string, ActifFolderName:string) {
    const relativeDestinationUrl:string = siteRelativeUrl+FolderPere;
    const ActifDestinationUrl:string = relativeDestinationUrl+"/"+ActifFolderName;
    //const societeFolder: IFolder = await sp.web.getFolderByServerRelativePath(destinationUrl);
    //const item = await societeFolder.getItem();
    //await sp.web.folders.add('/sites/SGMB/Document Actif/'+societeFolderName+'/'+portefeillleFolderName);
    try{
        const societeFolderIsExist: boolean = await (await sp.web.getFolderByServerRelativePath(relativeDestinationUrl).get()).Exists;
    
        if(societeFolderIsExist){
            try{
                const portefeillleFolderIsExist: boolean = await (await sp.web.getFolderByServerRelativePath(relativeDestinationUrl).get()).Exists;       
                if(portefeillleFolderIsExist){
                    await sp.web.folders.add(relativeDestinationUrl+'/'+ActifDestinationUrl);
                }
            }catch{
                await sp.web.folders.add(relativeDestinationUrl+'/'+relativeDestinationUrl);
                await sp.web.folders.add(relativeDestinationUrl+'/'+ActifDestinationUrl);
            }
        }
    }catch{
        createFolderglobal(relativeDestinationUrl, ActifFolderName);
    }
}
export async function createFolderglobal(relativeDestinationUrl:string, ActifFolderName:string) {
    await sp.web.folders.add(relativeDestinationUrl+'/'+ActifFolderName);
}
export async function createFileInsideFolder(folder: IFolder, file:File, fileName:string) {
    folder.files.add('fileTest', file, false);
}
export async function createFolderglobalPage(societeFolderName:string, portefeillleFolderName:string, ActifFolderName:string) {
    await sp.web.folders.add('/sites/SGMB/SitePages/'+societeFolderName);
    await sp.web.folders.add('/sites/SGMB/SitePages/'+societeFolderName+'/'+portefeillleFolderName);
   // CreatePage(societeFolderName, portefeillleFolderName, ActifFolderName);
}
export async function createFolderInsideList(...args:string[]){
    let args_lenght:number = args.length;// 3 ou 2 args
    let list_name:string = args[0];
    let rootFolder:string = args[1]//'Saham/';
    let folderName:string = ""//'Name1';
    let FileLeafRef:string = "";
    let FileRef:string = "";
    let Title:string = null;
    if(args_lenght === 3){
        folderName = args[2];
        Title = folderName;
        FileLeafRef = rootFolder+'/'+folderName;
        FileRef = '/'+rootFolder+'/'+folderName;
    }
    else{
        Title = rootFolder;
        FileLeafRef = rootFolder;
        FileRef = '/'+rootFolder;
    }
    await web.lists.getByTitle(list_name).items
    .add({ 
      Title: Title,//"Name1", 
      ContentTypeId: "0x0120",
      FileSystemObjectType: 1,
    }).then(result => {
      return result.item.update({
          Title: Title,//"Name1",
          FileLeafRef: FileLeafRef,//rootFolder+'/'+folderName,// 'Saham/Name1',//rootFolder+folderName
          FileRef: FileRef//'/'+rootFolder+'/'+folderName// '/Saham/Name1',//'/'+rootFolder+folderName
          //FileDirRef: '/Saham',
      });
  });
}
export function getLat(latlng:string){
    var lat = latlng.split(",",1)[0];
    return parseFloat(lat);
}
export function getLng(latlng:string){
    var lng = latlng.split(",",2)[1];
    return parseFloat(lng);
}