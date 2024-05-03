import logo from './logo.svg';
import './App.css';
import ImageGenerater from './components/ImageGenerater';
import ImageGenerater2by1 from './components/ImageGenerater2by1';
import ImageGenerater2by3 from './components/ImageGenerater2by3';
import ImageGenerater2by4 from './components/ImageGenerater2by4';
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
                <ImageGenerater2by1 />
              </Home>
            }
          ></Route>
          <Route
            path='three'
            element={
              <Home>
                <ImageGenerater />
              </Home>
            }
          ></Route>
          <Route
            path='/five'
            element={
              <Home>
                <ImageGenerater2by3 />
              </Home>
            }
          ></Route>
          <Route
            path='/seven'
            element={
              <Home>
                <ImageGenerater2by4 />
              </Home>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
