import React from 'react';
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';


import { Home } from '../pages/Home';
import { RootLayout } from '@/components/RootLayout';

export const createRouter = () => {
    const routes = createRoutesFromElements(
        <Route>
            <Route
                index
                path='/'
                element={
                    <RootLayout>
                        <Home/>
                    </RootLayout>
                }
            />
            <Route path="/*" element={ <p>Page not found</p> }/>
        </Route>
    );

    return createBrowserRouter(routes, {
        basename: import.meta.env.BASE_URL,
    });
};
