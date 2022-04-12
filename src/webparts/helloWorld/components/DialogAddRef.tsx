import * as React from 'react';
import { ChoiceGroup, IChoiceGroupOption, ActionButton, Label, Checkbox, DefaultButton, Dialog, DialogFooter, DialogType, Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles, Panel, PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';
//import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
//import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
//import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
//import { useBoolean } from '@fluentui/react-hooks';
import { useBoolean } from '@uifabric/react-hooks';
import { WindowPopUp } from '../utils';

const options: IChoiceGroupOption[] = [
  { key: 'A', text: 'Option A' },
  { key: 'B', text: 'Option B' },
  { key: 'C', text: 'Option C', disabled: true },
];
const modelProps = {
  isBlocking: false,
  styles: { main: { maxWidth: 450 } },
};
const dialogContentProps = {
  type: DialogType.largeHeader,
  title: "Selectionnez le type de référence!",
  subText: '',
};

export const DialogLargeHeaderExample: React.FunctionComponent = () => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);

  return (
    <>
      {/* <a href="#" onClick={toggleHideDialog}>Ajouter une référence</a> */}
      <ActionButton iconProps={{iconName: 'MapPin'}} text='Ajouter évaluation' onClick={() => toggleHideDialog}/>
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modelProps}
      >
        {/*<ChoiceGroup defaultSelectedKey="B" options={options} />
        <DialogFooter>
          <PrimaryButton onClick={toggleHideDialog} text="Save" />
          <DefaultButton onClick={toggleHideDialog} text="Cancel" />https://valactifcom.sharepoint.com/sites/valactif-solutions/Lists/l_ref_Org/NewForm.aspx?Source=https%3A%2F%2Fvalactifcom%2Esharepoint%2Ecom%2Fsites%2Fvlctf%2Dclient2%2FLists%2Fl%5Fref%5FOrg%2FAllItems%2Easpx&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B5460C001300092CC20D8D48BE97F1B6B98282A3&RootFolder=%2Fsites%2Fvlctf%2Dclient2%2FLists%2Fl%5Fref%5FOrg&OR=Teams%2DHL&CT=1634739624795
        </DialogFooter>*/}
        <h1>Cette fonctionalite n'est pas prise en compte dans la version gratuite, pour plus d'information veuiller contacter votre fournisseur.</h1>
        {/*<a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp("Ajouter une référence (Residentiel)", "https://valactifcom.sharepoint.com/sites/valactif-solutions/SitePages/Message.aspx","l_ref_Dexa");}}>Ajouter une référence (Residentiel)</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp("Ajouter une référence (Villa)", "https://valactifcom.sharepoint.com/sites/valactif-solutions/SitePages/Message.aspx","l_ref_Dexa");}}>Ajouter une référence (Residentiel)</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp("Ajouter une référence (Commercial)", "https://valactifcom.sharepoint.com/sites/valactif-solutions/SitePages/Message.aspx","l_ref_Dexa");}}>Ajouter une référence (Residentiel)</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp("Ajouter une référence (Professionnel)", "https://valactifcom.sharepoint.com/sites/valactif-solutions/SitePages/Message.aspx","l_ref_Dexa");}}>Ajouter une référence (Residentiel)</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp("Ajouter une référence (Terrain urbain)", "https://valactifcom.sharepoint.com/sites/valactif-solutions/SitePages/Message.aspx","l_ref_Dexa");}}>Ajouter une référence (Residentiel)</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp("Ajouter une référence (Residentiel)", "https://valactifcom.sharepoint.com/sites/valactif-solutions/SitePages/Message.aspx","l_ref_Dexa");}}>Ajouter une référence (Residentiel)</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp("Ajouter une référence (Residentiel)", "https://valactifcom.sharepoint.com/sites/valactif-solutions/SitePages/Message.aspx","l_ref_Dexa");}}>Ajouter une référence (Residentiel)</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp("Ajouter une référence (Residentiel)", "https://valactifcom.sharepoint.com/sites/valactif-solutions/SitePages/Message.aspx","l_ref_Dexa");}}>Ajouter une référence (Residentiel)</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp('Ajouter une référence (Villa)', 'https://valactifcom.sharepoint.com/sites/valactif-solutions/Lists/l_ref_Dexa/NewForm.aspx?Source=https%3A%2F%2Fvalactifcom%2Esharepoint%2Ecom%2Fsites%2Fvlctf%2Dclient2&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B5460B0045D3E91AC76CDA448C2BB217E5D67BBF&RootFolder=%2Fsites%2Fvlctf%2Dclient2%2FLists%2Fl%5Fref%5FDEXA', "l_ref_Dexa");}}>Ajouter une référence (Villa)</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp('', 'https://valactifcom.sharepoint.com/sites/valactif-solutions/Lists/l_ref_Dexa/NewForm.aspx?Source=https%3A%2F%2Fvalactifcom%2Esharepoint%2Ecom%2Fsites%2Fvlctf%2Dclient2&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B546030026BA84521C67914F81F390860CDA6895&RootFolder=%2Fsites%2Fvlctf%2Dclient2%2FLists%2Fl%5Fref%5FDEXA', "l_ref_Dexa");}}>Ajouter une référence (Commercial)</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp('', 'https://valactifcom.sharepoint.com/sites/valactif-solutions/Lists/l_ref_Dexa/NewForm.aspx?Source=https%3A%2F%2Fvalactifcom%2Esharepoint%2Ecom%2Fsites%2Fvlctf%2Dclient2&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B546040074594F0EBDFDC74992FB57FACC1CFFD2&RootFolder=%2Fsites%2Fvlctf%2Dclient2%2FLists%2Fl%5Fref%5FDEXA', "l_ref_Dexa");}}>Ajouter une référence (Professionnel)</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp('', 'https://valactifcom.sharepoint.com/sites/valactif-solutions/Lists/l_ref_Dexa/NewForm.aspx?Source=https%3A%2F%2Fvalactifcom%2Esharepoint%2Ecom%2Fsites%2Fvlctf%2Dclient2&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B5460800C74DF17528F4E741AFA6E797C754B7AC&RootFolder=%2Fsites%2Fvlctf%2Dclient2%2FLists%2Fl%5Fref%5FDEXA', "l_ref_Dexa");}}>Ajouter une référence (Terrain urbain)</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp('', 'https://valactifcom.sharepoint.com/sites/valactif-solutions/Lists/l_ref_Dexa/NewForm.aspx?Source=https%3A%2F%2Fvalactifcom%2Esharepoint%2Ecom%2Fsites%2Fvlctf%2Dclient2&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B546070047D0F36A09373845AA454C8412AAEF78&RootFolder=%2Fsites%2Fvlctf%2Dclient2%2FLists%2Fl%5Fref%5FDEXA', "l_ref_Dexa");}}>Ajouter une référence (Terrain villa)</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp('Ajouter une référence (Terrain construit)', 'https://valactifcom.sharepoint.com/sites/valactif-solutions/Lists/l_ref_Dexa/NewForm.aspx?Source=https%3A%2F%2Fvalactifcom%2Esharepoint%2Ecom%2Fsites%2Fvlctf%2Dclient2&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B5460900030A2F880819D84A8709C98991740D3B&RootFolder=%2Fsites%2Fvlctf%2Dclient2%2FLists%2Fl%5Fref%5FDEXA', "l_ref_Dexa");}}>Ajouter une référence (Terrain construit)</a>
      <br/>*/}
        {/* <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp('Ajouter une référence (Terrain agricole)', 'https://valactifcom.sharepoint.com/sites/valactif-solutions/Lists/l_ref_Dexa/NewForm.aspx?Source=https%3A%2F%2Fvalactifcom%2Esharepoint%2Ecom%2Fsites%2Fvlctf%2Dclient2&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B5460A000DACE3934562564889AB9B467480E4F7&RootFolder=%2Fsites%2Fvlctf%2Dclient2%2FLists%2Fl%5Fref%5FDEXA', "l_ref_Dexa");}}>Ajouter une référence (Terrain agricole)</a> */}
    
      </Dialog>
    </>
  );
};
