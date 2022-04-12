import * as React from 'react';
import styles from './DescriptifActif.module.scss';
import { IDescriptifActifProps } from './IDescriptifActifProps';
import AfficherActifs from './AfficherActifs';

export default class DescriptifActif extends React.Component<IDescriptifActifProps, {}> {
  public render(): React.ReactElement<IDescriptifActifProps> {
    return (
      <div className={ styles.descriptifActif }>
          <AfficherActifs actif_title={this.props.description} ctx={this.props.ctx}/>
      </div>
    );
  }
}
