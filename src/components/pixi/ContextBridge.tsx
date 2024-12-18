import { Application, ApplicationProps } from '@momer/pixi-react';
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
                                       ...props
                                   }: ApplicationProps & { children: ReactNode, context: TreeContextT }) => {

    return (
        <ContextBridge
            Context={ TreeContext }
            children={ children }
            render={
                (children) => {
                    return (
                        <Application { ...(props as ApplicationProps) }>{ children }</Application>
                    );
                } }
        />
    );
};
