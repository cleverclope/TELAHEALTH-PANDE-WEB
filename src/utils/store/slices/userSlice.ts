import {createSlice, Draft, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "../store"

export interface UserRights {
    [key: string]: number[]
}

export interface Staff {
    user_id: number
    office_id: number
    office_name: string
    first_name: string
    last_name: string
}

const initial_staff: Staff = {
    first_name: "", last_name: "", office_id: 0, user_id: 0, office_name: ''
}

export interface User {
    staff: Staff
    roles: {
        user_roles: UserRights
        report_rights: string[]
    }
    user_token: string
}

const initial_user: User = {
    roles: {report_rights: [], user_roles: {},},
    staff: initial_staff, user_token: ""
}

type UserState = {
    user: User
    counter: number
    fcm: {
        token: string
        saved: boolean
    }
}

const initialState: UserState = {
    user: initial_user, counter: 0, fcm: {token: "", saved: false},
}

const userSlice = createSlice({
    name: 'user', initialState: initialState,
    reducers: {
        loginUser: (state: Draft<typeof initialState>, action: PayloadAction<User>) => {
            state.user = action.payload
            state.fcm.saved = false
        },
        logoutUser: (state: Draft<typeof initialState>) => {
            state.user = initial_user
            state.fcm.saved = false
        },
        lockUser: (state: Draft<typeof initialState>) => {
            state.user.user_token = ""
        },
        updateFCM: (state: Draft<typeof initialState>, action: PayloadAction<{ token: string, saved: boolean }>) => {
            state.fcm = action.payload
        },
        updateCounter: (state: Draft<typeof initialState>, action: PayloadAction<number>) => {
            state.counter = action.payload
        },
        updateReportRights: (state: Draft<typeof initialState>, action: PayloadAction<string[]>) => {
            state.user.roles.report_rights = action.payload
        },
        updateUserRoles: (state: Draft<typeof initialState>, action: PayloadAction<UserRights>) => {
            state.user.roles.user_roles = action.payload
        },
    },
});

// Selectors
export const getStaff = (state: RootState) => state.user.user
export const getCounter = (state: RootState) => state.user.counter
export const getFCM = (state: RootState) => state.user.fcm

// Reducers and actions
export const {loginUser, logoutUser, updateCounter, updateFCM, lockUser, updateReportRights, updateUserRoles} = userSlice.actions

export default userSlice.reducer
