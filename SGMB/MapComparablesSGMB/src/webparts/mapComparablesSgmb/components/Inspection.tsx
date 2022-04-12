import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/webs";
import { ActionButton, DefaultButton, Dialog, DialogFooter, DialogType, Dropdown, IDropdownOption, IDropdownStyles, Label, Panel, PrimaryButton, Stack } from 'office-ui-fabric-react';
import * as React from 'react';
import { DISTANCE_END_FILTRAGE, DISTANCE_START_FILTRAGE, web } from '../Constants';
import { extendDistanceFiltrer2, getLat, getLng } from '../utils';
import { ICheckboxInput } from './ICheckboxInput';
import { IInspectionProps } from './IInspectionProps';
import styles from './MapComparablesSgmb.module.scss';
import { sp } from "@pnp/sp/presets/all";


function Inspection (props:IInspectionProps){
    let [form, setForm] = React.useState({dossier:{},portefeuille:0, type_de_ref:[], ref_dexa_or_organisme:[]});
    let [typeDeBien, setTypeDeBien] = React.useState("Résidentiel");
    let [alert, setAlert] = React.useState(false);
    let [ref_from, setRef_from] = React.useState(["l_ref_Dexa", "Actifs"]);
    let [popOut, setPopOut] = React.useState(false);
    let [DGI, setDGI] = React.useState(null);
    let [pin_dexa, setPin_dexa] = React.useState([]);
    let [pin_org, setPin_org] = React.useState([]);
    let [information, setInformation] = React.useState(null);
    let [portefeuille_options, setPortefeuille_options] = React.useState([]);
    let [comparables, setComparables] = React.useState([]);
    
    React.useEffect(() => {
   },[]);
    const dialogContentProps = {
      type: DialogType.normal,
      title: 'Attention',
      subText: 'Veuillez Préciser le Protefeuilles Souhaité',
    };
    const modelProps = {
      isBlocking: false,
      styles: { main: { maxWidth: 650 } },
    };
    async function _onSubmit(){
      console.log("TEST")
      let items_dexa: any[] = [];
      let items_org: any[] = [];
      var rest_filterd_list = null;
      const dossiers = await sp.web.lists.getByTitle("Dossiers").items.getAll();
      var query = function(element) {
        return element.Title === props.reference;
      };
      const dossier = dossiers.filter(query);
      const center = {
        lat: getLat(dossier[0].Latitude_x002d_Longitude.toString()),
        lng: getLng(dossier[0].Latitude_x002d_Longitude.toString())
      }
      var start ={
        latitude: getLat(dossier[0].Latitude_x002d_Longitude.toString()),
        longitude: getLng(dossier[0].Latitude_x002d_Longitude.toString())
      }
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////77
      var i=0;
      await ref_from.forEach(async (element, index) => {
        let get_items = await web.lists.getByTitle(element).items.getAll().then(async res=>{
          i++
          console.log("i", i)
          console.log("RES FILTRING", res)
          
          //filterd_list = rest_filterd_list.filterd_list;
          if(element == "l_ref_Dexa"){
          // await setPin_dexa(filter);
            //items_dexa = await filter;
            items_dexa = res;
            console.log("element l_ref_Dexa", items_dexa)
          }else{
            //await setPin_org(filter);
            // items_org = await filter;
            items_org=res;
          }
          console.log("ref_from", ref_from)
          if (i === 2){
            console.log("OK")
            rest_filterd_list = extendDistanceFiltrer2(items_dexa, items_org, start, DISTANCE_START_FILTRAGE, DISTANCE_END_FILTRAGE, "Résidentiel", ["Vente"]);
          }
        })
        .then(async res => {
          console.log("extendDistanceFiltrer2",rest_filterd_list)
          await props.handlerMesBiens(dossier, rest_filterd_list.filterd_list_dexa, rest_filterd_list.filterd_list_org)
        });
      });
      setForm({...form, dossier:dossier[0]});
        ///////////////////////////////////////////////////////////////
        
        // const test: any[] = await web.lists.getByTitle("l_actifs").items.getAll();
        
        // if(form.portefeuille != 0){
        //   const actifs = await web.lists.getByTitle('l_actifs').items.select("Id","Latitude_x002d_Longitude", "Typologie_x0020_de_x0020_bien","Title", "Lien","Portefeuille_Ref/Title", "Portefeuille_Ref/ID").expand("Portefeuille_Ref").getAll();
        //   var query = function(element) {
        //     return element.Portefeuille_Ref.ID == form.portefeuille;
        //   };
        //   const filterd_actifs = actifs.filter(query);
        //   console.log("filterd_actifs", filterd_actifs)
          
        //   props.handlerMesBiens(filterd_actifs);
        //   setForm({...form, portefeuille:form.portefeuille});
        //   setIsOpen(false);
        // }else{
        //   setAlert(true);
        // }
    }
    // props.handleFilter(pin_dexa,pin_org);
    return (
      <div>
        {alert?       
          <Dialog hidden={!alert} onDismiss={()=>setAlert(false)} dialogContentProps={dialogContentProps} modalProps={modelProps}>
            <DialogFooter>
              <DefaultButton onClick={()=>setAlert(false)} text="Cancel" />
            </DialogFooter>
          </Dialog>
          :<></>
        }
        <Stack horizontal horizontalAlign="end" onClick={async() => await _onSubmit()}> 
          {/*<a className={styles.Pointer} onClick={() => setIsOpen(true)}>{props.buttonTitle}</a>*/}
          <ActionButton iconProps={{iconName: 'Search'}} text={props.buttonTitle} />
        </Stack>
      </div>
    );
}
export default Inspection;

