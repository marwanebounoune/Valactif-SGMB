import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ComparableMapSgmbWebPartStrings';
import ComparableMapSgmb from './components/ComparableMapSgmb';
import { IComparableMapSgmbProps } from './components/IComparableMapSgmbProps';
import { sp } from '@pnp/sp';
import { graph } from "@pnp/graph";

export interface IComparableMapSgmbWebPartProps {
  reference: string;
  description: string;
  ctx: WebPartContext;
}

export default class ComparableMapSgmbWebPart extends BaseClientSideWebPart<IComparableMapSgmbWebPartProps> {
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
    const element: React.ReactElement<IComparableMapSgmbProps> = React.createElement(
      ComparableMapSgmb,
      {
        description: this.properties.description,
        reference: this.properties.reference,
        ctx: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }
  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
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
            },
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('reference', {
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
