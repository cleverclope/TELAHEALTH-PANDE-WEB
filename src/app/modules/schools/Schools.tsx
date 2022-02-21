import React from "react";
import BasicModal, {initial_alert, Loader, MyInput, MySelect, ProgressModal, ShowAlert} from "../../../utils/Components";
import {Requests} from "../../../utils/Requests";
import {Button, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {AddOutlined, ClearRounded, CloseTwoTone, EditOutlined, SaveTwoTone, SearchOutlined, ViewListOutlined} from "@mui/icons-material";

interface SchoolClass {
    class_id: number
    class_name: string
    streams: string[]
}

interface School {
    school_id: number
    school_code: string
    school_name: string
    school_contacts: string
    section: 'Day' | 'Boarding' | 'Day & Boarding'
    district: string
    sub_parish: string
    parish: string
    covid_facility: string
    facility_contacts: string
    population: number
    classes: SchoolClass[]
}

interface ClassInfo {
    show: boolean
    school_id: number
    classes: SchoolClass[]
    class: {
        class_id: number
        class_name: string
        streams: string[]
        stream: string
    }
}

const initial_school: School = {
    school_code: "", covid_facility: "", district: "", facility_contacts: '', parish: "", population: 0,
    school_contacts: '', school_id: 0, school_name: "", section: "Boarding", sub_parish: "", classes: []
}

export default function Schools() {
    const [alert, setAlert] = React.useState(initial_alert)
    const [loader, setLoader] = React.useState<Loader>({open: false, title: ""})

    const [search, setSearch] = React.useState({school_name: ''})
    const handle_search = (name: string, value: string) => {
        setSearch({...search, [name]: value})
    }

    const [classes, setClasses] = React.useState<Array<{ class_id: number, class_name: string }>>([])
    const [schools, setSchools] = React.useState(Array<School>())
    const search_schools = () => {
        setLoader({open: true, title: "Loading data, please wait"})
        Requests.get_schools({school_name: search.school_name.trim()})
            .then((response) => {
                setLoader({open: false, title: ""})
                if (response.data.hasOwnProperty("code") && response.data.code === 1) {
                    setSchools(response.data.schools)
                    setClasses(response.data.classes)
                } else {
                    setAlert({message: "Could load school data, please retry", open: true, severity: 'error'})
                }
            })
            .catch(() => {
                setLoader({open: false, title: ""})
                setAlert({message: "Could load school data, please retry", open: true, severity: 'error'})
            })
    }

    const [showSchool, setShowSchool] = React.useState(false)
    const [school, setSchool] = React.useState(initial_school)
    const handle_school = (name: string, value: string | string[] | number) => {
        setSchool({...school, [name]: value})
    }

    const save_school = () => {
        setLoader({open: true, title: "Saving data, please wait"})
        Requests.save_school({
            covid_facility: school.covid_facility,
            district: school.district,
            facility_contacts: school.facility_contacts,
            parish: school.parish,
            school_code: school.school_code,
            school_contacts: school.school_contacts,
            school_id: school.school_id,
            school_name: school.school_name,
            section: school.section,
            sub_parish: school.sub_parish
        })
            .then((response) => {
                setLoader({open: false, title: ""})
                if (response.data.hasOwnProperty("code") && response.data.code === 1) {
                    setAlert({message: "School data saved successfully", open: true, severity: "success"})
                    const _new_school: School = {...school, school_id: response.data.school_id, school_code: response.data.school_code}
                    setSchools(
                        school.school_id === 0 ? [_new_school, ...schools] :
                            [...schools.map((_school) => _school.school_id === school.school_id ? _new_school : _school)]
                    )
                    setSchool(_new_school)
                } else {
                    setAlert({message: "Could not save data, please retry", open: true, severity: 'error'})
                }
            })
            .catch(() => {
                setAlert({message: "Could not save data, please retry", open: true, severity: 'error'})
                setLoader({open: false, title: ""})
            })
    }

    /*class information*/
    const [schoolClasses, setSchoolClasses] = React.useState<ClassInfo>(
        {show: false, school_id: 0, classes: [], class: {class_id: 0, class_name: "", stream: "", streams: []}})

    const save_classes = () => {
        setLoader({open: true, title: "Saving class data, please wait"})
        Requests.save_classes({classes: JSON.stringify(schoolClasses.classes), school_id: schoolClasses.school_id})
            .then((response) => {
                setLoader({open: false, title: ""})
                if (response.data.hasOwnProperty("code") && response.data.code === 1) {
                    setSchoolClasses({...schoolClasses, classes: response.data.classes})
                    setSchools(
                        schools.map((_school) =>
                            _school.school_id === schoolClasses.school_id ? {..._school, classes: response.data.classes} : _school
                        )
                    )
                    setAlert({message: "Saved school successfully", open: true, severity: 'success'})
                } else {
                    setAlert({message: "Could not save school, please retry", open: true, severity: 'error'})
                }
            })
            .catch(() => {
                setLoader({open: false, title: ""})
                setAlert({message: "Could not save school, please retry", open: true, severity: 'error'})
            })
    }

    return (
        <>
            <ProgressModal title={loader.title} open={loader.open}/>

            <ShowAlert open={alert.open} message={alert.message} severity={alert.severity}
                       close={() => setAlert({...alert, open: false})}/>

            <div className="table_header">
                <div className='search_components'>
                    <div>
                        <MyInput title='Search by school name' value={search.school_name} name='school_name'
                                 onChange={handle_search} onPressEnter={search_schools}/>
                    </div>
                </div>
                <div className="search_buttons">
                    <Button variant="outlined" startIcon={<AddOutlined/>} size="small"
                            onClick={() => {
                                setSchool(initial_school)
                                setShowSchool(true)
                            }}>
                        Add School
                    </Button>

                    <Button variant="outlined" size="small" startIcon={<SearchOutlined/>} onClick={search_schools}>Search</Button>
                </div>
            </div>

            <div className="table_container">
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={60}/>
                                <TableCell width={30} align="center">No.</TableCell>
                                <TableCell width={250}>School Name</TableCell>
                                <TableCell width={140}>Section</TableCell>
                                <TableCell width={150}>District</TableCell>
                                <TableCell width={150}>Sub Parish</TableCell>
                                <TableCell width={150}>Parish</TableCell>
                                <TableCell width={180}>Covid Facility</TableCell>
                                <TableCell width={100}>Population</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                schools.map((school, index) =>
                                    <TableRow key={school.school_id}>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton
                                                    color="primary" aria-label="upload picture" component="span"
                                                    onClick={() => {
                                                        setSchool(school)
                                                        setShowSchool(true)
                                                    }}>
                                                    <EditOutlined/>
                                                </IconButton>
                                                <IconButton
                                                    color="primary" aria-label="upload picture" component="span"
                                                    onClick={() => {
                                                        setSchoolClasses({
                                                            classes: school.classes, school_id: school.school_id, show: true,
                                                            class: {class_id: 0, class_name: "", stream: "", streams: []}
                                                        })
                                                    }}>
                                                    <ViewListOutlined/>
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align='center'>{index + 1}</TableCell>
                                        <TableCell>{school.school_name}</TableCell>
                                        <TableCell>{school.section}</TableCell>
                                        <TableCell>{school.district}</TableCell>
                                        <TableCell>{school.sub_parish}</TableCell>
                                        <TableCell>{school.parish}</TableCell>
                                        <TableCell>{school.covid_facility}</TableCell>
                                        <TableCell align='center'>{school.population}</TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div className="table_footer">

            </div>

            <BasicModal open={showSchool}>
                <div className="form">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <MyInput placeholder="Enter school name" value={school.school_name} title="School Name"
                                     name="school_name" onChange={handle_school}/>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MyInput placeholder="Auto generated" value={school.school_code}
                                     title="School code" name="school_code" disabled={true}/>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MySelect value={school.section} name="section" title="Section" onChange={handle_school}
                                      options={[
                                          {text: 'Boarding', value: 'Boarding'}, {text: 'Day', value: 'Day'},
                                          {text: 'Day & Boarding', value: 'Day & Boarding'}
                                      ]}/>
                        </Grid>

                        {/*school contacts*/}
                        <Grid item xs={12}>
                            <MyInput placeholder="Enter school contacts (separated by commas)" value={school.school_contacts}
                                     name="school_contacts" title="School contacts" onChange={handle_school}/>
                        </Grid>

                        {/*district of location*/}
                        <Grid item xs={12}>
                            <MyInput placeholder="Enter district of location" value={school.district} title="School district"
                                     name="district" onChange={handle_school}/>
                        </Grid>

                        {/*parish of location*/}
                        <Grid item xs={12}>
                            <MyInput placeholder="Enter parish" value={school.parish} title="School parish"
                                     name="parish" onChange={handle_school}/>
                        </Grid>

                        {/*sub parish of location*/}
                        <Grid item xs={12}>
                            <MyInput placeholder="Enter sub-parish" value={school.sub_parish} title="School sub-parish"
                                     name="sub_parish" onChange={handle_school}/>
                        </Grid>

                        {/*covid facility*/}
                        <Grid item xs={12}>
                            <MyInput placeholder="Enter facility name" value={school.covid_facility}
                                     title="Nearest covid facility" name="covid_facility" onChange={handle_school}/>
                        </Grid>

                        {/*facility contacts*/}
                        <Grid item xs={12}>
                            <MyInput placeholder="Enter facility contacts (Separated by commas)" value={school.facility_contacts}
                                     title="Facility contacts" name="facility_contacts" onChange={handle_school}/>
                        </Grid>
                    </Grid>
                </div>
                <div className="button">
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Button fullWidth size="small" variant="outlined" startIcon={<CloseTwoTone/>}
                                    onClick={() => setShowSchool(false)}>
                                Close Window
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button fullWidth size="small" variant="contained" startIcon={<SaveTwoTone/>} onClick={save_school}>
                                Save School
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </BasicModal>

            <BasicModal open={schoolClasses.show} className="classes">
                <div className="form">
                    <Grid container={true} spacing={1}>
                        <Grid item={true} xs={7}>
                            <div className="flex_container">
                                <div className="table_container">
                                    <TableContainer component={Paper}>
                                        <Table sx={{minWidth: 300}} size="small" aria-label="a dense table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell width={50}>No</TableCell>
                                                    <TableCell width={250}>Class Name</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    schoolClasses.classes.map((schoolClass, index) =>
                                                        <TableRow key={schoolClass.class_id}
                                                                  onClick={() => {
                                                                      setSchoolClasses({
                                                                          ...schoolClasses,
                                                                          class: {
                                                                              class_id: schoolClass.class_id,
                                                                              class_name: schoolClass.class_name,
                                                                              streams: schoolClass.streams, stream: ""
                                                                          }
                                                                      })
                                                                  }}>
                                                            <TableCell align='center'>{index + 1}</TableCell>
                                                            <TableCell>{schoolClass.class_name}</TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                        </Grid>
                        <Grid item={true} xs={5}>
                            <div className="flex_container">
                                <div>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <MySelect
                                                value={schoolClasses.class.class_id} name="class_id" title="Select a class"
                                                onChange={(name, value) => {
                                                    setSchoolClasses({
                                                        ...schoolClasses, class: {
                                                            ...schoolClasses.class,
                                                            class_id: value as number,
                                                            class_name: classes
                                                                .filter((_class) =>
                                                                    _class.class_id === value as number
                                                                )[0].class_name
                                                        }
                                                    })
                                                }}
                                                options={
                                                    classes
                                                        .map((_class) => {
                                                            return ({text: _class.class_name, value: _class.class_id});
                                                        })
                                                        .filter((_class) => {
                                                            if (schoolClasses.class.class_id === 0) {
                                                                return !schoolClasses.classes
                                                                    .map((__class) => (__class.class_id))
                                                                    .includes(_class.value)
                                                            } else {
                                                                return _class.value === schoolClasses.class.class_id
                                                            }
                                                        })
                                                }/>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <MyInput value={schoolClasses.class.stream} name="stream"
                                                     placeholder="Enter stream name" title="Stream Name"
                                                     onChange={(name, value) => {
                                                         setSchoolClasses({
                                                             ...schoolClasses, class: {...schoolClasses.class, stream: value}
                                                         })
                                                     }}/>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Button fullWidth size="small" variant="contained" startIcon={<AddOutlined/>}
                                                    onClick={() => {
                                                        if (schoolClasses.class.streams.includes(schoolClasses.class.stream.trim())) {
                                                            setAlert({message: "Stream already saved", open: true, severity: 'error'})
                                                        } else {
                                                            setSchoolClasses({
                                                                ...schoolClasses, class: {
                                                                    ...schoolClasses.class,
                                                                    streams: [...schoolClasses.class.streams,
                                                                        schoolClasses.class.stream.trim()
                                                                    ],
                                                                    stream: ""
                                                                }
                                                            })
                                                        }
                                                    }}>
                                                Add Stream
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>

                                <div className="table_container" style={{marginTop: '10px',}}>
                                    <TableContainer component={Paper}>
                                        <Table sx={{minWidth: 100}} size="small" aria-label="a dense table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell width={50}>No</TableCell>
                                                    <TableCell width={250}>Stream Name</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    schoolClasses.class.streams.map((stream, index) =>
                                                        <TableRow key={stream}>
                                                            <TableCell align='center'>{index + 1}</TableCell>
                                                            <TableCell>{stream}</TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>

                                <div className="button">
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <Button fullWidth size="small" variant="outlined" startIcon={<ClearRounded/>}
                                                    onClick={() => {
                                                        setSchoolClasses({
                                                            ...schoolClasses,
                                                            class: {stream: "", class_name: "", streams: [], class_id: 0}
                                                        })
                                                    }}>
                                                Clear
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button fullWidth size="small" variant="contained" startIcon={<AddOutlined/>}
                                                    onClick={() => {
                                                        const in_classes = schoolClasses.classes
                                                            .map((_class) => (_class.class_id))
                                                            .includes(schoolClasses.class.class_id)
                                                        if (in_classes) {
                                                            setSchoolClasses({
                                                                ...schoolClasses,
                                                                classes: schoolClasses.classes.map((_class) =>
                                                                    _class.class_id === schoolClasses.class.class_id ?
                                                                        {
                                                                            class_id: schoolClasses.class.class_id,
                                                                            class_name: schoolClasses.class.class_name,
                                                                            streams: schoolClasses.class.streams
                                                                        } : _class
                                                                ),
                                                                class: {class_id: 0, class_name: "", streams: [], stream: ""}
                                                            })
                                                        } else {
                                                            setSchoolClasses({
                                                                ...schoolClasses,
                                                                classes: [...schoolClasses.classes, {
                                                                    class_id: schoolClasses.class.class_id,
                                                                    class_name: schoolClasses.class.class_name,
                                                                    streams: schoolClasses.class.streams
                                                                }],
                                                                class: {class_id: 0, class_name: "", streams: [], stream: ""}
                                                            })
                                                        }
                                                    }}>
                                                Save
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>

                <div className="button">
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Button fullWidth size="small" variant="outlined" startIcon={<CloseTwoTone/>}
                                    onClick={() => {
                                        setSchoolClasses({
                                            classes: [], school_id: 0, show: false,
                                            class: {class_id: 0, stream: "", streams: [], class_name: ""}
                                        })
                                    }}>
                                Close Window
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button fullWidth size="small" variant="contained" startIcon={<SaveTwoTone/>} onClick={save_classes}>
                                Save School Classes
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </BasicModal>
        </>
    )
}
