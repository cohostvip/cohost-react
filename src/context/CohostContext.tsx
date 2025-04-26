import * as React from 'react';
import { createContext, useContext } from 'react';
import { CohostClientSettings, createCohostClient, type CohostClient } from '@cohostvip/cohost-node';


export type CohostProviderProps = {
    settings?: CohostClientSettings;
    children: React.ReactNode;
} & ({
    token: string; client?: CohostClient;
} | {
    token?: string; client: CohostClient;
});

const CohostContext = createContext<{
    client: CohostClient;
} | null>(null);

export const CohostProvider: React.FC<CohostProviderProps> = ({
    client: providedClient,
    settings,
    token: providedToken,
    children,
}) => {
    const client = providedClient ?? createCohostClient({ token: providedToken!, settings }); // assumes a factory fn in cohost-node

    return (
        <CohostContext.Provider value={{ client }}>
            {children}
        </CohostContext.Provider>
    );
};

export const useCohostClient = (): { client: CohostClient } => {
    const ctx = useContext(CohostContext);
    if (!ctx) throw new Error("useCohostClient must be used within a CohostProvider");
    return ctx;
};
