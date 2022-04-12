import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';
import MapContainer from './MapContainer';

export default class HelloWorld extends React.Component<IHelloWorldProps, {}> {
  public render(): React.ReactElement<IHelloWorldProps> {
    return (
      <div className={styles.helloWorld}>
      <div className={ styles.container }>
        <div className={ styles.row }>
          <MapContainer GoogleKey={this.props.description}/>
        </div>
      </div>
    </div>
  );
}
}
