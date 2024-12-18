import React, { createContext, FC, ReactNode, useState } from 'react';
import { DefaultPrecipitationType, PrecipitationDefaults, PrecipitationOptions } from '@/components/pixi/Precipitation';

export type TreeOptions = {
    precipitation: PrecipitationOptions,
}

export type TreeContextT = {
    treeOptions: TreeOptions;
    setTreeOptions: React.Dispatch<React.SetStateAction<TreeOptions>>;
}

export const TreeContext = createContext<TreeContextT | undefined>(undefined);

interface TreeProviderProps {
    children: ReactNode
}

export const TreeProvider: FC<TreeProviderProps> = ({ children }) => {
    const [treeOptions, setTreeOptions] = useState<TreeOptions>({
        precipitation: { ...PrecipitationDefaults[DefaultPrecipitationType] },
    });

    return (
        <TreeContext.Provider value={ { treeOptions, setTreeOptions } as TreeContextT }>
            { children }
        </TreeContext.Provider>
    );
};
