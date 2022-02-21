import React from "react";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../utils/store/hooks";
import {getFCM, getStaff, updateFCM} from "../utils/store/slices/userSlice";
import {Requests} from "../utils/Requests";
import {getMessaging, getToken, onMessage} from "firebase/messaging";

export default function Firebase(): any {
    const dispatch = useAppDispatch()
    const user = useAppSelector(getStaff)
    const fcm = useAppSelector(getFCM)

    const messaging = getMessaging();

    const init = () => {
        getToken(messaging, {vapidKey: 'BOvt3ZgWBvuioz9HigugjosiYZWEyCeU7qKrwyLzarmyW4nU_J-y-8nT6Y0WTk6bPRLbspZdYRYnsRqBF2xshak'})
            .then((currentToken) => {
                if (currentToken && fcm.token !== currentToken) {
                    dispatch(updateFCM({token: currentToken, saved: false}))
                } else {
                    console.error('No registration token available. Request permission to generate one.');
                }
            })
            .catch((err) => {
                console.error('An error occurred while retrieving token. ', err);
                // catch error while creating client token
            });
    }

    onMessage(messaging, function (payload) {
        const data = payload.data;
        console.log(data)
    });

    React.useEffect(() => {
        const send_token_to_server = () => {
            axios.defaults.headers['common']['Authorization'] = `Bearer ${user.user_token}`
            console.log("FCM Token", fcm.token)

            if (fcm.token !== "" && !fcm.saved && user.user_token !== "") {
                Requests.update_fcm_token({fcm_token: fcm.token})
                    .then((response) => {
                        if (response.data.hasOwnProperty("code") && response.data.code === 1) {
                            dispatch(updateFCM({...fcm, saved: true}))
                        }
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            }
        }
        send_token_to_server()
    }, [fcm, user.user_token])

    React.useEffect(() => {
        document.onclick = function () {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission()
                    .then((permission) => {
                        if (permission === 'granted') {

                        }
                    });
            }
        };
        init()
    }, []);
    return (<></>)
}
