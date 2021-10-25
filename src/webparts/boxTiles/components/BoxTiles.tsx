import * as React from 'react';
import spfxStyles from './SPFXBoxTiles.module.scss';
import boxStyles from './BoxTiles.module.scss';
import { IBoxTilesProps, IBoxLink, IBoxObject } from './IBoxTilesProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Image, ImageFit, ImageCoverStyle } from 'office-ui-fabric-react/lib/Image';

import { css, IImageProps, sizeToPixels, } from 'office-ui-fabric-react';

import { sampleTenant, sampleSite, sampleCust } from './MockInfo';

/***
 *    d888888b .88b  d88. d8888b.  .d88b.  d8888b. d888888b      .d8888. d88888b d8888b. db    db d888888b  .o88b. d88888b .d8888. 
 *      `88'   88'YbdP`88 88  `8D .8P  Y8. 88  `8D `~~88~~'      88'  YP 88'     88  `8D 88    88   `88'   d8P  Y8 88'     88'  YP 
 *       88    88  88  88 88oodD' 88    88 88oobY'    88         `8bo.   88ooooo 88oobY' Y8    8P    88    8P      88ooooo `8bo.   
 *       88    88  88  88 88~~~   88    88 88`8b      88           `Y8b. 88~~~~~ 88`8b   `8b  d8'    88    8b      88~~~~~   `Y8b. 
 *      .88.   88  88  88 88      `8b  d8' 88 `88.    88         db   8D 88.     88 `88.  `8bd8'    .88.   Y8b  d8 88.     db   8D 
 *    Y888888P YP  YP  YP 88       `Y88P'  88   YD    YP         `8888Y' Y88888P 88   YD    YP    Y888888P  `Y88P' Y88888P `8888Y' 
 *                                                                                                                                 
 *                                                                                                                                 
 */

import { IPivotTileItemProps } from '../IPivotTileItemProps';

import { imageOptionsGroup, } from '@mikezimm/npmfunctions/dist/Services/PropPane/ReactImageOptions';
import { getHelpfullErrorV2, } from '@mikezimm/npmfunctions/dist/Services/Logging/ErrorHandler';

export default class BoxTiles extends React.Component<IBoxTilesProps, {}> {

  private setImgFit: any = this.props.boxStyles.setImgFit;
  private setImgCover: any = this.props.boxStyles.setImgFit;

  private cleanTitles( str: string ) {
    let replace1 = new RegExp( 'sampleSite', 'g');
    // let replace1 = new RegExp( '\${sampleSite}', 'g');
    let replace2 = new RegExp( 'sampleTenant', 'g');
    let replace3 = new RegExp( 'Customer', 'g');
    str = str.replace(replace1,sampleSite);
    str = str.replace(replace2,sampleTenant);
    str = str.replace(replace3,sampleCust );
    str = str.replace(replace3,sampleCust );
    return str;
  }

  /**
   * This just determines if the item contains info that should be forced into the BoxObject and locked.
   * @param item 
   */
  private propsLocked( item: IPivotTileItemProps ): boolean {
    let propsLocked: boolean = false;
    if ( item.title.toLocaleLowerCase().indexOf('BoxStyleSetting'.toLowerCase() ) ){
      propsLocked = true;
    } else if ( item.description.toLocaleLowerCase().indexOf('BoxStyleSetting'.toLowerCase() ) ){
      propsLocked = true;
    }
    return propsLocked;
  }

  private createBoxProps ( thisCategory: string, item: IPivotTileItemProps ): IBoxObject {

    let itemLocksProps: boolean = this.propsLocked( item );

    let boxObject:  IBoxObject = {

      imageUrl: this.cleanTitles(item.imageUrl),
    
      category: thisCategory,
      color: item.color,

      items: [],
      propsLocked: itemLocksProps,

    };
    return boxObject;
  }
  

  private updateBoxProps ( boxObject: IBoxObject, item: IPivotTileItemProps ) : IBoxObject {

    if ( boxObject.propsLocked === true ) { return boxObject ; }

    //See if this item will lock the props.  If so, set all props to this one's
    let itemLocksProps: boolean = this.propsLocked( item );

    let updateTheseProps: string[] = ['color'];

    updateTheseProps.map( key => {
      //Do update if this one locks them... replace everything.  Else if the current value is null, undefined or blank do update.
      let forceUpdate = itemLocksProps === true || boxObject[ key ] === null || boxObject[ key ] === undefined ? true : false;
      if ( forceUpdate === true ) { boxObject[ key ] = item[ key ] ; }

    });

    let cleanTheseProps: string[] = [ 'imageUrl','title','description','href' ];

    if ( itemLocksProps === true ) {
      cleanTheseProps.map( key => {
      //Do update if this one locks them... replace everything.  Else if the current value is null, undefined or blank do update.
      let forceUpdate = itemLocksProps === true || boxObject[ key ] === null || boxObject[ key ] === undefined ? true : false;
      if ( forceUpdate === true ) { boxObject[ key ] = this.cleanTitles(item[ key ]) ; }
      });
    }

    //'imageUrl',

    return boxObject;

  }
  
