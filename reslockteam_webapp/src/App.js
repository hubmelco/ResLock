import React from 'react';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { Provider } from 'react-redux'
import Login from "./pages/Login"
import TabView from "./pages/TabView"
import store from './redux/store';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Provider store={store}>
        <Router>
            <Routes>            
                <Route exact path={"/dashboard"} element={<TabView/>}/>
                <Route exact path={"/"} element={<Login/>}/>
                <Route exact path={"/resetPassword"} element={<ResetPassword/>}/>
            </Routes> 
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
            /> 
        </Router>
    </Provider>
  );
}

export default App;
