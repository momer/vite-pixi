import { Application } from '@momer/pixi-react';
import React, { forwardRef, RefObject } from 'react';

import { TreeContainer } from '@/components/pixi/TreeContainer';
import { TreeEnvironment } from '@/components/pixi/TreeEnvironment';
import { Color } from 'pixi.js';

export const HomeDemo = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <Application
            hello={true}
            autoStart
            sharedTicker
            resizeTo={ ref as RefObject<HTMLElement> }
            background={ new Color('white') }
            backgroundAlpha={ 1 }
            antialias={ true }
        >
            <TreeContainer ref={ ref }/>

        </Application>
    );
});
HomeDemo.displayName = 'HomeDemo';
