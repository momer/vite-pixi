import './css/app.css';
import { createRouter } from './Router';
import { RouterProvider } from 'react-router-dom';

function App() {

  return (
    <RouterProvider router={createRouter()} />
  );
}

export default App;
