import React from "react";
import { CopyrightProps } from "./Copyright";
interface WidgetProps {
    scriptHTML: unknown;
    scriptSRC: string;
    containerId?: string;
    type?: "Widget" | "MediumWidget";
    copyrightProps: CopyrightProps;
}
declare const Widget: React.FC<WidgetProps>;
export default Widget;
