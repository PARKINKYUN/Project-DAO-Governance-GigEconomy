import * as React from "react";
import Footer from "./view/Footer";
import Header from "./view/Header";
import withRoot from "./withRoot";
import SignUp from "./Page/SignUp";
import SignIn from "./Page/SignIn";
import FindWorker from "./Page/FindWorker";
import FindOrder from "./Page/FindOrder";
import WorkerProfile from "./Page/WorkerProfile";
import CreateOrder from "./components/CreateOrder";
import OrderInfo from "./Page/OrderInfo";
import Governance from "./Page/Governance";
import Main from "./Page/Main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import ClientInfo from "./Page/ClientInfo";

function App() {
  const [token, setToken] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [isWorker, setIsWorker] = useState(false);

  useEffect( () => {
    console.log("ReRendering...");
  }, [token, userInfo, isWorker]);

  return (
    <BrowserRouter>
      <div>
        <Header token={token} setToken={setToken} userInfo={userInfo} setUserInfo={setUserInfo} isWorker={isWorker} />
      </div>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn setToken={setToken} setUserInfo={setUserInfo} setIsWorker={setIsWorker} />} />
        <Route path="/findworker" element={<FindWorker />} />
        <Route path="/findorder" element={<FindOrder />} />
        <Route path="/clientprofile" element={<ClientInfo token={token} userInfo={userInfo} setUserInfo={setUserInfo} />} />
        <Route path="/workerprofile" element={<WorkerProfile />} />
        <Route path="/orderinfo" element={<OrderInfo />} />
        <Route path="/createorder" element={<CreateOrder />} />
        <Route path="/governance" element={<Governance />} />
      </Routes>
      <div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default withRoot(App);
