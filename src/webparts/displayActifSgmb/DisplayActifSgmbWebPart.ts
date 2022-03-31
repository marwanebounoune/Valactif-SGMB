import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';

import * as strings from 'DisplayActifSgmbWebPartStrings';
import DisplayActifSgmb from './components/DisplayActifSgmb';
import { IDisplayActifSgmbProps } from './components/IDisplayActifSgmbProps';
import { sp } from '@pnp/sp';

export interface IDisplayActifSgmbWebPartProps {
  description: string;
  ctx: WebPartContext;
}

export default class DisplayActifSgmbWebPart extends BaseClientSideWebPart<IDisplayActifSgmbWebPartProps> {
  protected onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context
    });
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IDisplayActifSgmbProps> = React.createElement(
      DisplayActifSgmb,
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
