import { useState } from 'react';
import reactLogo from '/static/images/react.svg';
import viteLogo from '/static/images/vite.svg';
import './css/app.css';
import { createRouter } from './Router';
import { RouterProvider } from 'react-router-dom';

function App() {

  return (
    <RouterProvider router={createRouter()} />
  );
}

export default App;
