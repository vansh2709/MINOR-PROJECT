import { useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
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
        <div className="announcer">
            <h3 className="headings">Announcement</h3>
            <form ref={formRef} onSubmit={handleAnnounce}>
                <div>
                    <div>
                        <label className="label">Title:</label><br />
                        <input className="input-box" name="title" placeholder="title..." />
                    </div>

                    <div>
                        <label className="label">Body:</label><br />
                        <input className="input-box" name="body" placeholder="body..." />
                    </div>
                </div>

                <p className="label">Target:</p>
                <div>
                    <div>
                        {/* Replaced Selector/SelectInput with native select element for Year */}
                        <div>
                            <label className="label " htmlFor="target_year">Year:  </label>
                            <select name="target_year" id="target_year" className="select-box">
                                <option value="all" >All</option>
                                <option value="1">1st Year</option>
                                <option value="2" >2nd Year</option>
                                <option value="3" >3rd Year</option>
                                <option value="4" >4th Year</option>
                            </select>

                            <label className="label" htmlFor="target_branch">Branch:  </label>
                            <select name="target_branch" id="target_branch" className="select-box">
                                <option value="all">All</option>
                                <option value="CSE">CSE</option>
                                <option value="AI">AI/ML</option>
                                <option value="RA">Robotics</option>
                                <option value="ME">ME</option>
                                <option value="CE">Civil</option>
                                <option value="BCA">BCA</option>
                            </select>

                            <label className="label" htmlFor="target_section">Section:  </label>
                            <select name="target_section" id="target_section" className="select-box">
                                <option value="all">All</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* expiry of announcement */}
                <div>
                    <label className="label">Expires At: </label>
                    <input className="select-box" name="expires_at" type="datetime-local" />
                </div>

                <button
                    className="button"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Announcing...' : 'Announce'}
                </button>
            </form>
        </div>
    )
}