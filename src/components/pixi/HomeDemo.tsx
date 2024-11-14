import { Application, extend, useApplication, useAssets, useTick } from '@pixi/react';
import { Assets, Container, Graphics, Sprite } from 'pixi.js';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { ObjectPoolFactory } from '@pixi-essentials/object-pool';

import leafClusterOpenFullUrl from '/static/images/pixi/sakura/leaf-clusters/open-full.png';

import trunkSvgUrl from '/static/images/pixi/sakura/trunk.svg';
import { ApplicationState } from '@pixi/react/types/typedefs/ApplicationState';

extend({
    Container,
    Graphics,
    Sprite,
});

const LeafCollection = () => {
    const pool = useRef(ObjectPoolFactory.build(Sprite));
    const containerRef = useRef(null);
    // remember to use the callback version of set for incrementing
    const [numLeafClusters, setNumLeafClusters] = useState<number>(100);

    // todo move this to a LeafCluster class, with its own init function and
    // constructor that initializes to 0 values
    // Function to reset a leaf before reuse
    // pool.current.resetObject = (leaf) => {
    //     leaf.x = 0;
    //     leaf.y = 0;
    //     leaf.alpha = 1;
    //     leaf.scale.set(1);
    //     leaf.rotation = 0;
    //     leaf.visible = true;
    // };

    const {
        assets: [
            leafClusterOpenFull,
        ],
        isSuccess,
    } = useAssets([
        {
            alias: 'leafClusterOpenFull',
            src: leafClusterOpenFullUrl,
        }
    ]);

    useEffect(() => {
        // Configure ObjectPoolFactory
        pool.current.reserve(10000);
        pool.current.startGC();

        const container = containerRef.current;

        // Pre-populate the pool (optional)
        for (let i = 0; i < numLeafClusters; i++) {
            const leaf = new Sprite(leafClusterOpenFull);
            leaf.anchor.set(0.5);
            pool.current.allocate();
        }

        let elapsed = 0;
        app.ticker.add((delta) => {
            elapsed += delta;

            if (elapsed > 50) { // Create a new leaf every 50 frames
                elapsed = 0;
                const leaf = pool.current.allocate();
                leaf.x = Math.random() * app.screen.width;
                leaf.y = -20; // Start off-screen
                container.addChild(leaf);
            }

            // Animate and release leaves that go off-screen
            for (let i = container.children.length - 1; i >= 0; i--) {
                const leaf = container.children[i];
                leaf.y += 5;
                leaf.rotation += 0.1;

                if (leaf.y > app.screen.height + 20) {
                    container.removeChild(leaf);
                    pool.current.release(leaf);
                }
            }
        });
    }, []);

    return <Sprite ref={containerRef} />;
};

// Following from https://pixijs.com/8.x/examples/graphics/svg-load
export const TreeContainer = () => {
    const [treeTrunkPivot, setTreeTrunkPivot] = useState({ x: 0, y: 0 });
    const [treeTrunkScale, setTreeTrunkScale] = useState<number>(1);
    const { app }: ApplicationState = useApplication();
    const {
        assets: [
            treeTrunk,
        ],
        isSuccess,
    } = useAssets([
        {
            alias: 'treeTrunk',
            src: trunkSvgUrl,
            data: { parseAsGraphicsContext: true }
        }
    ]);

    const ref = useRef<Graphics>(null);

    useTick(() => {
        if (treeTrunk && isSuccess && ref && ref.current && ref.current?.constructor && ref.current.constructor.name === 'Graphics') {
            // ref.current.rotation += 0.01;
            setTreeTrunkScale(0.75);
            console.log(`Current scale: ${ treeTrunkScale } | Current rotation: ${ ref.current.rotation }`);
            // console.log(`Ref type: ${typeof ref.current} ref: ${ref.current.constructor.name}`);
        }
    });

    useEffect(() => {
        if (isSuccess && treeTrunk && app?.renderer && app?.ticker && app?.screen) {
            const bounds = treeTrunk.bounds;
            setTreeTrunkPivot({
                x: (bounds.x + bounds.width) / 2,
                y: (bounds.y + bounds.height) / 2,
            });

        }
    }, [treeTrunk, app]);

    useEffect(() => {
        if (ref && ref.current) {
            // ref.current.position = { x: 0, y: 0 };
        }
    }, [ref]);

    return (
        <container sortableChildren={ true }>
            { isSuccess && treeTrunk && app?.renderer && app?.screen && (
                <graphics
                    ref={ ref }
                    context={ treeTrunk }
                    pivot={ treeTrunkPivot }
                    scale={ treeTrunkScale }
                    x={ app.screen.width - ((9 * treeTrunk.bounds.width) / 10) + 40 }
                    y={ app.screen.height - ((8 * treeTrunk.bounds.height) / 10) }
                />
            ) }
        </container>
    );
};
TreeContainer.displayName = 'HomeDemo';

export const HomeDemo = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <Application
            autoStart
            sharedTicker
            resizeTo={ ref }
            background={ 'white' }
            backgroundAlpha={ 0 }
        >
            <TreeContainer/>
        </Application>
    );
});
HomeDemo.displayName = 'HomeDemo';
