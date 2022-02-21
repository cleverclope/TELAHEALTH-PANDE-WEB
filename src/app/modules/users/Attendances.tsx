import React from "react";
import {Requests} from "../../../utils/Requests";
import {initial_alert, Loader, MyDatePicker, MySelect, ProgressModal, ShowAlert} from "../../../utils/Components";
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {SearchOutlined} from "@mui/icons-material";
import moment from "moment";

interface Attendance {
    user_id: number
    attendance_date: string
    time_in: string
    time_out: string,
    first_name: string
    last_name: string
    face_path: string
    face_gender: string
    date_of_birth: string
    school_name: string
    user_type: string
}

export default function Attendances() {
    const [alert, setAlert] = React.useState(initial_alert)
    const [loader, setLoader] = React.useState<Loader>({open: false, title: ""})

    const [search, setSearch] = React.useState({school_id: 0, class_id: 0, type: 'all', min_date: '', max_date: ''})
    const handle_search = (name: string, value: string | number) => {
        setSearch({...search, [name]: value})
    }

    const [attendances, setAttendances] = React.useState(Array<Attendance>())
    const search_list = () => {
        setLoader({open: true, title: "Loading attendances list, please wait"})
        Requests.get_attendances({class_id: 0, max_date: "", min_date: "", type: 'all', school_id: 0})
            .then((response) => {
                setLoader({open: false, title: ""})
                if (response.data.hasOwnProperty("code") && response.data.code === 1) {
                    setAttendances(response.data.attendances)
                    if (response.data.attendances.length === 0) {
                        setAlert({message: "Empty data, No attendances list found", open: true, severity: 'info'})
                    }
                } else {
                    setAlert({message: "Could load attendances list, please retry", open: true, severity: 'error'})
                }
            })
            .catch(() => {
                setLoader({open: false, title: ""})
                setAlert({message: "Could not load attendance list, please retry", open: true, severity: 'error'})
            })
    }

    return (
        <>
            <ShowAlert open={alert.open} message={alert.message} severity={alert.severity}
                       close={() => setAlert({...alert, open: false})}/>
            <ProgressModal title={loader.title} open={loader.open}/>

            <div className="table_header">
                <div className='search_components'>
                    <div>
                        <MyDatePicker date={search.min_date} name="min_date" label="Start Date" setDate={handle_search}/>
                    </div>
                    <div>
                        <MyDatePicker date={search.max_date} name="max_date" label="End Date" setDate={handle_search}/>
                    </div>
                    <div>
                        <MySelect value={search.school_id} name="school_id" onChange={handle_search}
                                  options={[{text: 'All Schools', value: 0}]}/>
                    </div>
                </div>
                <div className="search_buttons">
                    <Button variant="outlined" startIcon={<SearchOutlined/>} onClick={search_list}>Search</Button>
                </div>
            </div>

            <div className="table_container">
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={50} align={"center"}>No.</TableCell>
                                <TableCell width={120}>Attendance Date</TableCell>
                                <TableCell width={220}>School Name</TableCell>
                                <TableCell width={150}>User Name</TableCell>
                                <TableCell width={100}>User Type</TableCell>
                                <TableCell width={70}>Gender</TableCell>
                                <TableCell width={120}>Time In</TableCell>
                                <TableCell width={120}>Time Out</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                attendances.map((staff, index) =>
                                    <TableRow key={staff.user_id}>
                                        <TableCell align={"center"}>{index + 1}</TableCell>
                                        <TableCell>{moment(staff.attendance_date).format("ddd MMM DD YYYY")}</TableCell>
                                        <TableCell>{staff.school_name}</TableCell>
                                        <TableCell>{staff.first_name + " " + staff.last_name}</TableCell>
                                        <TableCell>{staff.user_type}</TableCell>
                                        <TableCell>{staff.face_gender}</TableCell>
                                        <TableCell>{moment(staff.time_in).format("hh:mm:ss a")}</TableCell>
                                        <TableCell>{staff.time_out === '' ? '' : moment(staff.time_in).format("hh:mm:ss a")}</TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div className="table_footer">

            </div>
        </>
    )
}
