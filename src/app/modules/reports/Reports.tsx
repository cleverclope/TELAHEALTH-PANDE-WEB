import React from "react";
import {SearchOutlined} from "@mui/icons-material";
import {Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Loader, MyDatePicker, MyInput, MySelect, ProgressModal} from "../../../utils/Components";
import moment from "moment";

interface Report {
    date: string
    school: string
    symptoms: number //the total number of any school Individuals with Covid-19 related Symptoms
    screens: number //the total number of Screened individuals at school
    referred: number //the total number of individuals Referred for testing
    positive: number //the total number of Positive Covid tests Cases
    active: number //the total number of Positive Covid tests Cases
    managed: number //total number of COVID 19 cases Managed at school
}

export default function Reports() {
    const [loader, setLoader] = React.useState<Loader>({open: false, title: ""})

    const [search, setSearch] = React.useState({min_date: '', max_date: '', school_id: 0, user_name: ''})
    const handle_search = (name: string, value: string | number) => {
        setSearch({...search, [name]: value})
    }

    const [reports, setReports] = React.useState(Array<Report>())
    const search_reports = () => {

    }

    return (
        <>
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
                    <div>
                        <MyInput title='Search by user name' value={search.user_name} name='user_name'
                                 onChange={handle_search} onPressEnter={search_reports}/>
                    </div>
                </div>

                <div className="search_buttons">
                    <Button variant="outlined" startIcon={<SearchOutlined/>} onClick={search_reports}>Search</Button>
                </div>
            </div>

            <div className="report_summary">
                <Grid container={true} spacing={1}>
                    <Grid item={true} xs={2}>
                        <div className="summary_container">
                            <div className="header">Total<br/>Symptomatic</div>
                            <div className="count">1,000</div>
                        </div>
                    </Grid>
                    <Grid item={true} xs={2}>
                        <div className="summary_container">
                            <div className="header">Total Screened<br/>at School</div>
                            <div className="count">2,034</div>
                        </div>
                    </Grid>
                    <Grid item={true} xs={2}>
                        <div className="summary_container">
                            <div className="header">Total Screened<br/>Referred</div>
                            <div className="count">1,456</div>
                        </div>
                    </Grid>
                    <Grid item={true} xs={2}>
                        <div className="summary_container">
                            <div className="header">Total Positive<br/>Cases</div>
                            <div className="count">768</div>
                        </div>
                    </Grid>
                    <Grid item={true} xs={2}>
                        <div className="summary_container">
                            <div className="header">Total Active<br/>Cases</div>
                            <div className="count">146</div>
                        </div>
                    </Grid>
                    <Grid item={true} xs={2}>
                        <div className="summary_container">
                            <div className="header">Total Managed<br/>at School</div>
                            <div className="count">100</div>
                        </div>
                    </Grid>
                </Grid>
            </div>

            <div className="table_container">
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={50} align={"center"}>No.</TableCell>
                                <TableCell width={120}>Report Date</TableCell>
                                <TableCell width={250}>School Name</TableCell>
                                <TableCell width={100} align='center'>Symptomatic</TableCell>
                                <TableCell width={100} align='center'>Total Screened</TableCell>
                                <TableCell width={100} align='center'>Total Referred</TableCell>
                                <TableCell width={100} align='center'>Total Positive</TableCell>
                                <TableCell width={100} align='center'>Total Active</TableCell>
                                <TableCell width={100} align='center'>Total Managed</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                reports.map((report, index) =>
                                    <TableRow key={index}>
                                        <TableCell align={"center"}>{index + 1}</TableCell>
                                        <TableCell>{moment(report.date).format("ddd MMM DD YYYY")}</TableCell>
                                        <TableCell>{report}</TableCell>
                                        <TableCell align='center'>{report.symptoms}</TableCell>
                                        <TableCell align='center'>{report.screens}</TableCell>
                                        <TableCell align='center'>{report.referred}</TableCell>
                                        <TableCell align='center'>{report.positive}</TableCell>
                                        <TableCell align='center'>{report.active}</TableCell>
                                        <TableCell align='center'>{report.managed}</TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}
