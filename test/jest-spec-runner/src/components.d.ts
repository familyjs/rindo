/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Rindo compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLRindoElement, JSXBase } from "@rindo/core/internal";
export namespace Components {
    interface MyMixed {
    }
    interface MySimple {
    }
}
declare global {
    interface HTMLMyMixedElement extends Components.MyMixed, HTMLRindoElement {
    }
    var HTMLMyMixedElement: {
        prototype: HTMLMyMixedElement;
        new (): HTMLMyMixedElement;
    };
    interface HTMLMySimpleElement extends Components.MySimple, HTMLRindoElement {
    }
    var HTMLMySimpleElement: {
        prototype: HTMLMySimpleElement;
        new (): HTMLMySimpleElement;
    };
    interface HTMLElementTagNameMap {
        "my-mixed": HTMLMyMixedElement;
        "my-simple": HTMLMySimpleElement;
    }
}
declare namespace LocalJSX {
    interface MyMixed {
    }
    interface MySimple {
    }
    interface IntrinsicElements {
        "my-mixed": MyMixed;
        "my-simple": MySimple;
    }
}
export { LocalJSX as JSX };
declare module "@rindo/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "my-mixed": LocalJSX.MyMixed & JSXBase.HTMLAttributes<HTMLMyMixedElement>;
            "my-simple": LocalJSX.MySimple & JSXBase.HTMLAttributes<HTMLMySimpleElement>;
        }
    }
}
