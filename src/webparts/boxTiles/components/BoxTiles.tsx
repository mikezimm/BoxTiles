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

import { imageOptionsGroup, } from '@mikezimm/npmfunctions/dist/Services/PropPane/ReactImageOptions';

export default class BoxTiles extends React.Component<IBoxTilesProps, {}> {

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
  
  public render(): React.ReactElement<IBoxTilesProps> {
    console.log('Component Props: ', this.props );
    //Create all categories (boxes)
    let boxes = [];
    let boxObjects : IBoxObject[] = [];

    //create boxObjects
    this.props.items.map ( item => {
      item.category.map( category => {
        let thisCategory = this.cleanTitles(category);
        if ( boxes.indexOf( thisCategory ) < 0 ) { 
          boxes.push( thisCategory ) ;
          let setImgFit: any = item.setImgFit;
          let setImgCover: any = item.setImgCover;

          boxObjects.push( {
            onHoverZoom: item.onHoverZoom,
            imageUrl: this.cleanTitles(item.imageUrl),
            setSize: item.setSize,
            setRatio: item.setRatio,
            setImgFit: setImgFit,
            setImgCover: setImgCover,
            // target: item.target,
          
            // //Custom image properties
            imageWidth: item.imageWidth,
            imageMaxWidth: item.imageMaxWidth,
            imageHeight: item.imageHeight,
            textPadding: item.textPadding,
          
            //Mostly come from column values
          
            category:thisCategory,
            
            // options: string;
            color: item.color,
            imgSize: item.imgSize,
          
            items: [],
          });
        
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

              <div className= { boxStyles.boxTiles }>
                <div className= { boxStyles.flexBoxes }>
                  { boxObjects.map( box => {

                    let boxLinks = box.items.map( link => {
                      return <li>
                        <a href={link.href} title={ link.title } target={ link.target }
                          >{ link.title }</a>
                      </li>;
                    });

                    // let sizeStyle = { height: box.imageHeight / 2, top: box.imageHeight / 3.4 } ;
                    // let sizeStyle: React.CSSProperties = {root: { width: '175px', height: '100px' } } ;
                    let boxDiv = <div className ={ boxStyles.tileBox }>
                      { <h2>{ box.category }</h2> }
                      <div style={{ height: '125px', paddingBottom: '20px' }}>
                        { <Image 
                          maximizeFrame={ true }
                          // className={[
                          //   styles.pTileItemImageCustom, styles.themeBackground,
                          //   ( this.state.hovering === true  ? this.iHoverZoomStyle : styles.imgHoverZoom )
                          // ].join(" ")} 
                          src={ box.imageUrl } 
                          shouldFadeIn={true} 
                          imageFit={imageOptionsGroup.getImgFit(box.setImgFit)}
                          coverStyle={imageOptionsGroup.getImgCover(box.setImgCover)}      
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