  public render(): React.ReactElement<IBoxTilesProps> {
    console.log('Component Props: ', this.props );
    //Create all categories (boxes)
    let boxes = [];
    let boxObjects : IBoxObject[] = [];

    if ( this.props.errMessage && this.props.errMessage !== '' ) {

      return (
        <div className={ spfxStyles.boxTiles } style={ this.props.boxStyles.boxTiles }>
        <div className={ boxStyles.boxErrors }>
          { this.props.errMessage }
        </div>
      </div>
      );

    } else {
      //create boxObjects
      this.props.items.map ( item => {
        item.category.map( category => {

          let thisCategory = this.cleanTitles(category);
          if ( boxes.indexOf( thisCategory ) < 0 ) { 
            boxes.push( thisCategory ) ;
            boxObjects.push( this.createBoxProps( thisCategory, item ) );

          } else {
            let boxIdx = boxes.indexOf( thisCategory );
            boxObjects[ boxIdx ] = this.updateBoxProps( boxObjects[ boxIdx ], item );

          }
        });
      });
      
      //This section makes the links in each box
      this.props.items.map ( item => {
        let target: any = item.target;
        let thisLink : IBoxLink = {
          description: this.cleanTitles(item.description),
          target: target,

          title: this.cleanTitles(item.title),
          href: this.cleanTitles(item.href),
          Id: item.id,

          color: item.color,
        };

        item.category.map( category => {
          let thisCategory = this.cleanTitles(category);
          let idx = boxes.indexOf( thisCategory );
          boxObjects[ idx ].items.push( thisLink );

        });
      });

      console.log( 'BoxTiles boxObjects:', boxObjects );

      return (
        <div className={ spfxStyles.boxTiles }>
          <div className={ spfxStyles.container }>
            {/* <div className={ spfxStyles.row }>
              <div className={ spfxStyles.column }> */}
                {/* <span className={ spfxStyles.title }>Welcome to SharePoint??</span>
                <p className={ spfxStyles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
                <p className={ spfxStyles.description }>{escape(this.props.description)}</p>
                <a href="https://aka.ms/spfx" className={ spfxStyles.button }>
                  <span className={ spfxStyles.label }>Learn more</span>
                </a> */}
                <div className= { boxStyles.boxTiles } style={ this.props.boxStyles.boxTiles }>

                  <div className= { boxStyles.flexBoxes } style={ this.props.boxStyles.flexBoxes }>
                    { boxObjects.map( box => {

                      let boxLinks = box.items.map( link => {
                        return <li style={ this.props.boxStyles.boxLinks }>
                          <a href={link.href} title={ link.title } target={ link.target }
                            >{ link.title }</a>
                        </li>;
                      });

                      // let sizeStyle = { height: box.imageHeight / 2, top: box.imageHeight / 3.4 } ;
                      // let sizeStyle: React.CSSProperties = {root: { width: '175px', height: '100px' } } ;
                      let tileBoxStyles: React.CSSProperties = this.props.boxStyles.tileBox ? this.props.boxStyles.tileBox : {};
                      tileBoxStyles.minWidth = this.props.boxStyles.minWidth;
                      tileBoxStyles.maxWidth = this.props.boxStyles.maxWidth;

                      //height: '125px', paddingBottom: '20px'
                      let imageDiv : React.CSSProperties = this.props.boxStyles.imageDiv ? 
                        this.props.boxStyles.imageDiv : {  };

                      if ( !imageDiv.height || imageDiv.height < 10 ) { imageDiv.height = 125 ; }

                      if ( this.props.boxStyles.imageHeight && this.props.boxStyles.imageHeight > 25 ) { 
                        imageDiv.height = this.props.boxStyles.imageHeight ; }

                      if ( !imageDiv.paddingBottom || imageDiv.paddingBottom < 10 ) { imageDiv.paddingBottom = '20px' ; }

                      let boxDiv = <div className ={ boxStyles.tileBox } style={ tileBoxStyles }>
                        { <h2>{ box.category }</h2> }
                        <div style={ imageDiv }>
                          { <Image 
                            maximizeFrame={ true }
                            src={ box.imageUrl } 
                            shouldFadeIn={true} 
                            imageFit={imageOptionsGroup.getImgFit( this.setImgFit )}
                            coverStyle={imageOptionsGroup.getImgCover( this.setImgCover )}      
                          />
                          }
                        </div>
                        { <ul className={ boxStyles.boxLinks } > { boxLinks }  </ul> }
                      </div>;

                      return boxDiv;

                    })}
                  </div>
                </div>
              {/* </div>
            </div> */}
          </div>
        </div>
      );
    }

  }
}
