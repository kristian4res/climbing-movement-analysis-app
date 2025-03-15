import * as React from 'react';
import { Tooltip } from 'react-native-paper';

const withTooltip = (WrappedComponent: React.ComponentType<any>, tooltipTitle: string) => {
    return (props: any) => (
        <Tooltip title={tooltipTitle}>
            <WrappedComponent {...props} />
        </Tooltip>
    );
};

export default withTooltip;