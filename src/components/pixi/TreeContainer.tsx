import { extend, useApplication, useAssets } from '@pixi/react';
import {
    Container, ContainerChild,
    ConvertedStrokeStyle,
    FillInstruction,
    Graphics,
    Point,
    PointData,
    Rectangle,
    Sprite,
    Text,
} from 'pixi.js';
import React, {
    ForwardedRef,
    forwardRef,
    MutableRefObject,
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';

import trunkSvgUrl from '/static/images/pixi/sakura/trunk.svg';
import canopySvgUrl from '/static/images/pixi/sakura/canopy.svg';
import blossomableSvgUrl from '/static/images/pixi/sakura/blossomable.svg';
import { ApplicationState } from '@pixi/react/types/typedefs/ApplicationState';
import { AnimationTitle as LeafClusterAnimationTitle, LeafCluster } from '@/components/pixi/LeafCluster';
import { randomFloatFromInterval, randomIntFromInterval } from '@/utils/math/rand';
import { quickRound } from '@/utils/math/floats';
import { cssScreens } from '@/lib/tailwind/screenSizes';
import { TreeEnvironment } from '@/components/pixi/TreeEnvironment';
import { Dimension } from '@/components/pixi/Dimension';
import { Emitter } from '@momer/pixi-particle-emitter';

extend({
    Container,
    Graphics,
    Sprite,
    Text,
});


const TREE_DEFAULT_SCALE = 0.75;

export type Tree = {
    trunkRef: MutableRefObject<Graphics | null>;
    canopyRef: MutableRefObject<Graphics | null>;
    blossomableAreaRef: MutableRefObject<Graphics | null>;
    treeWorldContainerRef: MutableRefObject<Container | null>;
    treeObjectContainerRef: MutableRefObject<Container | null>;
}

export interface LeafCollectionProps {
    treeRef: RefObject<Tree>;
    isCanopyGraphicsLoading?: boolean;
    isTrunkGraphicsLoading?: boolean;
    isBlossomableAreaGraphicsLoading?: boolean;
}

export const LeafCollection = (props: LeafCollectionProps) => {
    const collectionContainerRef: MutableRefObject<Container | null> = useRef<Container>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [error, setError] = useState<unknown>(null);
    // TODO: dynamically set leaf clusters
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [numLeafClusters, setNumLeafClusters] = useState<number>(500);
    const leafClusters = useRef<Array<LeafCluster>>([]);
    const { trunkRef, canopyRef, blossomableAreaRef } = props.treeRef?.current as unknown as Tree;

    // initialize the LeafCluster assets
    useEffect(() => {
        const initAssets = async () => {
            setIsInitializing(true);
            try {
                await LeafCluster.init();
            } catch (err: unknown) {
                console.log(`caught an error: ${ err }`);
                setError(() => err);
            } finally {
                setIsInitializing(false);
            }
        };

        if (error) {
            console.log(`fatal error while loading assets: ${ error }`);
        }

        initAssets();
    }, []);

    useEffect(() => {
        (async () => {
            if (isInitializing || !collectionContainerRef?.current) {
                return;
            }
            if (!canopyRef?.current || !trunkRef?.current || !blossomableAreaRef?.current) {
                return;
            }
            // The goal:
            // 1. iterate through each instruction, and
            // 2. iterate each instruction's shape paths,
            // 3. For each shape path, calculate its area, and calculate that area's percentage of availableBlossomArea
            // 4. Multiply that percentage against numLeafClusters to discover how many points this section should have
            // 5. generate that many random points within its bounds, and move on to the next path

            // assume bounds will hold during this loop
            const blossomableArea = blossomableAreaRef.current;
            const containerBounds = blossomableArea.getLocalBounds();
            const availableBlossomArea: number = containerBounds.width * containerBounds.height;
            let leafClusterPoint: PointData | null = null;

            const instructions = blossomableArea.context.instructions;
            const tmpPoint = new Point();

            // ref: GraphicsContext#.containsPoint
            for (let i = 0; i < instructions.length; i++) {
                const instruction = instructions[i];

                const data = instruction.data as FillInstruction['data'];
                const path = data.path;

                if (!instruction.action || !path) continue;
                if (instruction.action !== 'fill') continue;

                const style = data.style;
                const shapes = path.shapePath.shapePrimitives;

                // TODO: Starting point is to create 1 point per shape. Next: calculate area
                for (let j = 0; j < shapes.length; j++) {
                    const shape = shapes[j].shape;

                    if (!style || !shape) continue;

                    const transform = shapes[j].transform;

                    let pointIsContained = false;
                    // will need to use a while loop to make sure the shape contains the point,
                    // holes mean that it could be missed.

                    leafClusterPoint = null;
                    const shapeRect: Rectangle = shape.getBounds();
                    const shapeArea: number = shapeRect.width * shapeRect.height;
                    const pctTotalArea: number = quickRound(shapeArea / availableBlossomArea, 2);
                    // scale num clusters according to density estimate
                    let targetNumLeafClusters: number = quickRound(pctTotalArea * numLeafClusters, 0);

                    if (targetNumLeafClusters < 5) {
                        targetNumLeafClusters = randomIntFromInterval(7, 20);
                    }

                    for (let k = 0; k < targetNumLeafClusters; k++) {
                        pointIsContained = false;
                        while (!pointIsContained) {
                            const localLeafClusterPoint = new Point(
                                quickRound(randomFloatFromInterval(shapeRect.x, shapeRect.x + shapeRect.width), 2),
                                quickRound(randomFloatFromInterval(shapeRect.y, shapeRect.y + shapeRect.height), 2)
                            );

                            if (instruction.action === 'fill') {
                                pointIsContained = shape.contains(localLeafClusterPoint.x, localLeafClusterPoint.y);
                            } else {
                                pointIsContained = shape.strokeContains(localLeafClusterPoint.x, localLeafClusterPoint.y, (style as ConvertedStrokeStyle).width);
                            }

                            const holes = data.hole;

                            if (holes) {
                                const holeShapes = holes.shapePath?.shapePrimitives;

                                if (holeShapes) {
                                    for (let l = 0; l < holeShapes.length; l++) {
                                        if (holeShapes[l].shape.contains(localLeafClusterPoint.x, localLeafClusterPoint.y)) {
                                            pointIsContained = false;
                                        }
                                    }
                                }
                            }

                            leafClusterPoint = transform ? transform.apply(localLeafClusterPoint, tmpPoint) : localLeafClusterPoint;
                        }

                        if (!leafClusterPoint) {
                            throw new Error('failed to find a cluster point!');
                        }

                        const leafCluster = new LeafCluster(
                            LeafClusterAnimationTitle.FULL_OPEN,
                            leafClusterPoint,
                            0.5,
                            1,
                            collectionContainerRef.current,
                            true,
                        );

                        // I'm not a huge fan of digging into it like this, but there we are
                        // I also don't want to extend sprite.
                        leafCluster.sprite.scale.set(1 - (randomFloatFromInterval(75, 80) / 100));
                        leafClusters.current.push(leafCluster);

                        if (leafClusters.current.length % 50 === 0) {
                            await new Promise((resolve) => {
                                setTimeout(() => {
                                }, 0);
                                requestAnimationFrame(resolve);
                            });
                        }
                    }
                }
            }
        })();

    }, [isInitializing]);

    if (isInitializing) {
        return <></>;
    }

    return (
        // eslint-disable-next-line react/no-unknown-property
        <container isRenderGroup={ true } ref={ collectionContainerRef } sortableChildren={ true }>
        </container>
    );
};
LeafCollection.displayName = 'LeafCollection';

export interface TreeContainerOptions {
    ref: ForwardedRef<HTMLDivElement>;
}

// Following from https://pixijs.com/8.x/examples/graphics/svg-load
export const TreeContainer = forwardRef<HTMLDivElement>((props, ref) => {
    // alternate way of tracking measurement in pixi
    // const [measureRef, bounds] = useMeasure();
    const { app }: ApplicationState = useApplication();

    // Both should be the same for trunk and canopy

    const [assetLoadSuccess, setAssetLoadSuccess] = useState<boolean>(false);
    const [isCanopyGraphicsLoading, setIsCanopyGraphicsLoading] = useState(true);
    const [isTrunkGraphicsLoading, setIsTrunkGraphicsLoading] = useState(true);
    const [isBlossomableAreaGraphicsLoading, setIsBlossomableAreaGraphicsLoading] = useState(true);
    const [drawableTreeDimensions, setDrawableTreeDimensions] = useState<Dimension | null>(null);

    const treeWorldContainerRef: MutableRefObject<Container | null> = useRef<Container>(null);
    const treeObjectContainerRef: MutableRefObject<Container | null> = useRef<Container>(null);
    const trunkRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);
    const canopyRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);
    const blossomableAreaRef: MutableRefObject<Graphics | null> = useRef<Graphics>(null);

    const [emitter, setEmitter] = useState<Emitter | null>(null);

    const treeRefObject: RefObject<Tree> = useRef<Tree>({
        trunkRef,
        canopyRef,
        blossomableAreaRef,
        treeObjectContainerRef,
        treeWorldContainerRef,
    });

    const calculateTreeScale = (screen: Rectangle): PointData | number => {
        let scale: number = 1;

        const sw = screen.width;

        if (sw >= cssScreens['2xl']) {
            scale = TREE_DEFAULT_SCALE;
        } else if (sw >= cssScreens['xl']) {
            scale = TREE_DEFAULT_SCALE;
        } else if (sw >= cssScreens['lg']) {
            scale = 0.7;
        } else if (sw >= cssScreens['md']) {
            scale = 0.5;
        } else if (sw >= cssScreens['sm']) {
            scale = 0.45;
        } else {
            scale = 0.45;
        }

        return scale;
    };

    const calculateTreePos = (screen: Rectangle, container: Container<ContainerChild> | null): PointData => {
        const screenW = screen.width;
        const screenH = screen.height;

        // default position is center of the screen
        const pos = new Point((screenW / 2), (screenH / 2));

        if (!container) {
            return pos;
        }

        const containerBounds = container.getLocalBounds();

        // Handle container offset - in order to get the container to be a perfect fit around
        // the tree. This effectively centers the tree, given its offset within the container
        // Should use container.getLocalBounds.x (or minX) for this instead.
        pos.x -= containerBounds.minX * container.scale.x;
        pos.y -= containerBounds.minY * container.scale.y;

        // offset x for 2xl screens
        if (screenW >= cssScreens['2xl']) {
            pos.x += (4 * containerBounds.width) / 8;
        } else if (screenW >= cssScreens['xl']) {
            pos.x += (4 * containerBounds.width) / 10;
        } else if (screenW >= cssScreens['lg']) {
            pos.x += (3 * containerBounds.width) / 8;
        } else if (screenW >= cssScreens['md']) {
            pos.y -= containerBounds.height / 12;
        } else if (screenW >= cssScreens['sm']) {
            pos.y -= containerBounds.height / 8;
        } else {
            pos.y -= containerBounds.height / 7;
        }

        return pos;
    };

    const calculateCenterPivot = (container: Container<ContainerChild> | null): PointData => {
        if (!container) {
            return new Point(0, 0);
        }

        return {
            x: (container.getLocalBounds().maxX - container.getLocalBounds().minX) / 2,
            y: (container.getLocalBounds().maxY - container.getLocalBounds().minY) / 2,
        };
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
            blossomableAreaRef.current &&
            treeWorldContainerRef.current &&
            treeObjectContainerRef.current
        ) {
            treeWorldContainerRef.current.scale = calculateTreeScale(app.screen);
            treeWorldContainerRef.current.position = calculateTreePos(app.screen, treeWorldContainerRef.current);
            treeWorldContainerRef.current.pivot = calculateCenterPivot(treeWorldContainerRef.current);

            // set the shared state for child components to set their width/height if desired (no scaling)
            setDrawableTreeDimensions({
                x: treeWorldContainerRef.current.getLocalBounds().x,
                y: treeWorldContainerRef.current.getLocalBounds().y,
                width: treeWorldContainerRef.current.getLocalBounds().maxX - treeWorldContainerRef.current.getLocalBounds().minX,
                height: treeWorldContainerRef.current.getLocalBounds().maxY - treeWorldContainerRef.current.getLocalBounds().minY,
            });

            canopyRef.current.visible = true;
            trunkRef.current.visible = true;
            blossomableAreaRef.current.visible = true;
        }
    }, [assetLoadSuccess, app, emitter]);

    const {
        assets: [
            treeTrunk,
            treeCanopy,
            blossomableArea,
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
        },
        {
            alias: 'blossomableArea',
            src: blossomableSvgUrl,
            data: { parseAsGraphicsContext: true }
        }
    ], {
        onProgress: (progress: number) => {
            console.log('progress:', progress);
            if (progress >= 1) {
                console.log('progress complete:', progress);
                setAssetLoadSuccess(true);
            }
        },
    });

    const resizeObserver = useRef<ResizeObserver | null>(null);

    // initial load, start observing the div parent for sizing
    useEffect(() => {
        console.log('resize observable effect called');
        if (ref) {
            console.log('ref:', ref);
            ref = ref as MutableRefObject<HTMLDivElement>;
            const observer = new ResizeObserver((entries) => {
                console.log('resize observer called');
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    if (app && app.renderer) {
                        app.renderer.resize(width, height);
                        resizeTreeContainer();
                    }
                }
            });
            observer.observe(ref.current as Element, {});
            resizeObserver.current = observer;
        }
    }, [ref, app, resizeTreeContainer]);

    const handleTreeObjectContainer = useCallback((container: Container) => {
        if (container) {
            treeObjectContainerRef.current = container;
        }
    }, []);

    const handleTreeTrunkGraphics = useCallback((trunk: Graphics) => {
        if (trunk) {
            trunkRef.current = trunk;
            setIsTrunkGraphicsLoading(false);
        }
    }, []);

    const handleTreeCanopyGraphics = useCallback((canopy: Graphics) => {
        if (canopy) {
            canopyRef.current = canopy;
            setIsCanopyGraphicsLoading(false);
        }
    }, []);

    const handleBlossomableAreaGraphics = useCallback((blossomableArea: Graphics) => {
        if (blossomableArea) {
            blossomableAreaRef.current = blossomableArea;
            blossomableAreaRef.current.stroke({
                color: 0xEEADC1,
                width: 4,
                alpha: 0,
            });
            blossomableAreaRef.current.fill({
                color: 0xFFDAE6,
                alpha: 1,
            });
            setIsBlossomableAreaGraphicsLoading(false);
        }
    }, []);

    useEffect(() => {
        console.log(`asset load success is now: ${ assetLoadSuccess }`);
    }, [assetLoadSuccess]);

    useEffect(() => {
        resizeTreeContainer();
    }, [assetLoadSuccess, isTrunkGraphicsLoading, isCanopyGraphicsLoading, app, treeTrunk, treeCanopy]);

    useEffect(() => {
        if (app) {
            // @ts-ignore
            globalThis.__PIXI_APP__ = app;
        }
    }, [app]);

    //
    return (
        isSuccess && app?.renderer && app?.screen && (
            // eslint-disable-next-line react/no-unknown-property
            <container sortableChildren={ true } ref={ treeWorldContainerRef }>
                {/* tree container*/ }
                <container isRenderGroup={ true } ref={ handleTreeObjectContainer }>
                    {/* @ts-expect-error graphics requires draw */}
                    <graphics
                        ref={ handleTreeTrunkGraphics }
                        context={ treeTrunk }
                    />
                    {/* @ts-expect-error graphics requires draw */}
                    <graphics
                        ref={ handleTreeCanopyGraphics }
                        context={ treeCanopy }
                    />
                    <graphics
                        ref={ handleBlossomableAreaGraphics }
                        context={ blossomableArea }
                    />

                    <LeafCollection
                        treeRef={
                            treeRefObject
                        }
                    />
                </container>

                <TreeEnvironment
                    treeRef={ treeRefObject }
                    drawableTreeDimensions={ drawableTreeDimensions! }
                    emitter={ emitter }
                    setEmitter={ setEmitter }
                    isTrunkGraphicsLoading={isTrunkGraphicsLoading}
                    isCanopyGraphicsLoading={isCanopyGraphicsLoading}
                    isBlossomableAreaGraphicsLoading={isBlossomableAreaGraphicsLoading}
                ></TreeEnvironment>
            </container>
        )
    );
});
TreeContainer.displayName = 'TreeContainer';
