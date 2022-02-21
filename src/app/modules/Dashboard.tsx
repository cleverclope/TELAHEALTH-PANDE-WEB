import React from "react";
import Reports from "./reports/Reports";
import Schools from "./schools/Schools";
import Students from "./students/Students";
import Results from "./diagnosis/Results";
import Staffs from "./staff/Staffs";
import Attendances from "./users/Attendances";

export default function Dashboard() {
    const [page, setPage] = React.useState<{ type: string, content: any }>({content: <Schools/>, type: "schools"})

    return (
        <>
            <div className="nav_container">
                <div className="nav_bar">
                    <div className={`nav_item ${page.type === 'schools' ? 'active' : ''}`}
                         onClick={() => setPage({content: <Schools/>, type: "schools"})}>
                        <span className="material-icons">school</span>
                        <span>Schools</span>
                    </div>

                    <div className={`nav_item ${page.type === 'staffs' ? 'active' : ''}`}
                         onClick={() => setPage({content: <Staffs/>, type: "staffs"})}>
                        <span className="material-icons">supervisor_account</span>
                        <span>Staff List</span>
                    </div>

                    <div className={`nav_item ${page.type === 'students' ? 'active' : ''}`}
                         onClick={() => setPage({content: <Students/>, type: "students"})}>
                        <span className="material-icons">people_outline</span>
                        <span>Students</span>
                    </div>

                    <div className={`nav_item ${page.type === 'attendance' ? 'active' : ''}`}
                         onClick={() => setPage({content: <Attendances/>, type: "attendance"})}>
                        <span className="material-icons">checklist</span>
                        <span>Attendance</span>
                    </div>

                    <div className={`nav_item ${page.type === 'results' ? 'active' : ''}`}
                         onClick={() => setPage({content: <Results/>, type: "results"})}>
                        <span className="material-icons">science</span>
                        <span>Diagnosis</span>
                    </div>

                    <div className={`nav_item ${page.type === 'reports' ? 'active' : ''}`}
                         onClick={() => setPage({content: <Reports/>, type: "reports"})}>
                        <span className="material-icons">summarize</span>
                        <span>Reports</span>
                    </div>
                </div>
            </div>

            <div className="body_container">
                {page.content}
            </div>
        </>
    )
}
