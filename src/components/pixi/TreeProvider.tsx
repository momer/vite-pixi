import React, { createContext, FC, ReactNode, useState } from 'react';

export class RainOptions {
    static defaultDensity: number = 0;
    static defaultColorStart: string = '#78b2f4';
    static defaultColorEnd: string = '#4091ec';

    density: number;
    colorStart: string;
    colorEnd: string;

    constructor(
        density: number = RainOptions.defaultDensity,
        colorStart: string = RainOptions.defaultColorStart,
        colorEnd: string = RainOptions.defaultColorEnd
    ) {
        this.density = density;
        this.colorStart = colorStart;
        this.colorEnd = colorEnd;
    }
}

export type TreeOptions = {
    rain: RainOptions
}

export type TreeContextT = {
    treeOptions?: TreeOptions;
    setTreeOptions?: React.Dispatch<React.SetStateAction<TreeOptions>>;
}

export const TreeContext = createContext<TreeContextT>({});

interface TreeProviderProps {
    children: ReactNode
}

export const TreeProvider: FC<TreeProviderProps> = ({ children }) => {
    const [treeOptions, setTreeOptions] = useState<TreeOptions>({
        rain: new RainOptions(),
    });

    return (
        <TreeContext.Provider value={ { treeOptions, setTreeOptions } }>
            { children }
        </TreeContext.Provider>
    );
};
