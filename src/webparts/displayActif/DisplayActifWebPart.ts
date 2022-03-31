import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DisplayActifWebPartStrings';
import DisplayActif from './components/DisplayActif';
import { IDisplayActifProps } from './components/IDisplayActifProps';

export interface IDisplayActifWebPartProps {
  description: string;
}

export default class DisplayActifWebPart extends BaseClientSideWebPart<IDisplayActifWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDisplayActifProps> = React.createElement(
      DisplayActif,
      {
        description: this.properties.description,
        ctx: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
