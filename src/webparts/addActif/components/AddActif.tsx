import * as React from 'react';
import styles from './AddActif.module.scss';
import { IAddActifProps } from './IAddActifProps';
import { escape } from '@microsoft/sp-lodash-subset';
import AddActifComponents from './AddActifComponents';

export default class AddActif extends React.Component<IAddActifProps, {}> {
  public render(): React.ReactElement<IAddActifProps> {
    return (
      <div className={ styles.addActif }>
        <AddActifComponents buttonTitle={'Ajouter Un Actif'} />
      </div>
    );
  }
}
