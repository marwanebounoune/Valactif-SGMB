import * as React from 'react';
import styles from './DisplayActif.module.scss';
import { IDisplayActifProps } from './IDisplayActifProps';
import { escape } from '@microsoft/sp-lodash-subset';
import AfficherActifs from './AfficherActif';

export default class DisplayActif extends React.Component<IDisplayActifProps, {}> {
  public render(): React.ReactElement<IDisplayActifProps> {
    return (
      <div className={ styles.displayActif }>
        <div className={ styles.container }>
          <AfficherActifs async actif_title={this.props.description} ctx={this.props.ctx}/>
        </div>
      </div>
    );
  }
}
