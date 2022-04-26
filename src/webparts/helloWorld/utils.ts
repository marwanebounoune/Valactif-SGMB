import * as turf from "@turf/turf";
import * as haversine from "haversine";
import "@pnp/sp/webs";
import { ClientsideWebpart } from "@pnp/sp/clientside-pages";
import { sp, IFolder } from '@pnp/sp/presets/all';
import { siteRelativeUrl, webPartListId, DGI_COEFFICIENT_FILTER, MAX_SCORE, MIN_SCORE, RATIO, SITUATION_GENERAL_COEFFICIENT, STANDING_APPARTEMENT_COEFFICIENT, STANDING_IMMEUBLE_COEFFICIENT, SURFACE_COEFFICIENT, web } from "./Constants";
import { Dialog } from '@microsoft/sp-dialog';
export const reducer = (previousValue, currentValue) => previousValue + currentValue;

export async function AddWebpartToPage2(page:any, ActifDestinationUrl:string, Actif:any){
    //const page = await sp.web.loadClientsidePage(webRelativePagesUrl+NameActif+".aspx");
    const partDefs = await sp.web.getClientsideWebParts();
    console.log("partDefs", partDefs);
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
    const column_divider2_1 = section_divider2.addColumn(6);
    const column_divider2_2 = section_divider2.addColumn(6);

    const section_3 = page.addSection();
    const column_3_1 = section_3.addColumn(6);
    const column_3_2 = section_3.addColumn(6);

    const section_divider3 = page.addSection();
    const column_divider3_1 = section_divider3.addColumn(6);
    const column_divider3_2 = section_divider3.addColumn(6);

    const section_4 = page.addSection();
    const column_4_1 = section_4.addColumn(6);
    const column_4_2 = section_4.addColumn(6);


    const partDefDivider = partDefs.filter(c => c.Id ===  "2161a1c6-db61-4731-b97c-3cdb303f7cbb");
    if (partDefDivider.length < 1) {
        throw new Error("Could not find the web part -------------");
    }
    const DividerWebPart = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart.setProperties({
        length: 100,
        weight: 6
    });
    /*---------display actif--------------5621265B-7E03-4705-8AB5-EB790BCBF48F----------- 5621265b-7e03-4705-8ab5-eb790bcbf48f------- */
    const partDefDisplayInfo = partDefs.filter(c => c.Id === "{8E8A5B66-7093-43D3-90A8-80AFF7B7A50A}");
    // const partDefDisplayInfo = partDefs.filter(c => c.Id === "{8e8a5b66-7093-43d3-90a8-80aff7b7a50a}");
    if (partDefDisplayInfo.length < 1) {
        throw new Error("Could not find the web part DISPLAY INFO");
    }
    const part_display_info = ClientsideWebpart.fromComponentDef(partDefDisplayInfo[0]);
    part_display_info.setProperties({
        title: "Informations générales",
        description: Actif.Title,//ActifTitle,//
    });
    column_1_1.addControl(part_display_info);
    /*-------------------bing map web part----------------------------- */
    let pins = [];
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
    /*---------------------Add 2 devider----------------------------------- */
    const DividerWebPart1 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart1.setProperties({length: 100, weight: 6});
    column_divider_1.addControl(DividerWebPart1);
    const DividerWebPart2 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart2.setProperties({length: 100, weight: 6});
    column_divider_2.addControl(DividerWebPart2);
    /*---------------------images actif----------------------------------- */
    const part_images_actif = ClientsideWebpart.fromComponentDef(partDef[0]);
    // console.log("part_document_actif", part_document_actif);
    const serverRealtiveWebUrl6: string = (await sp.web.get()).ServerRelativeUrl;
    const library_images_actif = await sp.web.lists.getByTitle("IMAGES").expand("RootFolder").get();
    const selectedListId_images_actif: string = library_images_actif.Id;
    const selectedListUrl_images_actif: string = library_images_actif.RootFolder.ServerRelativeUrl;
    const webRelativeListUrl_images_actif: string = selectedListUrl_images_actif.substring(serverRealtiveWebUrl6.length);
    part_images_actif.setProperties({
        isDocumentLibrary: true,
        selectedFolderPath: ActifDestinationUrl,
        selectedListId: selectedListId_images_actif,
        selectedListUrl: selectedListUrl_images_actif,
        webRelativeListUrl: webRelativeListUrl_images_actif,
        hideCommandBar: false,
        selectedViewId:1,
        webpartHeightKey: 1,
        filterBy: {}
    });
    part_images_actif.setServerProcessedContent({
        searchablePlainTexts: {
            listTitle:"Images - "+Actif.Title
        }
    });
    column_2_1.addControl(part_images_actif);
    /*---------------------document actif----------------------------------- */
    const part_document_actif = ClientsideWebpart.fromComponentDef(partDef[0]);
    // console.log("part_document_actif", part_document_actif);
    const serverRealtiveWebUrl7: string = (await sp.web.get()).ServerRelativeUrl;
    const library_document_actif = await sp.web.lists.getByTitle("Documents Actifs").expand("RootFolder").get();
    const selectedListId_document_actif: string = library_document_actif.Id;
    const selectedListUrl_document_actif: string = library_document_actif.RootFolder.ServerRelativeUrl;
    const webRelativeListUrl_document_actif: string = selectedListUrl_document_actif.substring(serverRealtiveWebUrl7.length);
    part_document_actif.setProperties({
        isDocumentLibrary: true,
        selectedFolderPath: ActifDestinationUrl,
        selectedListId: selectedListId_document_actif,
        selectedListUrl: selectedListUrl_document_actif,
        webRelativeListUrl: webRelativeListUrl_document_actif,
        hideCommandBar: false,
        selectedViewId:1,
        webpartHeightKey: 1,
        filterBy: {}
    });
    part_document_actif.setServerProcessedContent({
        searchablePlainTexts: {
            listTitle:"Dataroom - "+Actif.Title
        }
    });
    column_2_2.addControl(part_document_actif);
    /*---------------------Add devider----------------------------------- */
    const DividerWebPart3 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart3.setProperties({length: 100, weight: 6});
    column_divider2_1.addControl(DividerWebPart3);
    const DividerWebPart4 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart4.setProperties({length: 100, weight: 6});
    column_divider2_2.addControl(DividerWebPart4);
    /*---------Desctiptif du bien--------------5621265B-7E03-4705-8AB5-EB790BCBF48F----------- 5621265b-7e03-4705-8ab5-eb790bcbf48f------- */
    const partDefDescriptifDossier = partDefs.filter(c => c.Id ===  "{B6B42971-ECDB-4BD6-8983-A52521743304}");
    // const partDefDescriptifDossier = partDefs.filter(c => c.Id ===  "{b6b42971-ecdB-4bd6-8983-a52521743304}");
    // console.log("partDefMpComparable", partDefDescriptifDossier)
    if (partDefDescriptifDossier.length < 1) {
        throw new Error("Could not find the web part DESCRIPTIF ACTIF");
    }
    const part_desc_dossier = ClientsideWebpart.fromComponentDef(partDefDescriptifDossier[0]);
    // console.log("part_map_comparables", part_desc_dossier)
    part_desc_dossier.setProperties({
        title: "Descriptif du bien",
        description: Actif.Title
    });
    column_3_1.addControl(part_desc_dossier);
    /*---------------------document actif----------------------------------- */
    const part_rapport_actif = ClientsideWebpart.fromComponentDef(partDef[0]);
    // console.log("part_document_actif", part_document_actif);
    const serverRealtiveWebUrl8: string = (await sp.web.get()).ServerRelativeUrl;
    const library_rapport_actif = await sp.web.lists.getByTitle("Rapports").expand("RootFolder").get();
    const selectedListId_rapport_actif: string = library_rapport_actif.Id;
    const selectedListUrl_rapport_actif: string = library_rapport_actif.RootFolder.ServerRelativeUrl;
    const webRelativeListUrl_rapport_actif: string = selectedListUrl_rapport_actif.substring(serverRealtiveWebUrl8.length);
    part_rapport_actif.setProperties({
        isDocumentLibrary: true,
        selectedFolderPath: ActifDestinationUrl,
        selectedListId: selectedListId_rapport_actif,
        selectedListUrl: selectedListUrl_rapport_actif,
        webRelativeListUrl: webRelativeListUrl_rapport_actif,
        hideCommandBar: false,
        selectedViewId:1,
        webpartHeightKey: 1,
        filterBy: {}
    });
    part_rapport_actif.setServerProcessedContent({
        searchablePlainTexts: {
            listTitle:"Rapport - "+Actif.Title
        }
    });
    column_3_2.addControl(part_rapport_actif);
    /*---------------------Add devider----------------------------------- */
    const DividerWebPart5 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart5.setProperties({length: 100, weight: 6});
    column_divider3_1.addControl(DividerWebPart5);
    const DividerWebPart6 = ClientsideWebpart.fromComponentDef(partDefDivider[0]);
    DividerWebPart6.setProperties({length: 100, weight: 6});
    column_divider3_2.addControl(DividerWebPart6);
    /*---------Map comparables--------------5621265B-7E03-4705-8AB5-EB790BCBF48F----------- 5621265b-7e03-4705-8ab5-eb790bcbf48f------- */
    const partDefMpComparable = partDefs.filter(c => c.Id ===  "{F50E4566-1CDC-4C63-BBA4-EAF5924ABFBE}");
    // const partDefMpComparable = partDefs.filter(c => c.Id ===  "{f50e4566-1cdc-4c63-bba4-eaf5924abfbe}");
    if (partDefMpComparable.length < 1) {
        throw new Error("Could not find the web part MAP COMPARABLES");
    }
    const part_map_comparables = ClientsideWebpart.fromComponentDef(partDefMpComparable[0]);
    // console.log("part_map_comparables", part_map_comparables)
    part_map_comparables.setProperties({
        title: "Informations générales",
        description: "AIzaSyDE7IhtorrPU6os5vAvGCblbDYUv6GJEvY",//ActifTitle,//
        reference: Actif.Title
    });
    column_4_1.addControl(part_map_comparables);
    /*---------Charts comparables--------------5621265B-7E03-4705-8AB5-EB790BCBF48F----------- 5621265b-7e03-4705-8ab5-eb790bcbf48f------- */
    const partDefChartComparable = partDefs.filter(c => c.Id ===  "{75EF4107-C271-46D2-9BF7-C89D3F1A2EF0}");
    if (partDefChartComparable.length < 1) {
        throw new Error("Could not find the web part MAP COMPARABLES");
    }
    const part_chart_comparables = ClientsideWebpart.fromComponentDef(partDefChartComparable[0]);
    // console.log("part_chart_comparables", part_chart_comparables)
    part_chart_comparables.setProperties({
        title: "Informations générales",
        description: Actif.Title
    });
    column_4_2.addControl(part_chart_comparables);
    /*---------------------Save----------------------------------- */
    await page.save();
}
export async function CreatePage(ActifFolderName:string, Actif:any) {
    const ActifDestinationUrl:string = ActifFolderName;
    const actif:number = Actif.Id;
    const pageNameUrl = 'https://valactifcom.sharepoint.com/sites/SGMB/SitePages/'+ActifFolderName + ".aspx";
    const page = await sp.web.addClientsidePage(ActifFolderName, ActifFolderName, "Article");
    // console.log("page=>", page.toUrl())
    page.setBannerImage("/sites/SGMB/SiteAssets/__siteIcon__.jpg");
    let tempPage: any = page; //page object got from above implementation.    
    let pageItemId: string=tempPage.json.AbsoluteUrl;
    // console.log("page=>", page)
    await page.save();
    AddWebpartToPage2(page, ActifDestinationUrl, Actif);
    await sp.web.lists.getByTitle("Dossiers").items.getById(actif).update({
        Lien: {
            Description:"Voir plus ...",
            Url: pageItemId
        }
    }).then(()=>{
        Dialog.alert(`Le dossier est crée avec succès.`);
    }).catch(()=>{
    });

}
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
            }
            catch{
                await sp.web.folders.add(relativeDestinationUrl+'/'+relativeDestinationUrl);
                await sp.web.folders.add(relativeDestinationUrl+'/'+ActifDestinationUrl);
            }
        }
    }
    catch{
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
    await sp.web.lists.getByTitle(list_name).items
    .add({ 
        Title: Title,//"Name1", 
        ContentTypeId: "0x0120",
        FileSystemObjectType: 1,
    })
    .then(result => {
        return result.item.update({
            Title: Title,//"Name1",
            FileLeafRef: FileLeafRef,//rootFolder+'/'+folderName,// 'Saham/Name1',//rootFolder+folderName
            FileRef: FileRef//'/'+rootFolder+'/'+folderName// '/Saham/Name1',//'/'+rootFolder+folderName
            //FileDirRef: '/Saham',
        });
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function isPointInPolygon(lat:number, lng:number, poly:any ){
    var point = turf.point([lng, lat]);
    //var pol = turf.polygon(JSON.parse("[[[-81, 41], [-81, 47],[-72, 47],[-72, 41],[-81, 41]]]"));
    return turf.booleanPointInPolygon(point, turf.polygon(JSON.parse(poly)));
}
export function getDistanceBetweenPoint(point1, point2){
    //const haversine = require('haversine')

    const start = {
        latitude: 33.52889502283273,
        longitude: -7.818180603745571
        };

    const end = {
    latitude: 33.608325148403395,
    longitude: -7.523655169467356
    };

    // console.log(haversine(start, end));//km
    // console.log(haversine(start, end, {unit: 'mile'}));
    // console.log(haversine(start, end, {unit: 'meter'}));
    // console.log(haversine(start, end, {threshold: 1}));
    // console.log(haversine(start, end, {threshold: 1, unit: 'mile'}));
    // console.log(haversine(start, end, {threshold: 1, unit: 'meter'}));
}
export async function CreatePinRef(){
    sp.web.lists.getByTitle("PinRef").items.add({
        Title: "toto",
        RegionId: 2
    }).then(res=> {}).catch(console.log);
}
export function getLat(latlng:string){
    var lat = latlng.split(",",1)[0];
    return parseFloat(lat);
}
export function getLng(latlng:string){
    var lng = latlng.split(",",2)[1];
    return parseFloat(lng);
}
export function ascii_to_hex(str)
  {
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 }
	return arr1.join('');
}
export async function WindowPopUp(modalTitle:string, url:string, from_list:string){
    var left = (screen.width/2)-(840/2);
    var top = (screen.height/2)-(600/2);
    var url_page = url;
    var credit = null;
    const currentUser = await sp.web.currentUser();
    var userId =  currentUser.Id;
    // console.log("email: ", userId);
    
    if(from_list === "Valactif"){
        const credits = await web.lists.getByTitle("l_credits").items.getAll();
        console.log("credits", credits)
        // console.log("credits: ", credits);
        var query = function(element) {
            return element.UserId === userId;
        };
        credit = credits.filter(query);
        // // console.log("credit: ", credit);
        if (credit[0].Cr_x00e9_ditconsultation === 0){
            url_page = "https://valactifcom.sharepoint.com/sites/SGMB/SitePages/Message-Cr%C3%A9dit.aspx";
        }
        else{
            await web.lists.getByTitle("l_credits").items.getById(credit[0].Id).update({
                Cr_x00e9_ditconsultation: credit[0].Cr_x00e9_ditconsultation-1
            });
        }
    }
    const modalWindow = window.open(url_page, modalTitle, "width=840,height=600,menubar=no,toolbar=no,directories=no,titlebar=no,resizable=no,scrollbars=no,status=no,location=no,top="+top+", left="+left);

}
export function estimated_price(Max_price:number, Min_price:number, calculated_score:number){
    var _calculated_A_coefficient =calculated_A_coefficient(Max_price,Min_price);
    var _calculated_B_coefficient = calculated_B_coefficient(Max_price, Min_price);
    return _calculated_A_coefficient*calculated_score+ _calculated_B_coefficient;
}
export function calculated_A_coefficient(Max_price:number, Min_price:number){
    return (Max_price-Min_price + 2 * RATIO)/(MAX_SCORE-MIN_SCORE);
}
export function calculated_B_coefficient(Max_price:number, Min_price:number){
    return Min_price - RATIO - calculated_A_coefficient(Max_price, Min_price);
}
export function somme_score(){
    return SURFACE_COEFFICIENT + SITUATION_GENERAL_COEFFICIENT + STANDING_APPARTEMENT_COEFFICIENT + STANDING_IMMEUBLE_COEFFICIENT;
}
export function calculated_score(surface_score:number, situation_general_score:number, standing_appt_score:number, standing_immeuble_score:number ){
    return ((surface_score * SURFACE_COEFFICIENT +
         situation_general_score * SITUATION_GENERAL_COEFFICIENT + 
         standing_appt_score * STANDING_APPARTEMENT_COEFFICIENT + 
         standing_immeuble_score * STANDING_IMMEUBLE_COEFFICIENT) / somme_score());
}
export function is_valide_PU(prix_dgi:number, prix_ref:number){
    if(prix_ref >= prix_dgi - prix_dgi*DGI_COEFFICIENT_FILTER && prix_ref <= prix_dgi + prix_dgi*DGI_COEFFICIENT_FILTER ){
        //console.log("is_valide_PU", prix_ref)
        return true;
    }
    return false;   
}
export function extendDistanceEvaluer(results: any[], item_dexa:any,item_org:any,start_point:any, start_dis:number, end_dis:number, DGI:any, type_de_bien:string){
    var query = function(element: { Latitude_x002d_Longitude: string; Prix_unitaire_de_la_reference: any; ContentType: { Name: string; }; Type_x0020_de_x0020_R_x00e9_f_x0: string; }) {
        var lat = getLat(element.Latitude_x002d_Longitude);
        var lng = getLng(element.Latitude_x002d_Longitude);
        var end_point = {
            latitude: lat,
            longitude: lng
        };
        var dis = haversine(start_point, end_point);
        var el_prix = element.Prix_unitaire_de_la_reference;
        
        var _is_valide_PU = is_valide_PU(parseInt(DGI.Prix_unitaire),el_prix);
        return element.ContentType.Name === type_de_bien && element.Type_x0020_de_x0020_R_x00e9_f_x0 === "Vente" && dis <= start_dis/1000 && _is_valide_PU;
    };
    const filterd_list_dexa = item_dexa.filter(query);
    const filterd_list_org = item_org.filter(query);
    // console.log("start: ", start_dis);
    //console.log("filterd_list: ", filterd_list.length);
    if (start_dis === end_dis || (filterd_list_dexa.length+filterd_list_org.length) > 3){
        var _filterd_list = filterd_list_dexa.concat(filterd_list_org);
        return {filterd_list:results.concat(_filterd_list), dis:start_dis, nbr_dexa:filterd_list_dexa.length,nbr_org:filterd_list_org.length} ;
    }
    return extendDistanceEvaluer(results, item_dexa, item_org,start_point, start_dis+100, end_dis,DGI, type_de_bien);
}
export function extendDistanceEvaluer2(results: any[], item_dexa:any,item_org:any,start_point:any, start_dis:number, end_dis:number, DGI:any, type_de_bien:string){
    // console.log("results", results)
    // console.log("item_dexa", item_dexa)
    // console.log("item_org", item_org)
    var query = function(element) {
        var lat = getLat(element.Latitude_x002d_Longitude);
        var lng = getLng(element.Latitude_x002d_Longitude);
        var end_point = {
            latitude: lat,
            longitude: lng
        };
        var dis = haversine(start_point, end_point);
        var el_prix = element.Prix_x0020_unitaire_x0020_pond_x;
        
        var _is_valide_PU = is_valide_PU(parseInt(DGI.PU),el_prix);
        return element.Typologie_x0020_de_x0020_bien === "Résidentiel" && element.Type_x0020_de_x0020_R_x00e9_f_x0 === "Vente" && dis <= start_dis/1000 && _is_valide_PU;
    };
    const filterd_list_dexa = item_dexa.filter(query);
    const filterd_list_org = item_org.filter(query);
    // console.log("filterd_list_dexa", filterd_list_dexa)
    // console.log("filterd_list_org", filterd_list_org)
    // console.log("start: ", start_dis);
    //console.log("filterd_list: ", filterd_list.length);
    if (start_dis === end_dis || (filterd_list_dexa.length+filterd_list_org.length) > 3){
        var _filterd_list = filterd_list_dexa.concat(filterd_list_org);
        return {filterd_list:results.concat(_filterd_list), dis:start_dis, nbr_dexa:filterd_list_dexa.length,nbr_org:filterd_list_org.length} ;
    }
    return extendDistanceEvaluer2(results, item_dexa, item_org,start_point, start_dis+100, end_dis,DGI, type_de_bien);
}
export function extendDistanceFiltrer(item_dexa:any,item_org:any,start_point:any, start_dis:number, end_dis:number, type_de_bien:string,type_de_ref:string[]){
    var query = function(element) {
        var lat = getLat(element.Latitude_x002d_Longitude);
        var lng = getLng(element.Latitude_x002d_Longitude);
        var end_point = {
            latitude: lat,
            longitude: lng
        };
        var dis = haversine(start_point, end_point);
        
        return element.ContentType.Name === type_de_bien && element.Type_x0020_de_x0020_R_x00e9_f_x0 === "Vente" && type_de_ref.indexOf(element.Type_x0020_de_x0020_R_x00e9_f_x0)!=-1 && dis <= start_dis/1000;
    };
    const filterd_list_dexa = item_dexa.filter(query);
    const filterd_list_org = item_org.filter(query);
    // console.log("start: ", start_dis);
    if (start_dis === end_dis || (filterd_list_dexa.length+filterd_list_org.length) > 10){
        return {
            dis:start_dis/1000,
            filterd_list_dexa:filterd_list_dexa,
            filterd_list_org:filterd_list_org
        };
    }
    return extendDistanceFiltrer(item_dexa, item_org,start_point, start_dis+250, end_dis, type_de_bien,type_de_ref);//pas 250 m
}
export function extendDistanceFiltrer2(item_dexa:any, item_org:any, dossiers:any, type_expertise:string, start_point:any, start_dis:number, end_dis:number, type_de_bien:string, type_de_ref:string[]){
    // console.log("extendDistanceFiltrer2 item_dexa", item_dexa)
    // console.log("extendDistanceFiltrer2 item_org", item_org)
    // console.log("extendDistanceFiltrer2 start_point", start_point)
    // console.log("extendDistanceFiltrer2 start_dis", start_dis)
    // console.log("extendDistanceFiltrer2 end_dis", end_dis)
    // console.log("extendDistanceFiltrer2 dossiers", dossiers)
    
    var query = function(element) {
        var lat = getLat(element.Latitude_x002d_Longitude);
        var lng = getLng(element.Latitude_x002d_Longitude);
        var end_point = {
            latitude: lat,
            longitude: lng
        };
        var dis = haversine(start_point, end_point);
        return element.Typologie_x0020_de_x0020_bien === type_de_bien && element.Type_x0020_de_x0020_R_x00e9_f_x0 === "Vente" && type_de_ref.indexOf(element.Type_x0020_de_x0020_R_x00e9_f_x0)!=-1 && dis <= start_dis/1000;
    };
    var query2 = function(element) {
        var lat = getLat(element.Latitude_x002d_Longitude);
        var lng = getLng(element.Latitude_x002d_Longitude);
        var end_point = {
            latitude: lat,
            longitude: lng
        };
        var dis = haversine(start_point, end_point);
        return element.Typologie_x0020_de_x0020_bien === type_de_bien && dis <= start_dis/1000 && type_expertise.indexOf(element.Type_x0020_d_x0027_expertise) != -1;
    };
    const filterd_list_dexa = item_dexa.filter(query);
    const filterd_list_org = item_org.filter(query);
    const filterd_list_dossiers = dossiers.filter(query2);
    // const filterd_list_dexa = item_dexa;
    // const filterd_list_org = item_org;
    // console.log("start: ", start_dis);
    // console.log("extendDistanceFiltrer2 filterd_list_dossiers", filterd_list_dossiers)
    if (start_dis === end_dis || (filterd_list_dexa.length+filterd_list_org.length) > 3){
        return {
            dis:start_dis/1000,
            filterd_list_dexa:filterd_list_dexa,
            filterd_list_org:filterd_list_org,
            filterd_list_dossiers:filterd_list_dossiers
        };
    }
    return extendDistanceFiltrer2(item_dexa, item_org, dossiers, type_expertise, start_point, start_dis+250, end_dis, type_de_bien, type_de_ref);//pas 250 m
}
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export async function get_dgi_zone(lat:number, lng:number) {
    /*const items: any[] = await */
    await web.lists.getByTitle("l_ref_DGI").items.getAll().then(res=>{
        var query = function(element) {
            return isPointInPolygon(lat, lng, element.Polygone);
        };
        const dgi = res.filter(query);
        // console.log("get_dgi_zone", dgi);
        return dgi;
    });

}
export function Mediane(arr){
    if(arr.length != 0){
    arr.sort(function(a, b){ return a - b; });//sort array
    var i = arr.length / 2;//find median index
    return i % 1 == 0 ? ((arr[i - 1] + arr[i]) / 2).toFixed(2) : (arr[Math.floor(i)]).toFixed(2); // math floor retourne Un nombre qui représente le plus grand entier inférieur ou égal à la valeur passée en argument.
}else{
    return 0;
}
}
export function EcartType(arr:any){
    if(arr.length!=0){
        var sum = arr.reduce(reducer);
        var n = arr.length;
        var mean = sum / n;
        var stdev = Math.sqrt((Math.pow(sum,2) / n) - (Math.pow(mean,2)));
        return stdev.toFixed(2);
    }else{
        return 0;
    }
}
export function getItemList(): Promise<any>{
    return web.lists.getByTitle("l_ref_DGI").items.getAll().then(res => {
        // console.log("dgiii: ", res);
        return res;
    });
}
export function Prix_unitaire_moyen(array){
    if(array.length != 0){
      let _prix_moyen = array.reduce(reducer)/array.length;
      return _prix_moyen.toFixed(2);
    }
    return 0;
}
export function Prix_unitaire_max(array){
    if(array.length != 0){
      return Math.max.apply(null, array);
    }
    return 0;
}
export function Prix_unitaire_min(array){
    if(array.length != 0){
      return Math.min.apply(null, array);
    }
    return 0;
}
