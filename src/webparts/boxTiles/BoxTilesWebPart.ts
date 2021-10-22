import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'BoxTilesWebPartStrings';
import BoxTiles from './components/BoxTiles';
import { IBoxTilesProps } from './components/IBoxTilesProps';
import { sampleData, test } from './sampleData1';

export interface IBoxTilesWebPartProps {
  description: string;
}

export default class BoxTilesWebPart extends BaseClientSideWebPart<IBoxTilesWebPartProps> {


  public render(): void {

    const anySampleData: any[] = sampleData;
    console.log('raw untouched sample Data: ', anySampleData );
    const element: React.ReactElement<IBoxTilesProps> = React.createElement(
      BoxTiles,
      {
        description: this.properties.description,
        items: anySampleData,
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
