import SvgIcon from '@mui/material/SvgIcon';
import _extends from '@babel/runtime/helpers/esm/extends';
import * as React from "react";
// @ts-ignore
import { jsx } from "react/jsx-runtime";

function createSvgIcon(path: any, displayName: any) {
    // @ts-ignore
    function Component(props: any, ref: any) {
      return jsx(SvgIcon, _extends({
        "data-testid": `${displayName}Icon`,
        ref: ref
      }, props, {
        children: path
      }));
    }
    if (process.env.NODE_ENV !== 'production') {
      Component.displayName = `${displayName}Icon`;
    }
    Component.muiName = SvgIcon.muiName;
    return React.memo(React.forwardRef(Component));
}

// Cobalt:
// M 0 13.023 L 4.429 18.595 L 20.714 18.261 L 24 12.309 L 20.998 3.971 L 13.88 8.904 L 7.919 7.125 L 0 13.023 Z

// Octium:
// M17.0291 3.67612C18.5044 4.90312 19.6518 6.21991 20.242 7.62647C20.7993 9.06296 20.7665 10.6192 21.6189 12.6243C22.4713 14.6294 24.2088 17.1133 23.9793 19.0286C23.717 20.9439 21.4877 22.3206 19.1601 23.0987C16.7996 23.8768 14.3736 24.0264 11.9804 23.9965C9.55441 23.9366 7.16119 23.7271 5.0958 22.8293C3.0632 21.9016 1.32566 20.2855 0.538845 18.4002C-0.280752 16.5148 -0.116833 14.36 0.702764 12.6243C1.55514 10.8885 3.09599 9.60165 3.71888 7.47684C4.37456 5.35202 4.11229 2.35933 5.35807 1.01262C6.57108 -0.364014 9.25935 -0.154525 11.4887 0.56372C13.7507 1.25204 15.5539 2.44912 17.0291 3.67612Z

const ServerLogoIcon = createSvgIcon(jsx("path", {
    d: "M17.0291 3.67612C18.5044 4.90312 19.6518 6.21991 20.242 7.62647C20.7993 9.06296 20.7665 10.6192 21.6189 12.6243C22.4713 14.6294 24.2088 17.1133 23.9793 19.0286C23.717 20.9439 21.4877 22.3206 19.1601 23.0987C16.7996 23.8768 14.3736 24.0264 11.9804 23.9965C9.55441 23.9366 7.16119 23.7271 5.0958 22.8293C3.0632 21.9016 1.32566 20.2855 0.538845 18.4002C-0.280752 16.5148 -0.116833 14.36 0.702764 12.6243C1.55514 10.8885 3.09599 9.60165 3.71888 7.47684C4.37456 5.35202 4.11229 2.35933 5.35807 1.01262C6.57108 -0.364014 9.25935 -0.154525 11.4887 0.56372C13.7507 1.25204 15.5539 2.44912 17.0291 3.67612Z"
}), "ServerLogo")

export default ServerLogoIcon;