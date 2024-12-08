import { Application } from '@momer/pixi-react';
import React, { forwardRef, RefObject } from 'react';

import { TreeContainer } from '@/components/pixi/TreeContainer';
import { TreeEnvironment } from '@/components/pixi/TreeEnvironment';

export const HomeDemo = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <Application
            autoStart
            sharedTicker
            resizeTo={ ref as RefObject<HTMLElement> }
            background={ 'white' }
            backgroundAlpha={ 0 }
            antialias={ true }
        >
            <TreeContainer ref={ ref }/>

        </Application>
    );
});
HomeDemo.displayName = 'HomeDemo';
