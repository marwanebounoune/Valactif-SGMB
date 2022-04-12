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
  title: "Selectionnez le type d'évaluation!",
  subText: '',
};

export const DialogEvaluation: React.FunctionComponent = () => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);

  return (
    <>
      <a className={styles.Pointer} onClick={toggleHideDialog}>Ajouter une évaluation</a>
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modelProps}
      >
        <h3>Cette fonctionalite n'est prise en compte dans la version gratuite, pour plus d'information veuiller contacter votre fournisseur.</h3>
        {/*<a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp("Residentiel", "https://valactifcom.sharepoint.com/sites/vlctf-client2/_layouts/15/listform.aspx?PageType=8&ListId=%7B4077F36A-8F58-4BC1-9E18-E3F7163D1796%7D&RootFolder=%2Fsites%2Fvlctf-client2%2FLists%2Fl_valorisation&Source=https%3A%2F%2Fvalactifcom.sharepoint.com%2Fsites%2Fvlctf-client2%2FLists%2Fl_valorisation%2FAllItems.aspx%3Forigin%3DcreateList&ContentTypeId=0x010007073A6AF0308845A110E1D52E7403480100DAF75C9314FEFE4DA4D51976A38E01A5","");}}>Residentiel</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp("Villa", "","");}}>Villa</a>
        <br/>
        <a href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp("Terrain pour villa", "","");}}>Terrain pour villa</a>
        <br/>*/}
      </Dialog>
    </>
  );
};
