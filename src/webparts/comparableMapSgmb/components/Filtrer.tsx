import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/webs";
import { Checkbox, DefaultButton, Dialog, DialogFooter, DialogType, Dropdown, IDropdownOption, IDropdownStyles, Label, Panel, PrimaryButton, Stack } from 'office-ui-fabric-react';
import * as React from 'react';
import { DISTANCE_END_FILTRAGE, DISTANCE_START_FILTRAGE, web } from '../Constants';
import { extendDistanceFiltrer, getLat, getLng } from '../utils';
import { ICheckboxInput } from './ICheckboxInput';
import { IFiltrerProps } from './IFiltrerProps';
import styles from './ComparableMapSgmb.module.scss';


function Filtrer (props:IFiltrerProps){
  let [isOpen, setIsOpen] = React.useState(false);
  let [submitClick, setSubmitClick] = React.useState(false);
  let [form, setForm] = React.useState({type_de_bien:"CT_Résidentiel", type_de_ref:[], ref_dexa_or_organisme:[]});
  let [typeDeBien, setTypeDeBien] = React.useState("Résidentiel");
  let [alert, setAlert] = React.useState(false);
  let [alertDgi, setAlertDGi] = React.useState(false);
  let [ref_from, setRef_from] = React.useState(["l_ref_Dexa", "Actifs"]);
  let lat = getLat(props.latlng);
  let lng = getLng(props.latlng);
  
  const start = {
    latitude: lat,
    longitude: lng
  };

  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Attention',
    subText: 'Veuillez préciser le type de réference',
  };

  const dialogContentDGIProps = {
    type: DialogType.normal,
    title: 'Oups',
    subText: 'Désolé la zone choisie n\'est pas prise en charge par le système.',
  };

  const FiltrageDialogContentProps = {
    type: DialogType.largeHeader,
    title: "Analyse de la zone",
    subText: '',
  };

  const modelProps = {
    isBlocking: false,
    styles: { main: { maxWidth: 650 } },
  };

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
  };

  const options_type_de_bien: IDropdownOption[] = [
    { key: 'CT_Résidentiel', text: 'Résidentiel'},
    { key: 'CT_Professionnel', text: 'Professionnel'},
    { key: 'CT_Commercial', text: 'Commercial'},
    { key: 'CT_Terrain_Villa', text: 'Terrain Villa' },
    { key: 'CT_Terrain_Urbain', text: 'Terrain Urbain' },
    { key: 'CT_Terrain_Construit', text: 'Terrain Construit' },
    { key: 'CT_Terrain_Agricole', text: 'Terrain Agricole' },
  ];

  const options_type_de_ref: ICheckboxInput[] = [
    { ID: 1, Title: 'Vente' },
    { ID: 2, Title: 'Lacation' },
    { ID: 3, Title: 'Rapport' },
  ];

  const onChange_type_de_bien = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setForm({...form, type_de_bien: item.key.toString()});
    setTypeDeBien(item.text);
    
  };

  const _onChange_type_de_ref = (ev: React.FormEvent<HTMLInputElement>, isChecked: boolean):void => {
    let pos = form.type_de_ref.indexOf(ev.currentTarget.title);
    if(pos === -1 && isChecked){
      form.type_de_ref.push(ev.currentTarget.title);
    }
    if(pos > -1 && !isChecked){
      let removedItem = form.type_de_ref.splice(pos, 1);
    }
   
  };

  const _onChange_dexa_org = (ev: React.FormEvent<HTMLInputElement>, isChecked: boolean):void => {
    //setForm({...form, ref_dexa_or_organisme: form.ref_dexa_or_organisme.push(ev.currentTarget.title)});
    //setRef_from(
    let pos = ref_from.indexOf(ev.currentTarget.title);
    if(pos === -1 && isChecked){
      ref_from.push(ev.currentTarget.title);
    }
    if(pos > -1 && !isChecked){
      
      let removedItem = ref_from.splice(pos, 1);
    }
    
  };

  async function _onSubmit(){
    //let items: any[] = [];
    /*if(props.dgi[0]!=null){*/
    let items_dexa: any[] = [];
    let items_org: any[] = [];
    var rest_filterd_list = null;
    let filterd_list: any = {};
    let items: any = {
      dexa:[],
      org:[]
    };  
    if(form.type_de_ref.length===0){
      setAlert(true);
    } else{
      var time_start = new Date(Date.now());
      var s_start = time_start.getSeconds();
      await ref_from.forEach(async (element, index) => {
        let get_items = await web.lists.getByTitle(element).items.getAll().then(async res=>{
          //filterd_list = rest_filterd_list.filterd_list;
          if(element === "l_Valactif"){
            // await setPin_dexa(filter);
            //items_dexa = await filter;
            items_dexa = res;
          }else{
            //await setPin_org(filter);
            // items_org = await filter;
            items_org=res;
          }
          if (ref_from.length-1 === index){
            rest_filterd_list = extendDistanceFiltrer(items_dexa, items_org,start,DISTANCE_START_FILTRAGE, DISTANCE_END_FILTRAGE, form.type_de_bien, form.type_de_ref);
            props.handleFilter(rest_filterd_list.filterd_list_dexa,rest_filterd_list.filterd_list_org, rest_filterd_list.dis,typeDeBien);
          }
        });
      }); 
      setIsOpen(false);
      setSubmitClick(true);
    }
    /*}
    else{
      setAlertDGi(true);
    }*/
  }
  // props.handleFilter(pin_dexa,pin_org);
  return (
    <div>

      {alert?       
        <Dialog 
          hidden={!alert} 
          onDismiss={()=>setAlert(false)} 
          dialogContentProps={dialogContentProps}
          modalProps={modelProps}
        >
          <DialogFooter>
            <DefaultButton onClick={()=>setAlert(false)} text="Cancel" />
          </DialogFooter>
        </Dialog>
      :<></>}
      {alertDgi?       
        <Dialog 
          hidden={!alertDgi} 
          onDismiss={()=>setAlertDGi(false)} 
          dialogContentProps={dialogContentDGIProps}
          modalProps={modelProps}
        >
          <DialogFooter>
            <DefaultButton onClick={()=>setAlertDGi(false)} text="Cancel" />
          </DialogFooter>
        </Dialog>
      :<></>}
        <Stack horizontal horizontalAlign="start"> 
          <a className={styles.Pointer} onClick={() => setIsOpen(true)}>{props.buttonTitle}</a>
        </Stack>
        <Panel isOpen={isOpen} onDismiss={()=> setIsOpen(false)}
          headerText="FILTRAGE"
          // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
          closeButtonAriaLabel="Close"
        >
        <Stack tokens={{childrenGap:10}}>{/* stack organise les flex */}

        <Dropdown 
        placeholder="Selectionner le type de bien"
        label="TYPE DE BIEN"
        options={options_type_de_bien}
        styles={dropdownStyles}
        defaultSelectedKey={form.type_de_bien}
        onChange={onChange_type_de_bien}
        />
        <Stack tokens={{ childrenGap: 10}}>
          <Label>TYPE DE RÉFÉRENCE</Label>
          <Stack horizontal horizontalAlign="start" tokens={{childrenGap:30}}>
          <Checkbox  value={1} title="Vente" label="Vente" onChange={_onChange_type_de_ref } />

          <Checkbox value={2} title="Location" label="Location" onChange={_onChange_type_de_ref } />

          {/*<Checkbox value={3} title="Rapport" label="Rapport" onChange={_onChange_type_de_ref } />*/}
        </Stack>
        </Stack>
        <Stack tokens={{ childrenGap: 10}}>
          <Label>Références</Label>
          <Checkbox value={1} title="l_Valactif" defaultChecked label="Reférences Valactif" onChange={_onChange_dexa_org} />

          <Checkbox value={2} title="l_ref_Org" label="Reférences Organisme" onChange={_onChange_dexa_org} disabled/>

        </Stack>
        
        <Stack horizontal horizontalAlign="end" tokens={{childrenGap:30}}>
          <PrimaryButton text="Filtrer" onClick={async() => await _onSubmit()}></PrimaryButton>
          <DefaultButton text="Cancel" onClick={() => setIsOpen(false)}></DefaultButton>
        </Stack>
        </Stack>
      </Panel>
    </div>
  );
}
export default Filtrer;

