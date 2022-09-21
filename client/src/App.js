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
import DirectOrder from "./components/DirectOrder";
import UpdateInfo from "./Page/UpdateInfo";
import TryAgainst from "./Page/TryAgainst";
import PastOrdersList from "./Page/PastOrdersList";
import PastOrdersListByWorker from "./Page/PastOrdersListByWorker";
import ReviewsList from "./components/ReviewsList";
import JudgeObjection from "./Page/JudgeObjection";
import Main from "./Page/Main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import ClientInfo from "./Page/ClientInfo";
import CreateProposal from "./components/CreateProposal";
import WorkerInfo from "./Page/WorkerInfo";
import ReRendering from "./Page/ReRendering";
import { useCookies } from "react-cookie";

function App() {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [isWorker, setIsWorker] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["login"]);

  useEffect(() => {
    if (cookies.login !== undefined) {
      const { token, userInfo, isWorker } = cookies.login;
      setToken(token);
      setUserInfo(userInfo);
      setIsWorker(isWorker);
    }
    console.log("ReRendering...");
  }, [cookies, token, isWorker]);

  return (
    <BrowserRouter>
      <div>
        <Header
          token={token}
          setToken={setToken}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          isWorker={isWorker}
          removeCookie={removeCookie}
          setIsWorker={setIsWorker}
        />
      </div>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn setToken={setToken} setUserInfo={setUserInfo} setIsWorker={setIsWorker} setCookie={setCookie}/>} />
        <Route path="/findworker" element={<FindWorker userInfo={userInfo} token={token} />}/>
        <Route path="/findorder" element={<FindOrder userInfo={userInfo} token={token} isWorker={isWorker} />} />
        <Route path="/clientInfo" element={<ClientInfo token={token} userInfo={userInfo} setUserInfo={setUserInfo} />}/>
        <Route path="/workerInfo" element={<WorkerInfo token={token} userInfo={userInfo} setUserInfo={setUserInfo} />}/>
        <Route path="/ReRendering" element={<ReRendering token={token} userInfo={userInfo} setUserInfo={setUserInfo} />}/>
        <Route path="/workerprofile" element={<WorkerProfile userInfo={userInfo} token={token} />}/>
        <Route path="/orderinfo" element={<OrderInfo token={token} userInfo={userInfo} />} />
        <Route path="/createorder" element={<CreateOrder userInfo={userInfo} token={token} />}/>
        <Route path="/directOrder" element={<DirectOrder userInfo={userInfo} token={token} />}/>
        <Route path="/createproposal" element={<CreateProposal userInfo={userInfo} token={token} />} />
        <Route path="/governance" element={<Governance userInfo={userInfo} token={token} />}/>
        <Route path="/pastorderslist" element={<PastOrdersList token={token} userInfo={userInfo} />} />
        <Route path="/pastorderslistbyworker" element={<PastOrdersListByWorker token={token} userInfo={userInfo} />} />
        <Route path="/reviewslist" element={<ReviewsList token={token} userInfo={userInfo} />} />
        <Route path="/updateinfo" element={<UpdateInfo userInfo={userInfo} token={token} setUserInfo={setUserInfo} isWorker={isWorker} />} />
        <Route path="/tryagainst" element={<TryAgainst userInfo={userInfo} token={token} isWorker={isWorker} />} />
        <Route path="/judgeobjection" element={<JudgeObjection userInfo={userInfo} token={token} isWorker={isWorker} />} />        
      </Routes>
      <div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default withRoot(App);