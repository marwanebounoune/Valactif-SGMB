import * as React from 'react';
import { ChoiceGroup, IChoiceGroupOption, ActionButton, Label, Checkbox, DefaultButton, Dialog, DialogFooter, DialogType, Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles, Panel, PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';
//import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
//import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
//import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
//import { useBoolean } from '@fluentui/react-hooks';
import { useBoolean } from '@uifabric/react-hooks';
import { WindowPopUp } from '../utils';
import styles from './MapComparablesSgmb.module.scss';

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

export const DialogAddRefOrganisme: React.FunctionComponent = () => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);

  return (
    <>
      <a className={styles.Pointer} onClick={toggleHideDialog}>Ajouter une référence</a>
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modelProps}
      >
        
        <h3>Cette fonctionalite n'est prise en compte dans la version gratuite, pour plus d'information veuiller contacter votre fournisseur.</h3>
        {/*<a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp("Residentiel", "https://valactifcom.sharepoint.com/sites/valactif-solutions/_layouts/15/listform.aspx?PageType=8&ListId=%7B07081DCA-E178-4E7C-B38B-AE0B903CDC23%7D&RootFolder=%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org&Source=https%3A%2F%2Fvalactifcom.sharepoint.com%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org%2FAllItems.aspx%3Fviewid%3D4e8b4796%252D0235%252D4e2f%252Db697%252D6581114a399c&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B546120059803CBCFA42F148BD6E7BDB8FCA6C92", "l_ref_Org");}}>Residentiel</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp('Villa', 'https://valactifcom.sharepoint.com/sites/valactif-solutions/_layouts/15/listform.aspx?PageType=8&ListId=%7B07081DCA-E178-4E7C-B38B-AE0B903CDC23%7D&RootFolder=%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org&Source=https%3A%2F%2Fvalactifcom.sharepoint.com%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org%2FAllItems.aspx%3Fviewid%3D4e8b4796%252D0235%252D4e2f%252Db697%252D6581114a399c&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B5461400091315A2E913784FA298ADF874085B84',"l_ref_Org");}}>Villa</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp('Commercial', 'https://valactifcom.sharepoint.com/sites/valactif-solutions/_layouts/15/listform.aspx?PageType=8&ListId=%7B07081DCA-E178-4E7C-B38B-AE0B903CDC23%7D&RootFolder=%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org&Source=https%3A%2F%2Fvalactifcom.sharepoint.com%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org%2FAllItems.aspx%3Fviewid%3D4e8b4796%252D0235%252D4e2f%252Db697%252D6581114a399c&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B5461300F1F3B901EDF94E419143CD2ED32F2D58', "l_ref_Org");}}>Commercial</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp('Professionnel', 'https://valactifcom.sharepoint.com/sites/valactif-solutions/_layouts/15/listform.aspx?PageType=8&ListId=%7B07081DCA-E178-4E7C-B38B-AE0B903CDC23%7D&RootFolder=%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org&Source=https%3A%2F%2Fvalactifcom.sharepoint.com%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org%2FAllItems.aspx%3Fviewid%3D4e8b4796%252D0235%252D4e2f%252Db697%252D6581114a399c&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B5461500CA6C0461BA56864E8561FFDAB7EBCA3F', "l_ref_Org");}}>Professionnel</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp('Terrain urbain', 'https://valactifcom.sharepoint.com/sites/valactif-solutions/_layouts/15/listform.aspx?PageType=8&ListId=%7B07081DCA-E178-4E7C-B38B-AE0B903CDC23%7D&RootFolder=%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org&Source=https%3A%2F%2Fvalactifcom.sharepoint.com%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org%2FAllItems.aspx%3Fviewid%3D4e8b4796%252D0235%252D4e2f%252Db697%252D6581114a399c&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B54616009936AB24FDC4A24DB7D7A632C2C31E42', "l_ref_Org");}}>Terrain urbain</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp('Terrain villa', 'https://valactifcom.sharepoint.com/sites/valactif-solutions/_layouts/15/listform.aspx?PageType=8&ListId=%7B07081DCA-E178-4E7C-B38B-AE0B903CDC23%7D&RootFolder=%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org&Source=https%3A%2F%2Fvalactifcom.sharepoint.com%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org%2FAllItems.aspx%3Fviewid%3D4e8b4796%252D0235%252D4e2f%252Db697%252D6581114a399c&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B5461700436A3DBC15EC6149BD17DD8BBAD3E5AC', "l_ref_Org");}}>Terrain villa</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp('Terrain construit', 'https://valactifcom.sharepoint.com/sites/valactif-solutions/_layouts/15/listform.aspx?PageType=8&ListId=%7B07081DCA-E178-4E7C-B38B-AE0B903CDC23%7D&RootFolder=%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org&Source=https%3A%2F%2Fvalactifcom.sharepoint.com%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org%2FAllItems.aspx%3Fviewid%3D4e8b4796%252D0235%252D4e2f%252Db697%252D6581114a399c&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B5461800EBBFD63D287E644DADAE013801CD5CD7', "l_ref_Org");}}>Terrain construit</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp('Terrain agricole', 'https://valactifcom.sharepoint.com/sites/valactif-solutions/_layouts/15/listform.aspx?PageType=8&ListId=%7B07081DCA-E178-4E7C-B38B-AE0B903CDC23%7D&RootFolder=%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org&Source=https%3A%2F%2Fvalactifcom.sharepoint.com%2Fsites%2Fvalactif-solutions%2FLists%2Fl_ref_Org%2FAllItems.aspx%3Fviewid%3D4e8b4796%252D0235%252D4e2f%252Db697%252D6581114a399c&ContentTypeId=0x0100575E37A7210C944BB13FD267F206B54619008FE7C2D9C2B84B40A9B8C156051A7A71', "l_ref_Org");}}>Terrain agricole</a>
        */}
      </Dialog>
      </>
  );
};
