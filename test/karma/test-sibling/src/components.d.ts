/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */

import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';

export namespace Components {
interface SiblingRoot {}
}

declare global {
  
  
interface HTMLSiblingRootElement extends Components.SiblingRoot, HTMLStencilElement {}
var HTMLSiblingRootElement: {
  prototype: HTMLSiblingRootElement;
  new (): HTMLSiblingRootElement;
};
  interface HTMLElementTagNameMap {
    'sibling-root': HTMLSiblingRootElement;
  }
}

declare namespace LocalJSX {
interface SiblingRoot {}

  interface IntrinsicElements {
    'sibling-root': SiblingRoot;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
    'sibling-root': LocalJSX.SiblingRoot & JSXBase.HTMLAttributes<HTMLSiblingRootElement>;
    }
  }
}
  