import React, {PropsWithChildren} from "react";
import {Alert, Backdrop, CircularProgress, MenuItem, Modal, Snackbar, TextField} from "@mui/material";
import DateAdapter from "@mui/lab/AdapterMoment";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import {Utils} from "./Utils";

export function FormHeader(params: { title: string }) {
    return (
        <div>
            <label style={{fontWeight: "bold", fontSize: '14px', color: '#000000'}}>{params.title}</label>
        </div>
    )
}

export function MyInput(params: {
    placeholder?: string, value: string, name: string, onChange?: (name: string, value: string) => void,
    onPressEnter?: () => void, title?: string, disabled?: boolean
}) {
    return (
        <TextField
            label={params.title} id={"txt_" + params.name} size="small" helperText={params.placeholder}
            value={params.value} fullWidth={true} variant="outlined" disabled={params.disabled}
            onChange={(event) => {
                if (params.onChange) {
                    params.onChange(params.name, event.target.value)
                }
            }}
        />
    )
}

interface SelectOption {
    text: string
    value: string | number
}

export function MySelect(params: {
    value: string | number, options: SelectOption[], name: string,
    onChange?: (name: string, value: string | number, index: number) => void, title?: string, prompt?: string
}) {
    return (
        <TextField
            id={"select_" + params.name} select={true} label={params.title} value={params.value} helperText={params.prompt}
            fullWidth={true} variant="outlined" size="small"
            onChange={(event) => {
                let _index = -1
                for (let index = 0; index < params.options.length && _index === -1; index++) {
                    if (params.options[index].value === event.target.value) {
                        _index = index
                    }
                }
                params.onChange && params.onChange(params.name, event.target.value, _index)
            }}>
            {
                params.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>
                ))
            }
        </TextField>
    )
}

interface MyAlertProps {
    message: string
    severity: 'success' | 'error' | 'info'
    open: boolean
}

export const initial_alert: MyAlertProps = {severity: 'success', message: '', open: false}

export function ShowAlert(params: {
    open: boolean, close: () => void, message: string, severity: 'success' | 'error' | 'info'
}) {
    return (
        <Snackbar open={params.open} autoHideDuration={3000} onClose={params.close}
                  anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
            <Alert onClose={params.close} severity={params.severity} sx={{width: '100%'}}>{params.message}</Alert>
        </Snackbar>
    )
}

export default function BasicModal(params: PropsWithChildren<{ open: boolean, close?: () => void, className?: string }>) {
    return (
        <Modal
            open={params.open} onClose={() => params.close && params.close()}
            aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <div className={`modal_container ${params.className && params.className}`}>
                {params.children}
            </div>
        </Modal>
    )
}

export interface Loader {
    title: string
    open: boolean
}

export function ProgressModal(params: Loader) {
    return (
        <Backdrop sx={{color: '#FFFFFF', zIndex: (theme) => theme.zIndex.drawer + 10000}} open={params.open}>
            <CircularProgress color="inherit"/>
        </Backdrop>
    )
}

export function MyDatePicker(params: {
    date: string, setDate: (name: string, value: string) => void,
    name: string, max_date?: string, min_date?: string, label: string
}) {
    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
                views={['day']} label={params.label} value={Utils.get_date_from_string(params.date)}
                onChange={(newValue) => {
                    if (newValue !== null) {
                        params.setDate(params.name, Utils.date_to_string(newValue))
                    }
                }}
                renderInput={(params) => <TextField size="small" {...params} helperText={null}/>}
            />
        </LocalizationProvider>
    )
}
