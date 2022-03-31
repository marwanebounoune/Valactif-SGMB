import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/webs";
import { ActionButton, Checkbox, DefaultButton, Dialog, DialogFooter, DialogType, Dropdown, IDropdownOption, IDropdownStyles, Label, Panel, PrimaryButton, Stack } from 'office-ui-fabric-react';
import * as React from 'react';
import { web } from '../Constants';
import { ICheckboxInput } from './ICheckboxInput';
import { IMesBiensProps } from "./IMesBiensProps";
import styles from './ComparableMapSgmb.module.scss';
import { graph } from "@pnp/graph";
import "@pnp/graph/users";

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

function MesBiens (props:IMesBiensProps){
  let [isOpen, setIsOpen] = React.useState(false);
  let [form, setForm] = React.useState({portefeuille:0, type_de_ref:[], ref_dexa_or_organisme:[]});
  let [typeDeBien, setTypeDeBien] = React.useState("Résidentiel");
  let [alert, setAlert] = React.useState(false);
  let [ref_from, setRef_from] = React.useState(["l_Valactif"]);
  let [popOut, setPopOut] = React.useState(false);
  let [DGI, setDGI] = React.useState(null);
  let [pin_dexa, setPin_dexa] = React.useState([]);
  let [pin_org, setPin_org] = React.useState([]);
  let [information, setInformation] = React.useState(null);
  let [portefeuille_options, setPortefeuille_options] = React.useState([]);
  
  React.useEffect(() => {
    get_portefeuille();
 },[]);
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Attention',
    subText: 'Veuillez Préciser le Protefeuilles Souhaité',
  };

  const FiltrageDialogContentProps = {
    type: DialogType.largeHeader,
    title: "Avis de valeur sur la zone",
    subText: '',
  };

  const modelProps = {
    isBlocking: false,
    styles: { main: { maxWidth: 650 } },
  };

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
  };

  const options_portefeuille: IDropdownOption[] = portefeuille_options;

  const options_type_de_ref: ICheckboxInput[] = [
    { ID: 1, Title: 'Vente' },
    { ID: 2, Title: 'Lacation' },
    { ID: 3, Title: 'Rapport' },
  ];

  const onChange_portefeuille = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setForm({...form, portefeuille: parseInt(item.key.toString())});
    setTypeDeBien(item.text);
    
  };

  async function get_portefeuille(){
    const currentUser = await sp.web.currentUser();
    

    let groups = await sp.web.currentUser.groups();
    const portefeuille = await web.lists.getByTitle("l_portefeuille").items.getAll();
    
    var portefeuille_array_options=[];
    //portefeuille.then(res=>{
      portefeuille.map(el => {

        var portefeuille_options = { key: el.Id, text: el.Title}
        portefeuille_array_options.push(portefeuille_options);
      });
    // });
    setPortefeuille_options(portefeuille_array_options);
  }
  async function _onSubmit(){
    const test: any[] = await web.lists.getByTitle("l_actifs").items.getAll();
    
    if(form.portefeuille != 0){
      const actifs = await web.lists.getByTitle('l_actifs').items.select("Id","Latitude_x002d_Longitude", "Typologie_x0020_de_x0020_bien","Title", "Lien","Portefeuille_Ref/Title", "Portefeuille_Ref/ID").expand("Portefeuille_Ref").getAll();
      var query = function(element) {
        return element.Portefeuille_Ref.ID == form.portefeuille;
      };
    const filterd_actifs = actifs.filter(query);
    console.log("filterd_actifs", filterd_actifs)
      
      props.handlerMesBiens(filterd_actifs);
      setForm({...form, portefeuille:form.portefeuille});
      setIsOpen(false);
    }else{
      setAlert(true);
    }
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
        <Stack horizontal horizontalAlign="end"> 
          {/*<a className={styles.Pointer} onClick={() => setIsOpen(true)}>{props.buttonTitle}</a>*/}
          <ActionButton iconProps={{iconName: 'RedEye'}} text={props.buttonTitle} onClick={() => setIsOpen(true)}/>
        </Stack>
        <Panel isOpen={isOpen} onDismiss={()=> setIsOpen(false)}
          headerText="Mes Biens"
          // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
          closeButtonAriaLabel="Close"
        >
        <Stack tokens={{childrenGap:10}}>{/* stack organise les flex */}

        <Dropdown 
        placeholder="Selectionner le portefeuille"
        label="TYPE DE BIEN"
        options={options_portefeuille}
        styles={dropdownStyles}
        defaultSelectedKey={form.portefeuille}
        onChange={onChange_portefeuille}
        />
        
        <Stack horizontal horizontalAlign="end" tokens={{childrenGap:30}}>
          <PrimaryButton text="Filtrer" onClick={async() => await _onSubmit()}></PrimaryButton>
          <DefaultButton text="Cancel" onClick={() => setIsOpen(false)}></DefaultButton>
        </Stack>
        </Stack>
      </Panel>
    </div>
  );
}
export default MesBiens;

