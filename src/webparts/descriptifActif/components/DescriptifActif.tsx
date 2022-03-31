import * as React from 'react';
import styles from './DescriptifActif.module.scss';
import { IDescriptifActifProps } from './IDescriptifActifProps';
import { escape } from '@microsoft/sp-lodash-subset';
import AfficherActifs from './AfficherActifs';

export default class DescriptifActif extends React.Component<IDescriptifActifProps, {}> {
  public render(): React.ReactElement<IDescriptifActifProps> {
    return (
      <div className={ styles.descriptifActif }>
        <div className={ styles.container }>
          <AfficherActifs actif_title={this.props.description} ctx={this.props.ctx}/>
        </div>
      </div>
    );
  }
}
