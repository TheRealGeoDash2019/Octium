import SvgIcon from '@mui/material/SvgIcon';
import { jsx } from "react/jsx-runtime";
import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from "react";

function createSvgIcon(path, displayName) {
    function Component(props, ref) {
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

const ServerLogoIcon = createSvgIcon(jsx("path", {
    d: "M 0 13.023 L 4.429 18.595 L 20.714 18.261 L 24 12.309 L 20.998 3.971 L 13.88 8.904 L 7.919 7.125 L 0 13.023 Z"
}), "ServerLogo")

export default ServerLogoIcon;