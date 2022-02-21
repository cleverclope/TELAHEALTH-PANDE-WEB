import React from "react";
import {Loader, MyInput, MySelect, ProgressModal} from "../../../utils/Components";
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from "@mui/material";
import {SearchOutlined} from "@mui/icons-material";

interface Result {
    results_id: number
    student_id: number
    student_name: string
    school_id: number
    school_name: string
    temperature: number
    covid_symptoms: string[]
    onset_date: string
    actions_taken: string
    results_date: string
    where_managed: {} | ''
}

export default function Results() {
    const [loader, setLoader] = React.useState<Loader>({open: false, title: ""})

    const [search, setSearch] = React.useState({student_name: '', school_id: 0})
    const handle_search = (name: string, value: string | number) => {
        setSearch({...search, [name]: value})
    }

    const [results, setResults] = React.useState(Array<Result>())

    const search_results = () => {

    }

    return (
        <>
            <ProgressModal title={loader.title} open={loader.open}/>

            <div className="table_header">
                <div className='search_components'>
                    <div>
                        <MySelect value={search.school_id} name="school_id" onChange={handle_search}
                                  options={[{text: 'All Schools', value: 0}]}/>
                    </div>
                    <div>
                        <MyInput title='Student name' value={search.student_name} name='student_name'
                                 onChange={handle_search} onPressEnter={search_results}/>
                    </div>
                </div>
                <div className="search_buttons">
                    <Button variant="outlined" startIcon={<SearchOutlined/>} onClick={search_results}>Search</Button>
                </div>
            </div>

            {/*
    actions_taken: string
    : string
    where_managed: {} | ''
            */}

            <div className="table_container">
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={50} align={"center"}>No.</TableCell>
                                <TableCell width={200}>Student Name</TableCell>
                                <TableCell width={250}>School Name</TableCell>
                                <TableCell width={120}>Results Date</TableCell>
                                <TableCell width={70} align='center'>Temp <sup>o</sup>C</TableCell>
                                <TableCell width={120}>Covid Signs</TableCell>
                                <TableCell width={120} align='center'>Onset Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                results.map((result, index) =>
                                    <TableRow
                                        key={result.results_id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                        <TableCell align={"center"}>{index + 1}</TableCell>
                                        <TableCell>{result.student_name}</TableCell>
                                        <TableCell>{result.school_name}</TableCell>
                                        <TableCell>{result.results_date}</TableCell>
                                        <TableCell align='center'>{result.temperature}</TableCell>
                                        <TableCell>
                                            {
                                                result.covid_symptoms.length === 0 ?
                                                    'No symptoms' : result.covid_symptoms.length + ' Symptoms'
                                            }
                                        </TableCell>
                                        <TableCell>{result.onset_date}</TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>

            <div className="table_footer">
                <TablePagination
                    rowsPerPageOptions={[100]}
                    component="div"
                    count={results.length}
                    rowsPerPage={100}
                    page={1}
                    onPageChange={(event, page) => {

                    }}
                    onRowsPerPageChange={(event) => {

                    }}
                />
            </div>
        </>
    )
}
