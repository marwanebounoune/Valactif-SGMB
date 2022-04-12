import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/webs";
import { ActionButton, TextField, DefaultButton, Dialog, DialogFooter, DialogType, Dropdown, IDropdownOption, IDropdownStyles, Label, Panel, PrimaryButton, Stack } from 'office-ui-fabric-react';
import * as React from 'react';
import { ICheckboxInput } from './ICheckboxInput';
import { IAddActifProps } from "./IAddActif";
import styles from './HelloWorld.module.scss';
import { graph } from "@pnp/graph";
import "@pnp/graph/users";

import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { createFolder, CreatePage } from "../utils";
import { DialogCredit } from './DialogCredit';

function AddActif (props:IAddActifProps){
    let [isOpen, setIsOpen] = React.useState(false);
    let [submitClick, setSubmitClick] = React.useState(false);
    let [form, setForm] = React.useState({denomination:"",latLng:"",derniere_valorisation:0, surface_ponderee:0, surface_titree:0, taux_occupation:0,adresse:"", titre_foncier:"", type_de_bien:"", type_expertise:"", tf:"", credit_demande:0, ville:0, region:0, client:0, location: false, vente: false});
    let [alert, setAlert] = React.useState(false);
    let [alertCree, setAlertCree] = React.useState(false);
    let [alertNonCree, setAlertNonCree] = React.useState(false);
    let [villes_options, setVilles_options] = React.useState([]);
    let [regions_options, setRegions_options] = React.useState([]);
    let [clients_options, setClients_options] = React.useState([]);
    let [dial, setDial] = React.useState(null);
    
    React.useEffect(() => {
        get_ville();
        get_client();
        get_region();
    },[]);
    const dialogContentProps = {
        type: DialogType.normal,
        title: 'Attention',
        subText: 'Veuillez Préciser le Protefeuilles Souhaité',
    };
    const dialogDossierCree = {
        type: DialogType.normal,
        title: 'Ok',
        subText: 'Votre dossier est crée avec succés.',
    };
    const dialogDossierNonCree = {
        type: DialogType.normal,
        title: 'Ok',
        subText: "Votre dossier n'est pas crée, veuiller remplir tous les champs.",
    };
    const options_type_de_bien: IDropdownOption[] = [
      { key: 'Résidentiel', text: 'Résidentiel'},
    //   { key: 'Immeuble bureau', text: 'Immeuble bureau'},
    //   { key: 'Immeuble habitation', text: 'Immeuble habitation'},
    //   { key: 'Immeuble mixte', text: 'Immeuble mixte' },
    //   { key: 'Local commercial', text: 'Local commercial' },
    //   { key: 'Professionnel', text: 'Professionnel' },
    //   { key: 'Terrain nu', text: 'Terrain nu' },
    //   { key: 'Unité industrielle/logistique', text: 'Unité industrielle/logistique' },
    //   { key: 'Villa (commerciale)', text: 'Villa (commerciale)' },
    //   { key: 'Villa (habitation)', text: 'Villa (habitation)' },
    ];
    const options_type_expertise: IDropdownOption[] = [
      { key: 'Interne', text: 'Interne'},
      { key: 'Externe', text: 'Externe'},
    ];
    const options_etat_locatif: IDropdownOption[] = [
      { key: 'Non concerné', text: 'Non concerné'},
      { key: 'Loué (ou à louer)', text: 'Loué (ou à louer)'}/*,
      { key: 'Vendu (ou à vendre)', text: 'Vendu (ou à vendre)'}*/
    ];
    const onChange_type_de_bien = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
      setForm({...form, type_de_bien: item.key.toString()});
    };
    const onChange_type_expertise = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
      setForm({...form, type_expertise: item.key.toString()});
    };
    const onChange_ville = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
      setForm({...form, ville: parseInt(item.key.toString())});
    };
    const onChange_region = async (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): Promise<void> => {
      await setForm({...form, region: parseInt(item.key.toString())});
      console.log("form.region", form.region)
      await get_ville();
    };
    const onChange_client = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
      setForm({...form, client: parseInt(item.key.toString())});
    };
    const FiltrageDialogContentProps = {
        type: DialogType.largeHeader,
        title: "Avis de valeur sur la zone",
        subText: '',
    };
    const options_villes: IDropdownOption[] = villes_options;
    const options_regions: IDropdownOption[] = regions_options;
    const options_clients: IDropdownOption[] = clients_options;
    const modelProps = {
        isBlocking: false,
        styles: { main: { maxWidth: 650 } },
    };
    const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: 300 },
    };
    const options_type_de_ref: ICheckboxInput[] = [
        { ID: 1, Title: 'Vente' },
        { ID: 2, Title: 'Lacation' },
        { ID: 3, Title: 'Rapport' },
    ];
    async function get_ville(){
        const villes = await sp.web.lists.getByTitle("Villes").items.getAll();
        var villes_array_options=[];
        villes.map(el => {
            var ville_options = { key: el.Id, text: el.Title}
            villes_array_options.push(ville_options);
            });
        setVilles_options(villes_array_options);
    }
    async function get_client(){
        const clients = await sp.web.lists.getByTitle("Personnes physiques").items.getAll();
        var clients_array_options=[];
        clients.map(el => {
            var clients_options = { key: el.Id, text: el.Title}
            clients_array_options.push(clients_options);
        });
        setClients_options(clients_array_options);
    }
    async function get_region(){
        const regions = await sp.web.lists.getByTitle("Régions").items.getAll();
        const dossiers = await sp.web.lists.getByTitle("Dossiers").items.getAll().then(res => {
            console.log("dossiers ->", res)
        });
        var regions_array_options=[];
        regions.map(el => {
            var regions_options = { key: el.Id, text: el.Title}
            regions_array_options.push(regions_options);
        });
        setRegions_options(regions_array_options);
    }
    async function _onSubmitAddAcfit(){
        setIsOpen(false);
        setSubmitClick(true);
        var dossier = await sp.web.lists.getByTitle("Dossiers").items.getAll();
        console.log("Dossiers", dossier)
        if(
            form.type_expertise != "" && form.denomination != "" && form.latLng != "" && form.client != 0 && form.ville != 0 &&
            form.adresse != "" && form.type_de_bien != "" && form.tf != "" && form.surface_titree != 0 && form.credit_demande != 0
        )
            await sp.web.lists.getByTitle("Dossiers").items.add({
                Type_x0020_d_x0027_expertise: form.type_expertise,
                Title: form.denomination,
                Latitude_x002d_Longitude: form.latLng,
                ClientId: form.client,
                Ville_x0020_actifId: form.ville,
                WorkAddress: form.adresse,
                Typologie_x0020_de_x0020_bien: form.type_de_bien,
                Titre_x0028_s_x0029__x0020_fonci: form.tf,
                Surface: form.surface_titree,
                Cr_x00e9_dit_x0020_demand_x00e9_: form.credit_demande,
                Statut: "En cours"
            })
            .then(async item=>{
                console.log("RES ADD DOSS", item)
                await sp.web.lists.getByTitle("Descriptifs dossiers").items.add({
                    Ref_actifId: item.data.ID
                })
                setForm({...form, denomination:"",latLng:"",derniere_valorisation:0, surface_ponderee:0,surface_titree:0, 
                    taux_occupation:0,adresse:"",titre_foncier:"", type_de_bien:"", ville:0, client:0, region:0, 
                    type_expertise:"", tf:"", credit_demande:0
                });
                createFolder("Documents%20Actifs", form.denomination);
                createFolder("Rapports", form.denomination);
                createFolder("IMAGES1", form.denomination);
                CreatePage(form.denomination, item.data);
                setAlertCree(true)
            }); 
        else
            setAlertNonCree(true)
    }
   
    return (<div>
        {alertNonCree?
            <Dialog 
            hidden={!alertNonCree} 
            onDismiss={()=>setAlert(false)} 
            dialogContentProps={dialogDossierNonCree}
            modalProps={modelProps}
            >
            <DialogFooter>
                <DefaultButton onClick={()=>setAlertNonCree(false)} text="Cancel" />
            </DialogFooter>
            </Dialog>
        :<></>}
            {/*<a className={styles.Pointer} onClick={() => setIsOpen(true)}>{props.buttonTitle}</a>*/}
            <ActionButton iconProps={{iconName: 'Add'}} text={props.buttonTitle} onClick={() => setIsOpen(true)}/>
            <Panel isOpen={isOpen} onDismiss={()=> setIsOpen(false)} headerText="Information sur l'actif" closeButtonAriaLabel="Close">
            <Stack tokens={{childrenGap:10}}>
                <Dropdown placeholder="Selectionner la typologie de l'expertise" label="Type de l'expertise" options={options_type_expertise} styles={dropdownStyles} defaultSelectedKey={form.type_expertise} onChange={onChange_type_expertise} />
                <TextField placeholder="Entrer la référence du dossier" label="Référence" onChange={(e) => setForm({...form, denomination:(e.target as HTMLInputElement).value}) }/>
                <TextField placeholder="Entrer la latitude et la longitude de l'actif" label="Latitude-Longitude" onChange={(e) => setForm({...form, latLng:(e.target as HTMLInputElement).value}) }/>
                <Dropdown  placeholder="Selectionner le client" label="Clients" options={options_clients} styles={dropdownStyles} defaultSelectedKey={form.client} onChange={onChange_client} />
                <Dropdown  placeholder="Selectionner la ville" label="Villes" options={options_villes} styles={dropdownStyles} defaultSelectedKey={form.ville} onChange={onChange_ville} />
                <TextField placeholder="Entrer l'adresse de l'actif" label="Adresse" onChange={(e) => setForm({...form, adresse:(e.target as HTMLInputElement).value}) }/>
                <Dropdown placeholder="Selectionner la typologie de bien" label="Type de bien" options={options_type_de_bien} styles={dropdownStyles} defaultSelectedKey={form.type_de_bien} onChange={onChange_type_de_bien} />
                <TextField placeholder="Entrer le(s) titre(s) foncier" label="TF(s)" onChange={(e) => setForm({...form, tf:(e.target as HTMLInputElement).value}) }/>
                <TextField placeholder="Surface titrée (m2)" label="Surface titrée (m2)" onChange={(e) => setForm({...form, surface_titree:parseFloat((e.target as HTMLInputElement).value)}) }/>
                <TextField placeholder="Entrer le crédit demandé (Dhs)" label="Crédit demandé (Dhs)" onChange={(e) => setForm({...form, credit_demande:parseFloat((e.target as HTMLInputElement).value)}) }/>
                <Stack horizontal horizontalAlign="end" tokens={{childrenGap:30}}>
                    <PrimaryButton text="Ajouter" onClick={async() => await _onSubmitAddAcfit()}></PrimaryButton>
                    <DefaultButton text="Cancel" onClick={() => setIsOpen(false)}></DefaultButton>
                </Stack>
            </Stack>
            </Panel>
        </div>
    );
}
export default AddActif;

