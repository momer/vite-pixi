import { Application, ApplicationOptions } from 'pixi.js';
import { ReactNode } from 'react';
import { TreeContextT } from '@/components/pixi/TreeProvider';

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
                                       ...props
                                   }: ApplicationOptions & { children: ReactNode, context: TreeContextT }) => {

    return (
        <ContextBridge
            Context={ context } // Assuming 'context' is a property in ApplicationOptions
            children={ children }
            render={
                (children) => {
                    return (
                        context && <Application { ...(props as ApplicationOptions) }>{ children }</Application>
                    );
                } }
        />
    );
};
