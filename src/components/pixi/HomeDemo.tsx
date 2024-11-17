import { Application, extend, useApplication, useAssets, useTick } from '@pixi/react';
import { Bounds, Circle, Container, Graphics, Point, Rectangle, Sprite } from 'pixi.js';
import { ForwardedRef, forwardRef, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';

import trunkSvgUrl from '/static/images/pixi/sakura/trunk.svg';
import canopySvgUrl from '/static/images/pixi/sakura/canopy.svg';
import leafClusterFullOpenUrl from '/static/images/pixi/sakura/leaf-clusters/full-open.png';
import { ApplicationState } from '@pixi/react/types/typedefs/ApplicationState';

// todo, this can be exported and isolated
// ref if needed:
// https://tailwindcss.com/docs/screens
// https://stackoverflow.com/questions/59982018/how-do-i-get-tailwinds-active-breakpoint-in-javascript
const cssScreens = {
    'sm': 640,
    // => @media (min-width: 640px) { ... }

    'md': 768,
    // => @media (min-width: 768px) { ... }

    'lg': 1024,
    // => @media (min-width: 1024px) { ... }

    'xl': 1280,
    // => @media (min-width: 1280px) { ... }

    '2xl': 1536,
    // => @media (min-width: 1536px) { ... }

    '3xl': 1792,
};

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

    const [assetLoadSuccess, setAssetLoadSuccess] = useState<boolean>(true);
    const [isCanopyGraphicsLoaded, setIsCanopyGraphicsLoaded] = useState(false);
    const [isTrunkGraphicsLoaded, setIsTrunkGraphicsLoaded] = useState(false);

    const containerRef: MutableRefObject<Container | null> = useRef<Container>(null);
    const trunkRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);
    const canopyRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);

    interface TreePosOptions {
        position: {
            x: number;
            y: number;
        };
        scale: number;
    }

    const calculateTreePos = (screen: Rectangle, treeBounds: Bounds): TreePosOptions => {
        const opt = {
            position: { x: 0, y: 0 },
            scale: 0.65, // defaults
        };
        const sw = screen.width;
        const sh = screen.height;
        console.log(`found screen width: ${ sw } and screen height: ${ sh }`);
        const baseW = sw / 2;

        if (sw >= cssScreens['2xl']) {
            opt.position.x = (baseW);
            opt.position.y = (sh / 2);
        } else if (sw >= cssScreens['xl']) {
            opt.position.x = (baseW / 2);
            opt.scale = 0.6;
        } else if (sw >= cssScreens['lg']) {
            opt.position.x = (baseW / 2);
            opt.scale = 0.6;
        } else if (sw >= cssScreens['md']) {
            opt.position.x = (baseW / 2);
            opt.scale = 0.6;
        }

        return opt;
    };

    const resizeTreeContainer = useCallback(() => {
        if (assetLoadSuccess &&
            trunkRef &&
            canopyRef &&
            app?.renderer &&
            app?.ticker &&
            app?.screen &&
            trunkRef.current &&
            canopyRef.current &&
            containerRef.current
        ) {

            console.log(`app screen width: ${ app.screen.width }, height: ${app.screen.height}`);


            let containerBounds = containerRef.current.getBounds();
            const opt = calculateTreePos(app.screen, containerBounds);
            // containerRef.current.scale = opt.scale;

            containerBounds = containerRef.current.getBounds();
            console.log(`current x: ${containerRef.current.x}, y: ${containerRef.current.y}`);
            console.log(`(getbounds) current x: ${containerBounds.x}, y: ${containerBounds.y}`);
            containerRef.current.x = app.screen.width / 2;
            containerRef.current.y = app.screen.height / 2;


            containerBounds = containerRef.current.getBounds();
            // containerRef.current.width = Math.max(canopyRef.current.width, trunkRef.current.width);
            // make the pivot at the center of the container
            console.log(`pivoted bounds calc: containerBounds.x = ${containerBounds.x} ; containerBounds.width / 2 = ${containerBounds.width / 2}`);
            // // then, adjust its position accordingly (offset needs to be adjusted + width/height div 2)
            // containerRef.current.x = 43.25 + (containerBounds.width / 2);// initial x offset; this is the "position of the pivot in the parent's local space"
            // so should be initial offset plus the container width /2 to get the same distance

            const line = new Graphics();
            line.zIndex = 51;
            app.stage.addChild(line);

            line.moveTo(containerBounds.x, containerBounds.y);
            line.lineTo(containerBounds.x + 100, containerBounds.y + 100);
            line.stroke({ width: 4, color: 0x11f0ff });

            // containerRef.current.position = new Point(100, 100);

            containerBounds = containerRef.current.getBounds();
            const testingCircle = new Graphics();
            testingCircle.circle(containerBounds.x + (containerBounds.width /2), containerBounds.height + (containerBounds.height /2), 30);
            console.log(`testingcircle: ${containerBounds.x + (containerBounds.width /2)} ${containerBounds.height + (containerBounds.height /2)}`);
            testingCircle.fill(0x0000ff);
            testingCircle.zIndex = 50;
            app.stage.addChild(testingCircle);

            line.moveTo(containerBounds.x, containerBounds.y);
            line.lineTo(containerBounds.width, containerBounds.y);
            line.stroke({ width: 4, color: 0x11f0ff });

            console.log(`canopyRef: ${canopyRef.current.x} | width: ${canopyRef.current.width}`);
            line.moveTo(containerBounds.x, containerBounds.y + 5);
            line.lineTo(containerBounds.x + containerBounds.width, containerBounds.y+5);
            line.stroke({ width: 2, color: 0xaaaaaa });

            console.log(`trunkref: ${trunkRef.current.x} | width: ${trunkRef.current.width}`);
            line.moveTo(containerBounds.x, containerBounds.y + 10);
            line.lineTo(containerBounds.maxX, containerBounds.y + 10);
            line.stroke({ width: 2, color: 0x000000 });


            line.moveTo(screen.width / 2, (containerBounds.height/2) + containerBounds.y);
            line.lineTo(containerBounds.x + screen.width, (containerBounds.height/2) + containerBounds.y);
            line.stroke({ width: 2, color: 0xff0fff });

            line.moveTo(screen.width - (2 * containerBounds.width / 3), (containerBounds.height/2) + containerBounds.y - 5);
            line.lineTo(containerBounds.x + screen.width, (containerBounds.height/2) + containerBounds.y -5);
            line.stroke({ width: 2, color: 0x001FFA });

            const pivotCircle = new Graphics();
            pivotCircle.circle(containerRef.current.pivot.x, containerRef.current.pivot.y, 30);
            pivotCircle.fill(0xff0000);
            app.stage.addChild(pivotCircle);

            const circle = new Graphics();
            circle.circle(app.screen.width - (trunkRef.current.getBounds().width/2), opt.position.y, 30);
            circle.fill(0x00ff00);
            app.stage.addChild(circle);

            const otherCircle = new Graphics();
            otherCircle.circle(865, 350, 15);
            otherCircle.fill(0x00ff00);
            app.stage.addChild(otherCircle);

            // change pivot AFTER any positioning
            // containerRef.current.pivot = {
            //     x: (containerRef.current.width / 2),
            //     y: (containerRef.current.height / 2)
            // };
            // canopyRef.current.position = opt.position;
            canopyRef.current.visible = true;

            // trunkRef.current.position = opt.position;
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
        console.log(`in the callback, here's trunk: ${ trunk.width }`);
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
            console.log(`in the callback, here's canopy: ${ canopy.width }`);
            canopyRef.current = canopy;
            setIsCanopyGraphicsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (treeTrunk && treeCanopy) {
            console.log(`treeTrunk width: ${treeTrunk.width} | canopy width: ${treeCanopy.width}`);
        }
        console.log();
        resizeTreeContainer();
    }, [assetLoadSuccess, isTrunkGraphicsLoaded, isCanopyGraphicsLoaded, app, treeTrunk, treeCanopy]);

    return (
        isSuccess && app?.renderer && app?.screen && (
            <container ref={ containerRef } sortableChildren={ true }>
                <>
                    <graphics
                        ref={ handleTreeTrunkGraphics }
                        context={ treeTrunk }
                    />
                    <graphics
                        ref={ handleTreeCanopyGraphics }
                        context={ treeCanopy }
                    />
                </>
            </container>
        )
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
            antialias={ true }
        >
            <TreeContainer ref={ ref }/>
        </Application>
    );
});
HomeDemo.displayName = 'HomeDemo';
