
import { Image, ImageFit, ImageCoverStyle } from 'office-ui-fabric-react/lib/Image';


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

import { IImageFit, IImageCover, IImageTarget, IImageZoom } from '@mikezimm/npmfunctions/dist/Services/PropPane/IReactImage';

import { IPivotTileItemProps } from '../IPivotTileItemProps';

/**
 * react style props added into the styles for these elements
 */
export interface IBoxStyles {
  boxTiles: any;
  flexBoxes: any;
  tileBox: any;
  boxLinks: any;
  imageDiv: any;
  imageHeight: number;  //imageHeight:  this applies to the <Image react component, not the parent div that imageDiv applies to

  minWidth: number;  //min width of a tile box
  maxWidth: number;  //max width of a tile box

  setImgFit?: IImageFit;
  setImgCover?: IImageCover;
  onHoverZoom?: string;
}

export interface IBoxTilesProps {
  description: string;
  items: IPivotTileItemProps[];
  boxStyles: IBoxStyles;
  errMessage: any;

}

export interface IBoxObject {
  imageUrl: string;
  category:string;
  color: string;
  items: IBoxLink[];
  href?: string;

  propsLocked: boolean;  //true if it was created/updated with an item that was designated as the BoxTilesSettings for category

}

export interface IBoxLink {
  
  //Main webpart properties
  description: string;

  target: IImageTarget;

  title: string;
  href: string;
  
  Id: string;
  
  // options: string;
  color: string;

  FileRef?: string;

}

