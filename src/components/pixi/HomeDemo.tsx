import React, { forwardRef, RefObject, useContext } from 'react';

import { TreeContainer } from '@/components/pixi/TreeContainer';
import { Color } from 'pixi.js';
import { TreeContext } from '@/components/pixi/TreeProvider';
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
