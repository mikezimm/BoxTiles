import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { makePropDataText, makePropDataSliders } from '@mikezimm/npmfunctions/dist/Services/PropPane/zReusablePropPane';
import * as strings from 'BoxTilesWebPartStrings';
import BoxTiles from './components/BoxTiles';
import { IBoxTilesProps, IBoxStyles } from './components/IBoxTilesProps';
import { sampleData, test } from './sampleData1';

import { getHelpfullErrorV2, } from '@mikezimm/npmfunctions/dist/Services/Logging/ErrorHandler';
import { divProperties } from 'office-ui-fabric-react';

export interface IBoxTilesWebPartProps {
  description: string;
  boxLinks: string;
  boxTiles: string;
  flexBoxes: string;
  tileBox: string;
  imageDiv: any;
  minWidth: number;  //min width of a tile box
  maxWidth: number;  //max width of a tile box
}


export default class BoxTilesWebPart extends BaseClientSideWebPart<IBoxTilesWebPartProps> {



  public render(): void {

    let errMessage = null;

    let boxStyles : IBoxStyles = {
      boxLinks: null,
      boxTiles: null,
      flexBoxes: null,
      tileBox: null,
      imageDiv: null,
      minWidth: this.properties.minWidth ? this.properties.minWidth : 120,
      maxWidth: this.properties.maxWidth ? this.properties.maxWidth : 180,
    };

    Object.keys( boxStyles ).map( key => {
      try {
        if ( this.properties[ key ] && this.properties[ key ].length > 0 ) {
          if ( this.properties[ key ].indexOf('{') !== 0 ) { this.properties[ key ] = '{' + this.properties[ key ] ;}
          if ( this.properties[ key ].lastIndexOf('}') !== this.properties[ key ].length -1 ) { this.properties[ key ] += '}' ;}
          boxStyles [ key ] = JSON.parse( this.properties[ key ] );
        }
      } catch(e){
        // errMessage = getHelpfullErrorV2( e, true, true, null ); //'BoxTilesWebpart.ts ~ boxStyles.' + key
        errMessage = `${key} property is not correct JSON format - React.CSSProperties type but without outer { "background":"red" }`;

  
      }
    });

    const anySampleData: any[] = sampleData;
    console.log('raw untouched sample Data: ', anySampleData );
    const element: React.ReactElement<IBoxTilesProps> = React.createElement(
      BoxTiles,
      {
        description: this.properties.description,
        items: anySampleData,
        boxStyles: boxStyles,
        errMessage: errMessage,
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

    let allProps: any[] = makePropDataText( ['description', 'boxLinks', 'boxTiles', 'flexBoxes', 'tileBox', 'imageDiv'], [], '', false );
    allProps = makePropDataSliders( ['minWidth','maxWidth'], allProps, 120, 600, 10, false );

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: allProps
            }
          ]
        }
      ]
    };
  }
}
