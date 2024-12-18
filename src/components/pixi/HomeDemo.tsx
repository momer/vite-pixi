import { Application } from '@momer/pixi-react';
import React, { forwardRef, RefObject, useContext } from 'react';

import { TreeContainer } from '@/components/pixi/TreeContainer';
import { TreeEnvironment } from '@/components/pixi/TreeEnvironment';
import { Color } from 'pixi.js';
import { TreeContext, TreeProvider } from '@/components/pixi/TreeProvider';
import { ContextApplication } from '@/components/pixi/ContextBridge';

export const HomeDemo = forwardRef<HTMLDivElement>((props, ref) => {
    const treeContext = useContext(TreeContext);
    return (
        <div>
            { treeContext ? (
                <ContextApplication
                    context={treeContext}
                    hello={ true }
                    autoStart
                    sharedTicker
                    resizeTo={ ref as RefObject<HTMLElement> }
                    background={ new Color('white') }
                    backgroundAlpha={ 1 }
                    antialias={ true }
                >
                    <TreeContainer ref={ ref }/>
                </ContextApplication>
            ) : <div></div> }
        </div>
    );
});
HomeDemo.displayName = 'HomeDemo';
