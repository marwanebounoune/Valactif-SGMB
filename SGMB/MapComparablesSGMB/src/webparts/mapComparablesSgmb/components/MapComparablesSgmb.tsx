import * as React from 'react';
import styles from './MapComparablesSgmb.module.scss';
import { IMapComparablesSgmbProps } from './IMapComparablesSgmbProps';
import MapContainer from './MapContainer';

export default class MapComparablesSgmb extends React.Component<IMapComparablesSgmbProps, {}> {
  private old_desc = null;
  constructor(props) {
    super(props);
    this.old_desc=props.description;
    this.state = {old_key: props.description};
  }

  public render(): React.ReactElement<IMapComparablesSgmbProps> {
    return (
      <div className={ styles.mapComparablesSgmb }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            {console.log("THIS =>", this)}
            <MapContainer context={this.props.ctx} GoogleKey={this.props.description} Reference={this.props.Reference}/>
          </div>
        </div>
      </div>
    );
  }
}
  
