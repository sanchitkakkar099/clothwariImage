import logo from './logo.svg';
import './App.css';
import National from './components/National';
import International from './components/International';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <Home>
                <National />
              </Home>
            }
          ></Route>
          <Route
            path='/international'
            element={
              <Home>
                <International />
              </Home>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
