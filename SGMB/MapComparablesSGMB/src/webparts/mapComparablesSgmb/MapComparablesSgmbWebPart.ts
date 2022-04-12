import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';

import * as strings from 'MapComparablesSgmbWebPartStrings';
import MapComparablesSgmb from './components/MapComparablesSgmb';
import { IMapComparablesSgmbProps } from './components/IMapComparablesSgmbProps';
import { sp } from '@pnp/sp';
import { graph } from "@pnp/graph";

export interface IMapComparablesSgmbWebPartProps {
  reference: string;
  description: string;
  ctx: WebPartContext;
}

export default class MapComparablesSgmbWebPart extends BaseClientSideWebPart<IMapComparablesSgmbWebPartProps> {
  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }
  protected onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context
    });
    graph.setup({
      spfxContext: this.context
    });
    return super.onInit();
  }
  public render(): void {
    const element: React.ReactElement<IMapComparablesSgmbProps> = React.createElement(MapComparablesSgmb,{
      description: this.properties.description,
      reference: this.properties.reference,
      ctx: this.context,
    });
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
                  label: strings.DescriptionFieldLabel,
                })
              ]
            },
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('Reference', {
                  label: strings.reference,
                })
              ]
            }
          ]
        }
      ]
    };
  }
  protected onPropertyPaneConfigurationComplete() {
    window.location.href = window.location.href
  }
}
