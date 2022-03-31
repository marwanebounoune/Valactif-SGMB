
import { DefaultButton, Dialog, DialogFooter, DialogType, Dropdown, IDropdownOption, IDropdownStyles, Panel, PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { web } from "../Constants";
import { createFolder, CreatePage } from "../utils";
import styles from './AddActif.module.scss';
import { IAddActifComponentsProps } from "./IAddActifComponentsProps";




export default function AddActifComponents (props:IAddActifComponentsProps){
  let [isOpen, setIsOpen] = React.useState(false);
  let [submitClick, setSubmitClick] = React.useState(false);
  let [form, setForm] = React.useState({denomination:"",latLng:"",derniere_valorisation:0, revenu_locatif:0, surface_ponderee:0, surface_titree:0, taux_occupation:0,adresse:"", etat_locatif:"", titre_foncier:"", type_de_bien:"", ville:0, location: false, vente: false});
  let [alert, setAlert] = React.useState(false);
  let [villes_options, setVilles_options] = React.useState([]);
  React.useEffect(() => {
  },[]);
  React.useEffect(() => {
    get_ville();
  },[]);
  
  
  function _onChangeLocation(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean) {
    setForm({...form, location: isChecked});
    console.log(`The option has been changed to ${isChecked}.`);
  }
  function _onChangeVente(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean) {
    setForm({...form, vente: isChecked});
    console.log(`The option has been changed to ${isChecked}.`);
  }
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Félicitation',
    subText: 'L\'actif a été crée avec succès',
  };
  const modelProps = {
    isBlocking: false,
    styles: { main: { maxWidth: 650 } },
  };
  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
  };
  const options_villes: IDropdownOption[] = villes_options;
  const options_type_de_bien: IDropdownOption[] = [
    { key: 'Appartement', text: 'Appartement'},
    { key: 'Immeuble bureau', text: 'Immeuble bureau'},
    { key: 'Immeuble habitation', text: 'Immeuble habitation'},
    { key: 'Immeuble mixte', text: 'Immeuble mixte' },
    { key: 'Local commercial', text: 'Local commercial' },
    { key: 'Professionnel', text: 'Professionnel' },
    { key: 'Terrain nu', text: 'Terrain nu' },
    { key: 'Unité industrielle/logistique', text: 'Unité industrielle/logistique' },
    { key: 'Villa (commerciale)', text: 'Villa (commerciale)' },
    { key: 'Villa (habitation)', text: 'Villa (habitation)' },
  ];
  const options_etat_locatif: IDropdownOption[] = [
    { key: 'Non concerné', text: 'Non concerné'},
    { key: 'Loué (ou à louer)', text: 'Loué (ou à louer)'}/*,
    { key: 'Vendu (ou à vendre)', text: 'Vendu (ou à vendre)'}*/
  ];
  const onChange_type_de_bien = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setForm({...form, type_de_bien: item.key.toString()});
  };
  const onChange_etat_locatif = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setForm({...form, etat_locatif: item.key.toString()});
  };
  const onChange_ville = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setForm({...form, ville: parseInt(item.key.toString())});
  };
  async function get_ville(){
    const villes = await web.lists.getByTitle("Villes").items.getAll();
    var villes_array_options=[];
      villes.map(el => {
        var ville_options = { key: el.Id, text: el.Title}
        villes_array_options.push(ville_options);
      });
    setVilles_options(villes_array_options);
  }
  async function _onSubmit(){
    setIsOpen(false);
    setSubmitClick(true);
    /* save new actif */
    // const item2 = await web.lists.getByTitle("Actifs").items.get();
    // console.log("item2", item2)
    if(form.etat_locatif === 'Loué (ou à louer)'){}
    await sp.web.lists.getByTitle("Actifs").items.add({
      Title: form.denomination,
      Latitude_x002d_Longitude: form.latLng,
      Derni_x00e8_re_x0020_valorisatio: form.derniere_valorisation,
      Revenu_x0020_locatif_x0020__x002: form.revenu_locatif,
      Surface_x0020_pond_x00e9_r_x00e9: form.surface_ponderee,
      Surface_x0020_titr_x00e9_e_x0020: form.surface_titree,
      Taux_x0020_d_x0027_occupation_x0: form.taux_occupation,
      WorkAddress: form.adresse,
      Etat_x0020_locatif: form.etat_locatif,
      Titre_x0028_s_x0029__x0020_fonci: form.titre_foncier,
      Typologie_x0020_de_x0020_bien: form.type_de_bien,
      Ville_x0020_actifId: form.ville
    }).then(item=>{
      setForm({...form, denomination:"",latLng:"",
      derniere_valorisation:0, revenu_locatif:0, surface_ponderee:0,
      surface_titree:0, taux_occupation:0,adresse:"", etat_locatif:"",
      titre_foncier:"", type_de_bien:"", ville:0});
      createFolder("Documents%20Actifs", form.denomination);
      setAlert(true);
      createFolder("IMAGES1", form.denomination);
      /*if(form.location && !form.vente){
        CreateEtatLocatif(form.denomination);
      }
      else if(!form.location && form.vente){
        CreateVente(form.denomination);
      }
      else if(form.location && form.vente){
        CreateEtatLocatif( form.denomination);
        CreateVente(form.denomination);
      }*/
      CreatePage(form.denomination, item.data);
      //il faut un update pour le lien de l'actif vers la page créé
    }); 
  }
  return (
    <div>
      {alert?       
        <Dialog hidden={!alert}  onDismiss={()=>setAlert(false)}  dialogContentProps={dialogContentProps} modalProps={modelProps} >
          <DialogFooter>
            <DefaultButton onClick={()=>setAlert(false)} text="Cancel" />
          </DialogFooter>
        </Dialog>
      :<></>}
        <Stack horizontal horizontalAlign="center"> 
          <a href="#" className={ styles.button } onClick={() => setIsOpen(true)}>
            <span className={ styles.label }>Nouveau actif</span>
          </a>
        </Stack>
        <Panel isOpen={isOpen} onDismiss={()=> setIsOpen(false)} headerText="Information d'Actif" closeButtonAriaLabel="Close">
          <Stack tokens={{childrenGap:10}}>{/* stack organise les flex */}
            <TextField label="Dénomination" placeholder="Entrer la Dénomination de l'actif" onChange={(e) => setForm({...form, denomination:(e.target as HTMLInputElement).value}) }/>
            <TextField label="Latitude-Longitude" placeholder="Entrer la latitude et la longitude de l'actif" onChange={(e) => setForm({...form, latLng:(e.target as HTMLInputElement).value}) }/>
            <Dropdown  placeholder="Selectionner la ville" label="Villes" options={options_villes} styles={dropdownStyles} defaultSelectedKey={form.ville} onChange={onChange_ville} />
            <TextField label="Dernière valorisation (dhs)" placeholder="Dernière valorisation (dhs)" onChange={(e) => setForm({...form, derniere_valorisation:parseFloat((e.target as HTMLInputElement).value)}) }/>    
            <TextField label="Revenu locatif (dhs/mois)" placeholder="Revenu locatif (dhs/mois)" onChange={(e) => setForm({...form, revenu_locatif:parseFloat((e.target as HTMLInputElement).value)}) }/>   
            <TextField label="Surface pondérée utile (m2)" placeholder="Surface pondérée utile (m2)" onChange={(e) => setForm({...form, surface_ponderee:parseFloat((e.target as HTMLInputElement).value)}) }/>
            <TextField label="Surface titrée (m2)" placeholder="Surface titrée (m2)" onChange={(e) => setForm({...form, surface_titree:parseFloat((e.target as HTMLInputElement).value)}) }/>
            <TextField label="Taux d'occupation (%)" placeholder="Taux d'occupation (%)" onChange={(e) => setForm({...form, taux_occupation:parseFloat((e.target as HTMLInputElement).value)}) }/>
            <TextField label="Titre(s) foncier(s)" placeholder="Titre(s) foncier(s)" onChange={(e) => setForm({...form, titre_foncier:(e.target as HTMLInputElement).value}) }/>
            <Dropdown placeholder="Typologie de bien" label="TYPE DE BIEN" options={options_type_de_bien} styles={dropdownStyles} defaultSelectedKey={form.type_de_bien} onChange={onChange_type_de_bien} />
            <TextField label="Adresse" placeholder="Entrer L'adresse de l'actif" onChange={(e) => setForm({...form, adresse:(e.target as HTMLInputElement).value}) }/>
            <Dropdown placeholder="Etat" label="Etat" options={options_etat_locatif} styles={dropdownStyles} defaultSelectedKey={form.etat_locatif} onChange={onChange_etat_locatif} />
            
            {/* <Checkbox label="Cet employé est apte à être un visiteur?" onChange={_onChangeLocation} checked={form.location}/>
            <Checkbox label="Cet employé est apte à être un visiteur?" onChange={_onChangeVente} checked={form.vente}/> */}
            <Stack horizontal horizontalAlign="end" tokens={{childrenGap:30}}>
              <PrimaryButton text="Ajouter" onClick={async() => await _onSubmit()}></PrimaryButton>
              <DefaultButton text="Cancel" onClick={() => setIsOpen(false)}></DefaultButton>
            </Stack>
          </Stack>
        </Panel>
    </div>
  );
}

