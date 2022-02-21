import React from "react";
import {Requests} from "../../../utils/Requests";
import {Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import BasicModal, {initial_alert, Loader, MyDatePicker, MyInput, MySelect, ProgressModal, ShowAlert} from "../../../utils/Components";
import {AddOutlined, CloseTwoTone, SaveTwoTone, SearchOutlined} from "@mui/icons-material";
import {Utils} from "../../../utils/Utils";
import moment from "moment";

interface Student {
    last_name: string,
    first_name: string,
    face_gender: 'Male' | 'Female',
    nin_number: string,
    date_of_birth: string,
    user_id: number,
    school_id: number,
    caretaker_name: string,
    caretaker_contact: string,
    class_id: number,
    class_stream: string,
    student_no: string
    school_name: string
    class_name: string
}

interface School {
    school_id: number
    school_name: string
    classes: Array<{ streams: string[], class_id: number, class_name: string }>
}

const initial_student: Student = {
    caretaker_contact: "", caretaker_name: "", class_id: 0, class_stream: "",
    date_of_birth: Utils.date_to_string(new Date()), face_gender: "Male", first_name: "", last_name: "", nin_number: "",
    school_id: 0, school_name: "", student_no: "", user_id: 0, class_name: ""
}

export default function Students() {
    const [alert, setAlert] = React.useState(initial_alert)
    const [loader, setLoader] = React.useState<Loader>({open: false, title: ""})

    const [search, setSearch] = React.useState({class_id: 0, school_id: 0})
    const handle_search = (name: string, value: string | number) => {
        setSearch({...search, [name]: value})
    }

    const [students, setStudents] = React.useState(Array<Student>())
    const [schools, setSchools] = React.useState(Array<School>())
    const search_students = () => {
        setLoader({open: true, title: "Loading students, please wait"})
        Requests.get_students({class_id: search.class_id, school_id: search.school_id, source: 'admin'})
            .then((response) => {
                setLoader({open: false, title: ""})
                if (response.data.hasOwnProperty("code") && response.data.code === 1) {
                    setStudents(response.data.students)
                    setSchools(response.data.schools)
                    if (response.data.students.length === 0) {
                        setAlert({message: "Empty data, No students found", open: true, severity: 'info'})
                    }
                } else {
                    setAlert({message: "Could load students, please retry", open: true, severity: 'error'})
                }
            })
            .catch(() => {
                setLoader({open: false, title: ""})
                setAlert({message: "Could load students, please retry", open: true, severity: 'error'})
            })
    }

    /*student data*/
    const [showStudent, setShowStudent] = React.useState(false)
    const [student, setStudent] = React.useState(initial_student)
    const handle_student = (name: string, value: string | number) => {
        setStudent({...student, [name]: value})
    }

    const save_student = () => {
        setLoader({open: true, title: "Saving student, please wait"})
        Requests.save_student({
            caretaker_contact: student.caretaker_contact, caretaker_name: student.caretaker_name,
            class_id: student.class_id, class_stream: student.class_stream,
            date_of_birth: student.date_of_birth, face_gender: student.face_gender,
            first_name: student.first_name, last_name: student.last_name,
            nin_number: student.nin_number, school_id: student.school_id, user_id: student.user_id
        })
            .then((response) => {
                setLoader({open: false, title: ""})
                if (response.data.hasOwnProperty("code") && response.data.code === 1) {
                    if (student.user_id === 0) {
                        setStudents([
                            {...student, user_id: response.data.user_id, student_no: response.data.student_no}, ...students
                        ])
                    } else {
                        setStudents(
                            students.map((_student) => _student.user_id === student.school_id ?
                                {...student, user_id: response.data.user_id} : _student
                            )
                        )
                    }
                    setStudent({...student, user_id: response.data.user_id, student_no: response.data.student_no})
                    setAlert({message: "Saved student successfully", open: true, severity: "success"})
                } else {
                    setAlert({message: "Error while saving student, please retry", open: true, severity: "error"})
                }
            })
            .catch(() => {
                setLoader({open: false, title: ""})
                setAlert({message: "Error while saving student, please retry", open: true, severity: "error"})
            })
    }

    const load_classes = () => {
        const _classes = schools.filter((school) => school.school_id === student.school_id)
        if (_classes.length > 0) {
            return [
                {text: 'Select a class', value: 0},
                ..._classes[0].classes.map((_class) => ({text: _class.class_name, value: _class.class_id}))
            ]
        } else {
            return [{text: 'Select a class', value: 0}]
        }
    }

    const load_streams = () => {
        const classes = schools.filter((school) => school.school_id === student.school_id)
        if (classes.length > 0 && student.class_id > 0) {
            const streams = classes[0].classes.filter((_class) => _class.class_id === student.class_id)[0].streams
            return [{text: 'No class stream', value: ''}, ...streams.map((stream) => ({text: stream, value: stream}))]
        } else {
            return [{text: 'No class stream', value: ''}]
        }
    }

    return (
        <>
            <ShowAlert open={alert.open} message={alert.message} severity={alert.severity}
                       close={() => setAlert({...alert, open: false})}/>
            <ProgressModal title={loader.title} open={loader.open}/>

            <div className="table_header">
                <div className='search_components'>
                    <div>
                        <MySelect value={search.school_id} name="school_id" onChange={handle_search}
                                  options={[{text: 'All Schools', value: 0}]}/>
                    </div>
                    <div>
                        <MySelect value={search.class_id} name="school_id" onChange={handle_search}
                                  options={[{text: 'All Classes', value: 0}]}/>
                    </div>
                </div>
                <div className="search_buttons">
                    <Button variant="outlined" startIcon={<AddOutlined/>} size="small"
                            onClick={() => {
                                setStudent(initial_student)
                                setShowStudent(true)
                            }}>
                        Add Student
                    </Button>

                    <Button variant="outlined" startIcon={<SearchOutlined/>} onClick={search_students} size="small">Search</Button>
                </div>
            </div>

            <div className="table_container">
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={50} align={"center"}>No.</TableCell>
                                <TableCell width={120}>Student No.</TableCell>
                                <TableCell width={200}>Student Name</TableCell>
                                <TableCell width={250}>School Name</TableCell>
                                <TableCell width={200}>Caretaker Name</TableCell>
                                <TableCell width={120}>Caretaker Contact</TableCell>
                                <TableCell width={70}>Gender</TableCell>
                                <TableCell width={120}>Date of Birth</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                students.map((student, index) =>
                                    <TableRow key={student.user_id}>
                                        <TableCell align={"center"}>{index + 1}</TableCell>
                                        <TableCell>{student.student_no}</TableCell>
                                        <TableCell>{student.last_name + " " + student.first_name}</TableCell>
                                        <TableCell>{student.school_name}</TableCell>
                                        <TableCell>{student.caretaker_name}</TableCell>
                                        <TableCell>{student.caretaker_contact}</TableCell>
                                        <TableCell>{student.face_gender}</TableCell>
                                        <TableCell>{moment(student.date_of_birth).format("ll")}</TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div className="table_footer">

            </div>

            <BasicModal open={showStudent}>
                <div className="form">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <MySelect
                                value={student.school_id} name="school_id" prompt="Select a school" title="School Name"
                                onChange={(name, value, index) => {
                                    if (value as number === 0) {
                                        setAlert({message: "School cannot be empty", open: true, severity: "info"})
                                    } else {
                                        setStudent({
                                            ...student, school_id: value as number, school_name: schools[index - 1].school_name,
                                            class_id: 0, class_name: '', class_stream: ''
                                        })
                                    }
                                }}
                                options={[
                                    {text: 'Select a school', value: 0},
                                    ...schools.map((school) =>
                                        ({text: school.school_name, value: school.school_id}))
                                ]}/>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MySelect
                                value={student.class_id} name="class_id" prompt="Select a class" title="Student Class"
                                onChange={(name, value, index) => {
                                    if (value as number === 0) {
                                        setAlert({message: "Class cannot be empty", open: true, severity: 'info'})
                                    } else {
                                        setStudent({
                                            ...student,
                                            class_id: value as number, class_stream: '',
                                            class_name: schools
                                                .filter((school) => school.school_id === student.school_id)[0]
                                                .classes[index - 1].class_name
                                        })
                                    }
                                }}
                                options={load_classes()}/>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MySelect
                                value={student.class_stream} name="class_stream" prompt="Select a stream" title="Stream Name"
                                onChange={(name, value) => {
                                    setStudent({...student, class_stream: value as string,})
                                }}
                                options={load_streams()}/>
                        </Grid>

                        <Grid item xs={12}>
                            <MyInput placeholder="Enter surname" value={student.last_name} title="Surname"
                                     name="last_name" onChange={handle_student}/>
                        </Grid>

                        <Grid item xs={12}>
                            <MyInput placeholder="Enter given name" value={student.first_name} title="Given name"
                                     name="first_name" onChange={handle_student}/>
                        </Grid>

                        <Grid item xs={12}>
                            <MyInput placeholder="Auto generated" value={student.student_no}
                                     title="Student Number" name="student_no" disabled={true}/>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MySelect value={student.face_gender} name="face_gender"
                                      title="Gender" onChange={handle_student} prompt="Select a gender"
                                      options={[{text: 'Male', value: 'Male'}, {text: 'Female', value: 'Female'},]}/>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MyDatePicker date={student.date_of_birth} setDate={handle_student} name="date_of_birth"
                                          label="Date of Birth" max_date={Utils.date_to_string(new Date())}/>
                        </Grid>

                        <Grid item xs={12}>
                            <MyInput placeholder="Enter student NIN number" value={student.nin_number}
                                     name="nin_number" title="NIN Number" onChange={handle_student}/>
                        </Grid>

                        <Grid item xs={12}>
                            <MyInput placeholder="Enter caretaker name" value={student.caretaker_name} title="Caretaker Name"
                                     name="caretaker_name" onChange={handle_student}/>
                        </Grid>

                        <Grid item xs={12}>
                            <MyInput placeholder="Enter caretaker contact" value={student.caretaker_contact}
                                     title="Caretaker Contact" name="caretaker_contact" onChange={handle_student}/>
                        </Grid>
                    </Grid>
                </div>
                <div className="button">
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Button fullWidth size="small" variant="outlined" startIcon={<CloseTwoTone/>}
                                    onClick={() => {
                                        setShowStudent(false)
                                        setStudent(initial_student)
                                    }}>
                                Close Window
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button fullWidth size="small" variant="contained" startIcon={<SaveTwoTone/>} onClick={save_student}>
                                Save Student
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </BasicModal>
        </>
    );
}
