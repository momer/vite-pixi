import { Application, extend, useApplication } from '@pixi/react';
import { Container, Graphics } from 'pixi.js';
import { forwardRef, useCallback, useRef } from 'react';

extend({
    Container,
    Graphics
});

export const SakuraContainer = () => {
    const drawCallback = useCallback((graphics: Graphics) => {
        graphics.clear();
        graphics.setFillStyle({ color: 'red' });
        graphics.rect(0, 0, 100, 100);
        graphics.fill();
    }, []);

    return (
        <container x={ 100 } y={ 100 }>
            {/* eslint-disable-next-line react/no-unknown-property */ }
            <graphics draw={ drawCallback }/>
        </container>
    );
};

export const HomeDemo = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <Application
            autoStart
            sharedTicker
            resizeTo={ ref }
        >
            <SakuraContainer/>
        </Application>
    );
});
HomeDemo.displayName = 'HomeDemo';
