import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'GenererActifCommandSetStrings';
import GenererActifDialog from './components/GenererActifDialog';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IGenererActifCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'GenererActifCommandSet';

export default class GenererActifCommandSet extends BaseListViewCommandSet<IGenererActifCommandSetProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized GenererActifCommandSet');
    return Promise.resolve();
  }

  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    if (compareOneCommand) {
      compareOneCommand.visible = ( event.selectedRows.length === 1 && event.selectedRows[0].getValueByName("Statut_x0020_du_x0020_contrat") === "Actif" );
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    let id_contrat:number = event.selectedRows[0].getValueByName("ID");
    console.log("HELLO")
    let referenceContrat:string = event.selectedRows[0].getValueByName("R_x00e9_f_x00e9_rence");
    switch (event.itemId) {
      case 'COMMAND_1':
        const dialog: GenererActifDialog = new GenererActifDialog();
        dialog.Statut = "Accordé";
        dialog.id_contrat = id_contrat;
        dialog.referenceContrat = referenceContrat;
        dialog.show();
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
