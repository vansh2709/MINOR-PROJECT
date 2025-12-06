import { useRef, useState } from "react";
import { ClipLoader } from "react-spinners";

import Selector from "./Selector"
import { AppStates } from "../services/states";


export default function Announce() {

    const formRef = useRef(HTMLFormElement);
    const [loading, setLoading] = useState(false);
    const { userData } = AppStates();

    async function handleAnnounce(e) {
        e.preventDefault();

        const form = new FormData(formRef.current);
        const formData = Object.fromEntries(form.entries());
        formData.created_by = {
            name: userData?.name,
            id: userData?.teacher_id
        };
        formData.status = "published";

        setLoading(true);
        // upload to server 
        const response = await fetch("http://localhost:8000/announce", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })

        const res_data = await response.json();
        console.log(res_data);
        setLoading(false);
        e.target.reset();
    }

    return (
        <div className="w-3/5 inline-block px-6 py-4  border-2 border-red-500 rounded-xl bg-slate-100">
            <h3 className="m-0 mb-2">Announcement</h3>
            <form ref={formRef} onSubmit={handleAnnounce}>
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <label>Title</label>
                        <input name="title" placeholder="title..." className="p-2 rounded-md outline-0 border-[2px] border-gray-600 focus:border-blue-500" />
                    </div>

                    <div className="flex flex-col">
                        <label>Body</label>
                        <input name="body" placeholder="body..." className="p-2 rounded-md outline-0 border-[2px] border-gray-600 focus:border-blue-500" />
                    </div>
                </div>

                <p className="m-0 mt-4 text-xl font-bold">Target</p>
                <div className="w-full flex gap-2">
                    {/* <div className="flex flex-col">
                        <label htmlFor="send_to_all_checkbox">Send to all</label>
                        <input id="send_to_all_checkbox" type="checkbox" name="isGlobal" className="" />
                    </div> */}

                    <div className="flex gap-4 flex-1">
                        <Selector label="Year" name="target_year" >
                            <option value="all" >All</option>
                            <option value="1">1st Year</option>
                            <option value="2" >2nd Year</option>
                            <option value="3" >3rd Year</option>
                            <option value="4" >4th Year</option>
                        </Selector>

                        <Selector label="Branch" name="target_branch" >
                            <option value="all">All</option>
                            <option value="CSE">CSE</option>
                            <option value="AI">AI/ML</option>
                            <option value="RE">Robotics</option>
                            <option value="ME">ME</option>
                            <option value="CE">Civil</option>
                        </Selector>

                        <Selector label="Section" name="target_section" >
                            <option value="all">All</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                        </Selector>
                    </div>
                </div>

                {/* expiry of announcement */}
                <div className="flex flex-col mt-4">
                    <label>Expires At</label>
                    <input name="expires_at" type="datetime-local" className="p-2 rounded-md outline-0 border-[2px] border-gray-600 focus:border-blue-500" />
                </div>

                <button
                    type="submit"
                    className="p-2 px-4 rounded-md bg-blue-500 text-white mt-4 float-end flex items-center gap-2"
                >
                    Announce
                    {
                        loading && (
                            <ClipLoader size={20} color="#fff" />
                        )
                    }
                </button>
            </form>
        </div>
    )
}