import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { ColorPicker } from 'office-ui-fabric-react/lib/ColorPicker';
import { DialogFooter, DialogContent } from 'office-ui-fabric-react/lib/Dialog';
import { IColor } from 'office-ui-fabric-react/lib/Color';
import { IGenererActifDialogContentProps } from './IGenererActifDialogContentProps';
import { TextField } from '@material-ui/core';
import {Dropdown, IDropdownOption, Dialog, IDropdownStyles, DialogType} from 'office-ui-fabric-react';

const options_folder: IDropdownOption[] = [
    { key: 'Actifs simlpes', text: 'Actif simlpe'},
    { key: 'Grands actifs', text: 'Grands actifs'},
  ];
const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
  };
const modelProps = {
    isBlocking: false,
    styles: { main: { maxWidth: 450 } },
  };
var dialogContentProps = {
    type: DialogType.normal,
    title: 'Alert',
    subText: 'Veuillez Spécifier les informations demandées (le nombre de sous-dossiers et le dossier de destination)',
};
export default class GenererActifDialogContent extends React.Component<IGenererActifDialogContentProps, {alert:boolean, nbr_dossier:number, FolderPere:string, 
    showCustomisedAnimatedDialo:boolean,
    showSuccessDialog:boolean,
    showErrorDialog:boolean}> {

    constructor(props) {
        super(props);
        this.state={
            alert:false,
            nbr_dossier:0,
            FolderPere:"",
            showCustomisedAnimatedDialo:false,
            showSuccessDialog:false,
            showErrorDialog:false
        }
    }
    public render(): JSX.Element {
        return <div>
            {this.state.alert ? 
            <Dialog 
                hidden={!this.state.alert} 
                onDismiss={()=> this.setState({alert:false})} 
                dialogContentProps={dialogContentProps}
                modalProps={modelProps}
            >
                <DialogFooter>
                <DefaultButton onClick={()=>this.setState({alert:false})} text="Cancel" />
                </DialogFooter>
            </Dialog>
            :<></>}
            <DialogContent title='Veuillez-remplir les informations' subText={this.props.message} onDismiss={this.props.close} showCloseButton={true}>
                <Dropdown onChange={this.onChange_nbr_dossier} placeholder="Selectionner un type*" label="Selectionner un type*" options={options_folder} styles={dropdownStyles} defaultSelectedKey={this.state.FolderPere}/>
                {this.state.FolderPere === "Grands actifs" ?
                <TextField label="Nombre d(es)'actif(s)*" placeholder="Entrez le nombre d(es)'actif(s)*" onChange={(e) => this.setState({nbr_dossier:parseInt((e.target as HTMLInputElement).value)}) }/>
                :<></>}
                <DialogFooter>
                    <DefaultButton text='Cancel' title='Cancel' onClick={this.props.close} />
                    <PrimaryButton text='OK' title='OK' onClick={() => { this.check_and_submit_data(); }} />
                </DialogFooter>
            </DialogContent>
        </div>;
    }
    private onChange_nbr_dossier = async (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): Promise<void> => {
        await this.setState({FolderPere:item.key.toString()});
    };
    private check_and_submit_data(){
        if (this.state.FolderPere === "" || this.state.FolderPere === "Grands actifs" && (this.state.nbr_dossier === 0 || isNaN(this.state.nbr_dossier))){
            this.setState({alert:true})
        }
        else{
            this.props.submit(this.state.nbr_dossier, this.state.FolderPere);
        }
    }
}