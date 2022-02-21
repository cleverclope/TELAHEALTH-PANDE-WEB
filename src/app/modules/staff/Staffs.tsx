import React from "react";
import {Requests} from "../../../utils/Requests";
import BasicModal, {initial_alert, Loader, MyDatePicker, MyInput, MySelect, ProgressModal, ShowAlert} from "../../../utils/Components";
import {AddOutlined, CloseTwoTone, SaveTwoTone, SearchOutlined} from "@mui/icons-material";
import {Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Utils} from "../../../utils/Utils";

interface Staff {
    last_name: string
    first_name: string
    face_gender: 'Male' | 'Female'
    nin_number: string
    date_of_birth: string
    user_id: number
    school_id: number
    mobile_contact: string
    email_address: string
    school_name: string
}

const initial_staff: Staff = {
    date_of_birth: Utils.date_to_string(new Date()), email_address: "", face_gender: 'Male', first_name: "", last_name: "",
    mobile_contact: "", nin_number: "", school_id: 0, school_name: "", user_id: 0
}

export default function Staffs() {
    const [alert, setAlert] = React.useState(initial_alert)
    const [loader, setLoader] = React.useState<Loader>({open: false, title: ""})

    const [search, setSearch] = React.useState({school_id: 0})
    const handle_search = (name: string, value: string | number) => {
        setSearch({...search, [name]: value})
    }

    const [staffs, setStaffs] = React.useState(Array<Staff>())
    const [schools, setSchools] = React.useState<Array<{ school_name: string, school_id: number }>>([])

    const search_staff = () => {
        setLoader({open: true, title: "Loading staff, please wait"})
        Requests.get_staff({school_id: search.school_id, source: 'admin'})
            .then((response) => {
                setLoader({open: false, title: ""})
                if (response.data.hasOwnProperty("code") && response.data.code === 1) {
                    setStaffs(response.data.staff)
                    setSchools(response.data.schools)
                    if (response.data.staff.length === 0) {
                        setAlert({message: "Empty Data, No staff found", open: true, severity: 'info'})
                    }
                } else {
                    setAlert({message: "Could load staff, please retry", open: true, severity: 'error'})
                }
            })
            .catch(() => {
                setLoader({open: false, title: ""})
                setAlert({message: "Could load staff, please retry", open: true, severity: 'error'})
            })
    }

    /*staff data*/
    const [staff, setStaff] = React.useState(initial_staff)
    const handle_staff = (name: string, value: string | number) => {
        setStaff({...staff, [name]: value})
    }

    const [showStaff, setShowStaff] = React.useState(false)
    const save_staff = () => {
        setLoader({open: true, title: "Saving staff data, please wait"})
        Requests.save_staff({
            date_of_birth: staff.date_of_birth,
            email_address: staff.email_address,
            face_gender: staff.face_gender,
            first_name: staff.first_name,
            last_name: staff.last_name,
            mobile_contact: staff.mobile_contact,
            nin_number: staff.nin_number,
            school_id: staff.school_id,
            user_id: staff.user_id
        })
            .then((response) => {
                setLoader({open: false, title: ""})
                if (response.data.hasOwnProperty("code") && response.data.code === 1) {
                    if (staff.user_id === 0) {
                        setStaffs([{...staff, user_id: response.data.user_id}, ...staffs])
                    } else {
                        setStaffs(
                            staffs.map((_staff) => staff.user_id === _staff.user_id ?
                                {...staff, user_id: response.data.user_id} : _staff
                            )
                        )
                    }
                    setStaff({...staff, user_id: response.data.user_id})
                    setAlert({message: "Staff saved successfully", open: true, severity: 'success'})
                } else {
                    setAlert({message: "Could not save staff, please retry", open: true, severity: 'error'})
                }
            })
            .catch((error) => {
                setLoader({open: false, title: ""})
                setAlert({message: "Could not save staff, please retry", open: true, severity: 'error'})
            })
    }

    return (
        <>
            <ProgressModal title={loader.title} open={loader.open}/>

            <ShowAlert open={alert.open} message={alert.message} severity={alert.severity}
                       close={() => setAlert({...alert, open: false})}/>

            <div className="table_header">
                <div className='search_components'>
                    <div style={{width: '300px'}}>
                        <MySelect value={search.school_id} name="school_id" onChange={handle_search}
                                  options={
                                      [{text: 'All Schools', value: 0},
                                          ...schools.map((school) =>
                                              ({text: school.school_name, value: school.school_id}))]
                                  }/>
                    </div>
                </div>
                <div className="search_buttons">
                    <Button variant="outlined" startIcon={<AddOutlined/>} size="small"
                            onClick={() => {
                                setStaff(initial_staff)
                                setShowStaff(true)
                            }}>
                        Add Staff
                    </Button>

                    <Button variant="outlined" startIcon={<SearchOutlined/>} onClick={search_staff} size="small">Search</Button>
                </div>
            </div>

            <div className="table_container">
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={50} align={"center"}>No.</TableCell>
                                <TableCell width={200}>Staff Name</TableCell>
                                <TableCell width={250}>School Name</TableCell>
                                <TableCell width={80}>Gender</TableCell>
                                <TableCell width={150}>Email Address</TableCell>
                                <TableCell width={120}>Mobile Contact</TableCell>
                                <TableCell width={150}>NIN No.</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                staffs.map((staff, index) =>
                                    <TableRow key={staff.user_id}
                                              onClick={() => {
                                                  setStaff(staff)
                                                  setShowStaff(true)
                                              }}>
                                        <TableCell align={"center"}>{index + 1}</TableCell>
                                        <TableCell>{`${staff.last_name} ${staff.first_name}`}</TableCell>
                                        <TableCell>{staff.school_name}</TableCell>
                                        <TableCell>{staff.face_gender}</TableCell>
                                        <TableCell>{staff.email_address}</TableCell>
                                        <TableCell>{staff.mobile_contact}</TableCell>
                                        <TableCell>{staff.nin_number}</TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div className="table_footer">

            </div>

            <BasicModal open={showStaff}>
                <div className="form">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <MySelect value={staff.school_id} name="school_id"
                                      onChange={(name, value, index) => {
                                          setStaff({
                                              ...staff, school_id: value as number, school_name: schools[index - 1].school_name
                                          })
                                      }}
                                      options={
                                          [{text: 'Select a school', value: 0},
                                              ...schools.map((school) =>
                                                  ({text: school.school_name, value: school.school_id}))]
                                      }/>
                        </Grid>

                        <Grid item xs={12}>
                            <MyInput placeholder="Enter surname" value={staff.last_name} title="Surname"
                                     name="last_name" onChange={handle_staff}/>
                        </Grid>

                        <Grid item xs={12}>
                            <MyInput placeholder="Enter given name" value={staff.first_name} title="Given name"
                                     name="first_name" onChange={handle_staff}/>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MySelect value={staff.face_gender} name="face_gender" title="Gender" onChange={handle_staff}
                                      options={[{text: 'Male', value: 'Male'}, {text: 'Female', value: 'Female'},]}/>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MyDatePicker date={staff.date_of_birth} setDate={handle_staff} name="date_of_birth"
                                          label="Date of Birth" max_date={Utils.date_to_string(new Date())}/>
                        </Grid>

                        <Grid item xs={12}>
                            <MyInput placeholder="Enter staff NIN number" value={staff.nin_number}
                                     name="nin_number" title="NIN Number" onChange={handle_staff}/>
                        </Grid>

                        <Grid item xs={12}>
                            <MyInput placeholder="Mobile Contact" value={staff.mobile_contact} title="Mobile Contact"
                                     name="mobile_contact" onChange={handle_staff}/>
                        </Grid>

                        <Grid item xs={12}>
                            <MyInput placeholder="Enter staff email" value={staff.email_address}
                                     title="Email address" name="email_address" onChange={handle_staff}/>
                        </Grid>
                    </Grid>
                </div>
                <div className="button">
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Button fullWidth size="small" variant="outlined" startIcon={<CloseTwoTone/>}
                                    onClick={() => {
                                        setShowStaff(false)
                                        setStaff(initial_staff)
                                    }}>
                                Close Window
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button fullWidth size="small" variant="contained" startIcon={<SaveTwoTone/>} onClick={save_staff}>
                                Save Staff
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </BasicModal>
        </>
    );
}
