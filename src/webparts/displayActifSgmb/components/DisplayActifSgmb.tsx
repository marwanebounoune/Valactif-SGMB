import * as React from 'react';
import styles from './DisplayActifSgmb.module.scss';
import { IDisplayActifSgmbProps } from './IDisplayActifSgmbProps';
import { escape } from '@microsoft/sp-lodash-subset';
import AfficherActifs from './AfficherActifs';

export default class DisplayActifSgmb extends React.Component<IDisplayActifSgmbProps, {}> {
  public render(): React.ReactElement<IDisplayActifSgmbProps> {
    return (
      <div className={ styles.displayActifSgmb }>
        <div className={ styles.container }>
          <AfficherActifs actif_title={this.props.description} ctx={this.props.ctx}/>
        </div>
      </div>
    );
  }
    
}
  