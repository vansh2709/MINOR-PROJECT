import { createContext, useContext, useEffect, useState } from "react";
import { requestFCMToken } from "./requestToken";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    const [userData, setUserData] = useState({});
    const [classes, setClasses] = useState({});

    const loadTimetable = async (userCreds) => {
        const days = [
            "Sunday", "Monday", "Tuesday",
            "Wednesday", "Thursday", "Friday", "Saturday"
        ];
        const date = new Date();
        const int_day = date.getDay();
        const day = "Monday" //days[int_day];
        const year = userCreds.year;
        const branch = userCreds.branch;
        const section = "A";

        const role = userCreds.role;
        let url = "";
        if(role==="Student") url = `http://localhost:8000/get-timetable?year=${year}&branch=${branch}&section=${section}&day=${day}`;
        else url = `http://localhost:8000/get-timetable?teacher_name=${encodeURIComponent(userCreds.name)}&teacher_id=${userCreds.teacher_id}&day=${day}`;

        const response = await fetch(url);
        let data = await response.json();
        data = data.data;
        // pushing lunch
        const lunch = {
            period_id: 5,
            subject_id: '        ',
            subject_name: 'LUNCH',
            teacher_name: '        '
        }
        data.classes.push(lunch);

        const timetable = [];

        for (let p = 0; p < 10; p++) {
            const period = data?.classes.find(f => f.period_id === p);

            if (period) {
                const period_data = {
                    code: period.subject_id,
                    name: period.subject_name,
                    teacher: period.teacher_name
                }
                timetable.push(period_data);
            } else {
                timetable.push({ code: "          ", name: "          ", teacher: "          " })
            }
        }

        setClasses({day: day, classes: timetable});
    }

    async function requestNotification() {
        return new Promise((resolve, reject) => {
            if (!("Notification" in window)) {
                alert("This browser does not support notifications.");
                reject();
            } else {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        console.log("Notification permission granted!");
                        resolve();
                    } else if (permission === "denied") {
                        console.log("Permission denied.");
                        resolve();
                    } else {
                        console.log("Permission dismissed.");
                        reject();
                    }
                });
            }
        })
    }

    async function SubscribePushNotification(userCreds) {
        await requestNotification();

        requestFCMToken().then(async token => {
            if (token) {
                const response = await fetch("http://localhost:8000/save-fcm-token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: userCreds.email,
                        token: token
                    })
                })
                const res_data = await response.json();
            }
        });
    }

    useEffect(() => {
        const user_creds = localStorage.getItem("user_creds");
        const userCreds = user_creds ? JSON.parse(user_creds) : undefined;
        if (userCreds !== undefined) {
            setUserData(userCreds)
            loadTimetable(userCreds);

            // check for notification permission
            SubscribePushNotification(userCreds);
            return;
        }
    }, [])

    const exports = {
        userData,
        classes, setClasses
    }

    return (
        <GlobalContext.Provider value={exports}>
            {children}
        </GlobalContext.Provider>
    )
}

export const AppStates = () => useContext(GlobalContext);