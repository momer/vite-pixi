import { Application, extend, useApplication, useAssets, useTick } from '@pixi/react';
import { Bounds, Container, Graphics, Sprite } from 'pixi.js';
import { ForwardedRef, forwardRef, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';

import trunkSvgUrl from '/static/images/pixi/sakura/trunk.svg';
import canopySvgUrl from '/static/images/pixi/sakura/canopy.svg';
import leafClusterFullOpenUrl from '/static/images/pixi/sakura/leaf-clusters/full-open.png';
import { ApplicationState } from '@pixi/react/types/typedefs/ApplicationState';

extend({
    Container,
    Graphics,
    Sprite,
});

export type Tree = {
    trunk: MutableRefObject<Graphics | null>;
    canopy: MutableRefObject<Graphics | null>;
}

export interface LeafCollectionProps {
    tree: Tree;
}

export const LeafCollection = ({ tree }: LeafCollectionProps) => {

    const {
        assets: [
            leafClusterFullOpen,
        ],
        isSuccess,
    } = useAssets([
        {
            alias: 'leafClusterFullOpen',
            src: leafClusterFullOpenUrl,
        }
    ]);

};

export interface TreeContainerOptions {
    ref: ForwardedRef<HTMLDivElement>;
}

// Following from https://pixijs.com/8.x/examples/graphics/svg-load
export const TreeContainer = forwardRef<HTMLDivElement>((props, ref) => {
    const [measureRef, bounds] = useMeasure();
    const { app }: ApplicationState = useApplication();
    const [divResized, setDivResized] = useState(false);

    // Both should be the same for trunk and canopy
    const [trunkPivot, setTrunkPivot] = useState({ x: 0, y: 0 });
    const [canopyPivot, setCanopyPivot] = useState({ x: 0, y: 0 });
    const [treeScale, setTreeScale] = useState<number>(0.65);

    const [assetLoadSuccess, setAssetLoadSuccess] = useState<boolean>(true);
    const [isCanopyGraphicsLoaded, setIsCanopyGraphicsLoaded] = useState(false);
    const [isTrunkGraphicsLoaded, setIsTrunkGraphicsLoaded] = useState(false);

    const trunkRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);
    const canopyRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);

    const resizeTreeContainer = useCallback(() => {
        console.log(`${ assetLoadSuccess }, ${ trunkRef }, ${ canopyRef }, ${ app }, ${ app?.renderer }, ${ app?.ticker }, ${ trunkRef?.current }, ${ canopyRef?.current }`);
        if (assetLoadSuccess &&
            trunkRef &&
            canopyRef &&
            app?.renderer &&
            app?.ticker &&
            app?.screen &&
            trunkRef.current &&
            canopyRef.current
        ) {
            // setTreeScale(() => 0.65);

            // const trunkBounds = trunkRef.current.getBounds();
            // const canopyBounds = canopyRef.current.getBounds();
            // console.log(`setting tree position according to bounds: ${ trunkBounds }`);
            //setTrunkPivot(() => {
            //    return {
            //        x: (trunkBounds.x + trunkBounds.width) / 2,
            //        y: (trunkBounds.y + trunkBounds.height) / 2,
            //    };
            //});
            //setCanopyPivot(() => {
            //    return {
            //        x: (canopyBounds.x + canopyBounds.width) / 2,
            //        y: (canopyBounds.y + canopyBounds.height) / 2,
            //    };
            //});
            // const position = {
            //     x: (app.screen.width / 2) + (3 * app.screen.width / 7),
            //     y: (5 * app.screen.height / 8)
            // };

            const position = {
                x: (app.screen.width / 2) + ((app.screen.width) / 12),
                y: 0
            };
            canopyRef.current.position = position;
            canopyRef.current.scale = treeScale;
            canopyRef.current.visible = true;

            trunkRef.current.position = position;
            trunkRef.current.scale = treeScale;
            trunkRef.current.visible = true;
        }
    }, [assetLoadSuccess, isTrunkGraphicsLoaded, isCanopyGraphicsLoaded, app]);

    const {
        assets: [
            treeTrunk,
            treeCanopy,
        ],
        isSuccess,
    } = useAssets([
        {
            alias: 'treeTrunk',
            src: trunkSvgUrl,
            data: { parseAsGraphicsContext: true }
        },
        {
            alias: 'treeCanopy',
            src: canopySvgUrl,
            data: { parseAsGraphicsContext: true }
        }
    ], {
        onProgress: (progress: number) => {
            if (progress >= 1) {
                console.log('progress completed:', progress);
                setAssetLoadSuccess(true);
            }
        },
    });
    useEffect(() => {
        console.log('in use effect that should render 3 times if this is re-rendering...');
    });

    // initial load, start observingt he div parent for sizing
    useEffect(() => {
        console.log(`app? ${ app } ; renderer? ${ app.renderer }`);
        if (ref) {
            ref = ref as MutableRefObject<HTMLDivElement>;
            console.log(`found ref: ${ ref.current }`);
            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    console.log('Div resized:', width, height);
                    if (app && app.renderer) {
                        console.log(`resizin ${ isTrunkGraphicsLoaded }`);
                        // app.renderer.resize(width, height);
                        resizeTreeContainer();
                    }
                }
            });
            observer.observe(ref.current as Element, {});

        }
    }, [ref, app]);

    // resize renderer if view of component changes size
    useEffect(() => {
        if (app) {
            // app.renderer.resize(bounds.width, bounds.height);
        }
    }, [app, bounds]);

    const handleTreeTrunkGraphics = useCallback((trunk: Graphics) => {
        console.log(`in the callback, here's trunk: ${ trunk }`);
        if (trunk) {
            // https://www.pixiplayground.com/#/edit/RMMgRsw1qqxpfUbS6-BEw
            //
            //     console.log(graphics.getLocalBounds().containsPoint(new PIXI.Point(110, 110)));
            //     const transformedPoint = graphics.toLocal(new PIXI.Point(110, 110));
            //     console.log(graphics.containsPoint(transformedPoint));

            // set the ref for other components
            trunkRef.current = trunk;
            setIsTrunkGraphicsLoaded(true);
        }
    }, []);

    const handleTreeCanopyGraphics = useCallback((canopy: Graphics) => {
        if (canopy) {
            // https://www.pixiplayground.com/#/edit/RMMgRsw1qqxpfUbS6-BEw
            //
            //     console.log(graphics.getLocalBounds().containsPoint(new PIXI.Point(110, 110)));
            //     const transformedPoint = graphics.toLocal(new PIXI.Point(110, 110));
            //     console.log(graphics.containsPoint(transformedPoint));

            // set the ref for other components
            canopyRef.current = canopy;
            setIsCanopyGraphicsLoaded(true);
        }
    }, []);

    useEffect(() => {
        resizeTreeContainer();
    }, [assetLoadSuccess, isTrunkGraphicsLoaded, isCanopyGraphicsLoaded, app, treeTrunk, treeCanopy]);

    return (
        <container sortableChildren={ true }>
            { isSuccess && app?.renderer && app?.screen && (
                <>
                    <graphics
                        ref={ handleTreeTrunkGraphics }
                        context={ treeTrunk }
                        // pivot={ trunkPivot }
                    />
                    <graphics
                        ref={ handleTreeCanopyGraphics }
                        context={ treeCanopy }
                        // pivot={ canopyPivot }
                    />
                </>
            ) }
        </container>
    );
});

TreeContainer.displayName = 'HomeDemo';

export const HomeDemo = forwardRef<HTMLDivElement>((props, ref) => {
    useEffect(() => {
        console.log('calling ref callback');
    }, [ref]);

    return (
        <Application
            autoStart
            sharedTicker
            resizeTo={ ref }
            background={ 'white' }
            backgroundAlpha={ 0 }
            antialias={true}
        >
            <TreeContainer ref={ ref }/>
        </Application>
    );
});
HomeDemo.displayName = 'HomeDemo';
