import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/webs";
import { fromPairs } from "lodash";
import { DefaultButton, Dialog, DialogFooter, DialogType, Dropdown, IDropdownOption, IDropdownStyles, Panel, PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';
//import { Panel } from '@microsoft/office-ui-fabric-react';
import * as React from 'react';
import { DISTANCE_END_EVALUATION, DISTANCE_START_EVALUATION, web } from '../Constants';
import { calculated_score, estimated_price, extendDistanceEvaluer, getLat, getLng, reducer } from '../utils';
import { IEvaluerProps } from './IEvaluerProps';
import styles from './ComparableMapSgmb.module.scss';
import PopOut from './PopOut';
import "@pnp/sp/webs";
import { ClientsideWebpart } from "@pnp/sp/clientside-pages";
import pnp from "sp-pnp-js";
import { sp, IFolder, IFileAddResult } from '@pnp/sp/presets/all';


function Evaluer (props:IEvaluerProps){
  let [isOpen, setIsOpen] = React.useState(false);
  let [form, setForm] = React.useState({type_de_bien:"CT_Résidentiel", surface:0,surface_score:3, situation_general_score:3, standing_appartement_score:3, standing_immeuble_score:3});//default value === 3 c'est-à-dire un bien avec une qualité moyenne
  let [typeDeBien, setTypeDeBien] = React.useState("Résidentiel");
  let [alert, setAlert] = React.useState(false);
  let [alertDgi, setAlertDGi] = React.useState(false);
  let [popOut, setPopOut] = React.useState(false);
  let [evaluation, setEvaluation] = React.useState(null);
  
  let lat = getLat(props.latlng);
  let lng = getLng(props.latlng);
  
  const start = {
    latitude: lat,
    longitude: lng
  };

  const evaluationDialogContentProps = {
      type: DialogType.largeHeader,
      title: "Avis de valeur sur le bien.",
      subText: '',
  };

  var dialogContentProps = {
    type: DialogType.normal,
    title: 'Alert',
    subText: 'Veuillez Spécifier la surface du Bien',
  };
  const dialogContentDGIProps = {
    type: DialogType.normal,
    title: 'Oups',
    subText: 'Désolé la zone choisie n\'est pas prise en charge par le système',
  };
  const modelProps = {
    isBlocking: false,
    styles: { main: { maxWidth: 450 } },
  };

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
  };
  
  /*React.useEffect(() => {
    let dgi = get_dgi_zone(lat, lng);
    setDGI (dgi);
 });*/


  const options_type_de_bien: IDropdownOption[] = [
    { key: 'CT_Résidentiel', text: 'Résidentiel'},
  ];

  const options: IDropdownOption[] = [
    { key: 1, text: 'Très faible' },
    { key: 2, text: 'Faible' },
    { key: 3, text: 'Moyen' },
    { key: 4, text: 'Bon' },
    { key: 5, text: 'Très bon' },
  ];

  const options_surface: IDropdownOption[] = [
    { key: 1, text: 'Très petit' },
    { key: 2, text: 'Petit' },
    { key: 3, text: 'Moyen' },
    { key: 4, text: 'Grand' },
    { key: 5, text: 'Très Grand' },
  ];

  const onChange_type_de_bien = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setForm({...form, type_de_bien: item.key.toString()});
    setTypeDeBien(item.text);
  };

  const onChange_surface_score = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setForm({...form, surface_score: Number(item.key)});
  };

  const onChange_situation_general_score = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setForm({...form, situation_general_score: Number(item.key)});
  };

  const onChange_standing_appartement_score = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setForm({...form, standing_appartement_score: Number(item.key)});
  };

  const onChange_standing_immeuble_score = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setForm({...form, standing_immeuble_score: Number(item.key)});
    
  };

  async function _onSubmit(){
    if(props.dgi[0]!=null){
      var credit = null;
      const currentUser = await sp.web.currentUser();
      var userId =  currentUser.Id;
      if(form.surface!=0){
          const credits = await web.lists.getByTitle("l_credits").items.getAll();
          var query = function(element) {
              return element.userId === userId;
            };
          credit = credits.filter(query);
          if (credit[0].Cr_x00e9_dit_x0020__x00e9_valuat === 0){
            var left = (screen.width/2)-(840/2);
            var top = (screen.height/2)-(600/2);
            var url_page = 'https://valactifcom.sharepoint.com/:u:/s/valactif-solutions/EQS_c-KjvgZDq8dwMNkjA6cBzS1IkFVxDlnYcCpr_ETcyg?e=rvEfZL';
            const modalWindow = window.open(url_page, "", "width=840,height=600,menubar=no,toolbar=no,directories=no,titlebar=no,resizable=no,scrollbars=no,status=no,location=no,top="+top+", left="+left);
          }
          else{
              const credit_decrement = await web.lists.getByTitle("l_credits").items.getById(credit[0].Id).update({
                  
                Cr_x00e9_dit_x0020__x00e9_valuat: credit[0].Cr_x00e9_dit_x0020__x00e9_valuat-1
                });
  
                setIsOpen(false);
                var prix_dexa:any = [];
                
                
              // if (DGI){
                var time_start = new Date(Date.now());
                var s_start = time_start.getSeconds();//
        
                const items: any[] = await web.lists.getByTitle("l_Valactif").items.select("Id","Latitude_x002d_Longitude", "Type_x0020_de_x0020_R_x00e9_f_x0", "Title", "Prix_unitaire_de_la_reference", "ContentType/Name").expand("ContentType").getAll();//.filter(query) 
                //const items_org: any[] = await web.lists.getByTitle("l_ref_Org").items.select("Id","Latitude_x002d_Longitude", "Type_x0020_de_x0020_R_x00e9_f_x0", "Title", "Prix_unitaire_de_la_reference", "ContentType/Name").expand("ContentType").getAll();//.filter(query) 
                const items_org: any[] =[];
                const all_items: any = items.concat(items_org);
        
                //const filterd_list = items.filter(query);
                var filterd_list:any = [];
                var rest_filterd_list = extendDistanceEvaluer(filterd_list,items, items_org,start,DISTANCE_START_EVALUATION, DISTANCE_END_EVALUATION,props.dgi[0], form.type_de_bien);
                filterd_list = rest_filterd_list.filterd_list;
                filterd_list.map (k => {
                  var p_int = parseInt(k.Prix_unitaire_de_la_reference);
                  prix_dexa.push(p_int);
            }); 
                
                var time_end = new Date(Date.now());
                var s_end =time_end.getSeconds();
                console.log("time: ", s_end-s_start);
                if(prix_dexa.length != 0)
                  var prix_evaluer = prix_dexa.reduce(reducer)/prix_dexa.length;
  
                var Min_price = Math.min.apply(null, prix_dexa);
                var Max_price = Math.max.apply(null, prix_dexa);
                var _calculated_score = calculated_score(form.surface_score, form.situation_general_score, form.standing_appartement_score, form.standing_immeuble_score );
  
                var _estimated_price  = estimated_price(Max_price, Min_price, _calculated_score);
  
                var result = {
                  perimetre:rest_filterd_list.dis,
                  prix_estimer: _estimated_price,
                  dgi_zone:props.dgi[0],
                  nbr_ref_dexa:rest_filterd_list.nbr_dexa,
                  nbr_ref_org:rest_filterd_list.nbr_org,
                  all_ref:filterd_list,
                  type_de_bien:typeDeBien,
                  prix_total: _estimated_price * form.surface
                };
                setEvaluation(result);
                
                setPopOut(true);
                //type_de_bien:"", surface_score:3, situation_general_score:3, standing_appartement_score:3, standing_immeuble_score:3
                setForm({...form, type_de_bien:"CT_Résidentiel", surface:0 ,surface_score:3, situation_general_score:3, standing_appartement_score:3, standing_immeuble_score:3});
                //props.handleEvaluer(result);
          }
      }else{
        setAlert(true);
        return null;
      }
    }else{
      dialogContentProps = {
        type: DialogType.normal,
        title: 'Oups',
        subText: 'Désolé la zone choisie n\'est pas prise en charge par le système.',
      };
      setAlertDGi(true);
    }

  }

  return (
    <div>
      {alert ? <Dialog 
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
      {popOut?
        <Dialog
          hidden={!popOut}//false
          onDismiss={()=> setPopOut(false)}
          dialogContentProps={evaluationDialogContentProps}
          modalProps={modelProps}
          styles={{
            main: {
              selectors: {
                ['@media (min-width: 480px)']: {
                  width: 550,
                  height: 555,
                  minWidth: 450,
                  maxWidth: '1000px'
                }
              }
            }
          }}
        >
          <PopOut evaluation={evaluation}/>
        </Dialog>
        :<></>
      }  
      <Stack horizontal horizontalAlign="start"> 
          <a className={styles.Pointer} onClick={() => setIsOpen(true)}>{props.buttonTitle}</a>
      </Stack>

      <Panel isOpen={isOpen} onDismiss={()=> setIsOpen(false)}
          headerText="Evaluation"
          // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
          closeButtonAriaLabel="Close">
        <Stack tokens={{childrenGap:10}}>{/* stack organise les flex */}
          <Dropdown 
          onChange={onChange_type_de_bien}
          placeholder="Selectionner le type de bien"
          label="TYPE DE BIEN (n'est disponible que pour les résidentiels)"
          options={options_type_de_bien}
          styles={dropdownStyles}
          defaultSelectedKey={form.type_de_bien}
          />
          
          <Stack tokens={{childrenGap:10}}>
             <TextField label="Surface du bien" placeholder="Entrez la surface du bien" onChange={(e) => setForm({...form, surface:parseInt((e.target as HTMLInputElement).value)}) }/>
          </Stack>

          <Stack tokens={{childrenGap:10}}>
            <Dropdown 
            onChange={onChange_surface_score}
            placeholder="Surface Description"
            label="Surface Description"
            options={options_surface}
            styles={dropdownStyles}
            defaultSelectedKey={form.surface_score}
            />
          </Stack>
          <Stack tokens={{ childrenGap: 10}}>
            <Dropdown 
            onChange={onChange_situation_general_score}
            placeholder="Situation Général"
            label="Situation Général"
            options={options}
            styles={dropdownStyles}
            defaultSelectedKey={form.situation_general_score}
          />
          </Stack>
          <Stack tokens={{ childrenGap: 10}}>
            <Dropdown 
            onChange={onChange_standing_appartement_score}
            placeholder="Standing de l'appartement"
            label="Standing de l'appartement"
            options={options}
            styles={dropdownStyles}
            defaultSelectedKey={form.standing_appartement_score}
          />
          </Stack>
          <Stack tokens={{ childrenGap: 10}}>
            <Dropdown 
            onChange={onChange_standing_immeuble_score}
            placeholder="Standing de l'immeuble"
            label="Standing de l'immeuble"
            options={options}
            styles={dropdownStyles}
            defaultSelectedKey={form.standing_immeuble_score}
            />
          </Stack>

          <Stack horizontal horizontalAlign="end" tokens={{childrenGap:30}}>
            <PrimaryButton text="Evaluer" onClick={() => _onSubmit()}></PrimaryButton>
            <DefaultButton text="Cancel" onClick={() => setIsOpen(false)}></DefaultButton>
          </Stack>
        </Stack>
      </Panel>
    </div>
  );
}
export default Evaluer;

