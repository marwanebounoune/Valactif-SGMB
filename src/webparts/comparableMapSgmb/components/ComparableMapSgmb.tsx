import * as React from 'react';
import styles from './ComparableMapSgmb.module.scss';
import { IComparableMapSgmbProps } from './IComparableMapSgmbProps';
import MapContainer from './MapContainer';

export default class ComparableMapSgmb extends React.Component<IComparableMapSgmbProps, {}> {
  private old_desc = null;
  constructor(props) {
    super(props);
    this.old_desc=props.description;
    this.state = {old_key: props.description};
  }

  public render(): React.ReactElement<IComparableMapSgmbProps> {
    return (
      <div className={ styles.comparableMapSgmb }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <MapContainer context={this.props.ctx} GoogleKey={this.props.description} Reference={this.props.reference}/>
          </div>
        </div>
      </div>
    );
  }
}
  
