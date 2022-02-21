import React from 'react';
import {PersistGate} from "redux-persist/integration/react";
import {Provider} from "react-redux";
import {createBrowserHistory} from "history";
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from "react-toasts";
import {Route, Router, Routes} from "react-router";
import NoMatch from "./NoMatch";
import Dashboard from "./modules/Dashboard";
import {Requests} from "../utils/Requests";
import axios from "axios";

import {isSupported} from "firebase/messaging";
import {persistedStore, store} from "../utils/store/store";

export default function App() {
    /*initializeApp({
        apiKey: "AIzaSyA63Nl28w2HphP7Z0IEHzMWClp6zIb06lo",
        authDomain: "misc-applications.firebaseapp.com",
        databaseURL: "https://misc-applications.firebaseio.com",
        projectId: "misc-applications",
        storageBucket: "misc-applications.appspot.com",
        messagingSenderId: "797043390702",
        appId: "1:797043390702:web:b06c06f1addcef10bcdbff",
        measurementId: "G-HHVSH870S6"
    });*/

    const set_axios_data = () => {
        axios.defaults.baseURL = Requests.BASE_URL;
        axios.defaults.headers['common']['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.defaults.timeout = 1000 * 60

        axios.interceptors.response.use(function (response) {
            console.log(response.data)
            console.log(response)

            if (response.data.hasOwnProperty("code") && response.data.code === 401) {
                // setLogin({show: true, message: "Account was logged in from another session, your login is required"})
            }
            if (response.data.hasOwnProperty("data") && response.data.data.hasOwnProperty("login_token")) {
                // setLoginToken(response.data.data.login_token)
            }
            return response;
        }, function (error) {
            console.log(error)
            return Promise.reject(error);
        });
    }
    set_axios_data()

    const [hasFirebase, setHasFirebase] = React.useState(false)
    React.useEffect(() => {
        isSupported()
            .then((isSupported) => {
                setHasFirebase(isSupported)
            })
    }, [])

    const myHistory = createBrowserHistory()

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistedStore}>
                <Router location={myHistory.location} navigator={myHistory}>
                    <Routes>
                        <Route path="/" element={<Dashboard/>}/>
                        <Route path="*" element={<NoMatch/>}/>
                    </Routes>
                </Router>

                <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER}/>
                {/*{hasFirebase && <Firebase/>}*/}
            </PersistGate>
        </Provider>
    )
}
