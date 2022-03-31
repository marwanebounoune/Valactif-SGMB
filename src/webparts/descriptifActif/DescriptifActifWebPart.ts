import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';

import * as strings from 'DescriptifActifWebPartStrings';
import DescriptifActif from './components/DescriptifActif';
import { IDescriptifActifProps } from './components/IDescriptifActifProps';
import { sp } from '@pnp/sp';

export interface IDescriptifActifWebPartProps {
  description: string;
  ctx: WebPartContext;
}

export default class DescriptifActifWebPart extends BaseClientSideWebPart<IDescriptifActifWebPartProps> {
  protected onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context
    });
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IDescriptifActifProps> = React.createElement(
      DescriptifActif,
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
