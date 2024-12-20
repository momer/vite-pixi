import React, { forwardRef, RefObject, useContext, useState } from 'react';

import { Application } from 'pixi.js';
import { TreeContainer } from '@/components/pixi/TreeContainer';
import { Color } from 'pixi.js';
import { TreeContext } from '@/components/pixi/TreeProvider';
import { ContextApplication } from '@/components/pixi/ContextBridge';
import App from '@/app/App';

export const HomeDemo = forwardRef<HTMLDivElement>((props, ref) => {
    const treeContext = useContext(TreeContext);
    const [isLoading, setIsLoading] = useState(true);
    return (
        <div>
            { treeContext ? (
                <ContextApplication
                    context={ treeContext }
                    hello={ true }
                    autoStart
                    sharedTicker
                    onInit={ (app: Application) => {
                        app.renderer.background.alpha = 1;
                        setIsLoading(false);
                    } }
                    background={ new Color('white') }
                    backgroundAlpha={ 0 }
                    visible={ false }
                    antialias={ true }
                >
                    { (!isLoading && <TreeContainer ref={ ref }/>) }
                </ContextApplication>
            ) : <div></div> }
        </div>
    );
});
HomeDemo.displayName = 'HomeDemo';
