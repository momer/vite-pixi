import { Application } from '@pixi/react';
import { Application as PixiApplication } from 'pixi.js';
import { ReactNode } from 'react';
import { TreeContext, TreeContextT } from '@/components/pixi/TreeProvider';

export const ContextBridge = ({ children, Context, render }) => {
    return (
        <Context.Consumer>
            { (value) =>
                render(<Context.Provider value={ value }>{ children }</Context.Provider>)
            }
        </Context.Consumer>
    );
};

export const ContextApplication = ({
                                       context,
                                       children,
                                       onInit,
                                       ...props
                                   }: any & {
    children: ReactNode,
    context: TreeContextT,
    onInit: (app: PixiApplication) => void
}) => {

    return (
        <ContextBridge
            Context={ TreeContext }
            children={ children }
            render={
                (children) => {
                    return (
                        <Application onInit={ onInit } { ...(props) }>{ children }</Application>
                    );
                } }
        />
    );
};
