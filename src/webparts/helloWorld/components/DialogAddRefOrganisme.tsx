import * as React from 'react';
import { ChoiceGroup, IChoiceGroupOption, ActionButton, Label, Checkbox, DefaultButton, Dialog, DialogFooter, DialogType, 
  Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles, Panel, PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';
//import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
//import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
//import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
//import { useBoolean } from '@fluentui/react-hooks';
import { useBoolean } from '@uifabric/react-hooks';
import { WindowPopUp } from '../utils';
import styles from './HelloWorld.module.scss';

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
  title: "Ajouter référence",
  subText: '',
};

export const DialogAddRefOrganisme: React.FunctionComponent = () => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  let [alert, setAlert] = React.useState(false);

  return (
    <>
      {/* <a className={styles.Pointer} onClick={toggleHideDialog}>Ajouter une référence</a> */}
      <ActionButton iconProps={{iconName: 'MapPin'}} text='Ajouter référence' onClick={toggleHideDialog}/>
      <Dialog hidden={hideDialog} onDismiss={toggleHideDialog} dialogContentProps={dialogContentProps} modalProps={modelProps}
        styles={{main: {selectors: {['@media (min-width: 480px)']: { width: 600, height: 250, minWidth: 500, maxWidth: '1000px'}}}}}
      >
        <h3>Cette fonctionalite n'est pas prise en compte dans la version gratuite, pour plus d'information veuiller contacter votre fournisseur.</h3>
        <br/>
        <h4>E-mail: contact@valactif.com</h4>
      </Dialog>
    </>
  );
};
