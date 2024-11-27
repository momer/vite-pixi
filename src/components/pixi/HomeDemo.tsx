import {Application} from '@pixi/react';
import {forwardRef, RefObject} from 'react';

import {TreeContainer} from '@/components/pixi/TreeContainer';

export const HomeDemo = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <Application
            autoStart
            sharedTicker
            resizeTo={ref as RefObject<HTMLElement>}
            background={'white'}
            backgroundAlpha={0}
            antialias={true}
        >
            <TreeContainer ref={ref}/>
        </Application>
    );
});
HomeDemo.displayName = 'HomeDemo';
