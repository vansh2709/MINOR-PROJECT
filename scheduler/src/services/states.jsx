import { createContext, useContext, useEffect, useState } from "react";
import { requestFCMToken } from "./requestToken";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    const [userData, setUserData] = useState({});
    const [classes, setClasses] = useState([]);

    const loadTimetable = async (userCreds) => {
        const days = [
            "Sunday", "Monday", "Tuesday",
            "Wednesday", "Thursday", "Friday", "Saturday"
        ];
        const date = new Date();
        const int_day = date.getDay();
        const day = "Tuesday" //days[int_day];
        const year = userCreds.year;
        const branch = userCreds.branch;
        const section = "A";

        const role = userCreds.role;
        let url = "";
        if (role === "Student") url = `http://localhost:8000/get-timetable?year=${year}&branch=${branch}&section=${section}&day=${day}`;
        else url = `http://localhost:8000/get-timetable?teacher_name=${encodeURIComponent(userCreds.name)}&teacher_id=${userCreds.teacher_id}&day=${day}`;

        const response = await fetch(url);
        let data = await response.json();
        data = data.data;
        // pushing lunch
        const lunch = {
            period_id: 5,
            subject_id: '',
            subject_name: 'LUNCH',
            teacher_name: ''
        }
        data.classes.push(lunch);

        const timetable = [];

        for (let p = 0; p < 10; p++) {
            const period = data?.classes.find(f => f.period_id === p);

            if (period) {
                const period_data = {
                    day: period.day,
                    period: period.period_id,
                    code: period.subject_id,
                    name: period.subject_name,
                    teacher: period.teacher_name,
                    year: period.year,
                    branch: period.branch_id,
                    section: period.section,
                    cancelled: period.cancelled
                }
                timetable.push(period_data);
            } else {
                timetable.push({ code: "", name: "", teacher: "" })
            }
        }

        setClasses({ day: day, classes: timetable });
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
                        token: token,
                        topics: userCreds?.role === "Student" ? [
                            `year_${userCreds?.year}`,
                            `branch_${userCreds?.branch}`,
                            `${userCreds?.branch}_${userCreds?.year}_${userCreds?.section}`
                        ] : ["teachers"]
                    })
                })
                const res_data = await response.json();
            }
        });
    }

    useEffect(() => {
        const user_creds = localStorage.getItem("user_creds");
        const userCreds = user_creds ? JSON.parse(user_creds) : undefined;

        if (userCreds?.email !== undefined) {
            setUserData(userCreds);
        }
    }, [])

    useEffect(() => {
        // load timetable
        loadTimetable(userData);
        // subscribe to fcm
        SubscribePushNotification(userData);
        return;
    }, [userData])

    // functions
    async function doFetch(url, method = "GET", headers = {}, body = null) {
        try {
            const response = await fetch(url, {
                method,
                headers,
                body
            });

            return { data: response, error: null };
        } catch (err) {
            return { data: null, error: err };
        }
    }


    const exports = {
        doFetch,
        userData, setUserData,
        classes, setClasses,
    }

    return (
        <GlobalContext.Provider value={exports}>
            {children}
        </GlobalContext.Provider>
    )
}

export const AppStates = () => {
    return useContext(GlobalContext);
};