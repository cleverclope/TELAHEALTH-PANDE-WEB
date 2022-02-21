import axios from "axios";
import {Utils} from "./Utils";

export class Requests {
    //static BASE_URL = "http://127.0.0.1:8003/";
    //static BASE_URL = "http://192.168.43.205:8003/";
    static BASE_URL = "http://192.168.43.210:8003/";

    static update_fcm_token(data: { fcm_token: string }) {
        return axios({method: 'post', url: 'users/fcm_token', data: Utils.post_params(data)});
    }

    static save_school(data: {
        school_id: number, school_code: string, school_name: string, school_contacts: string, facility_contacts: string,
        section: 'Day' | 'Boarding' | 'Day & Boarding', district: string, sub_parish: string, parish: string, covid_facility: string,
    }) {
        return axios({method: 'post', url: 'schools/save', data: Utils.post_params(data)});
    }

    static save_classes(data: { school_id: number, classes: string }) {
        return axios({method: 'post', url: 'schools/classes', data: Utils.post_params(data)});
    }

    static get_schools(params: { school_name: string }) {
        return axios({method: 'get', url: 'schools/get', params: params});
    }

    static save_student(params: {
        last_name: string, first_name: string, face_gender: 'Male' | 'Female', nin_number: string, date_of_birth: string,
        user_id: number, school_id: number, caretaker_name: string, caretaker_contact: string, class_id: number, class_stream: string,
    }) {
        return axios({method: 'post', url: 'users/students/save', data: Utils.post_params(params)});
    }

    static get_students(params: { school_id: number, class_id: number, source: 'admin' }) {
        return axios({method: 'get', url: 'users/students/get', params: params});
    }

    static save_staff(params: {
        last_name: string, first_name: string, face_gender: 'Male' | 'Female', nin_number: string, date_of_birth: string,
        user_id: number, school_id: number, mobile_contact: string, email_address: string
    }) {
        return axios({method: 'post', url: 'users/staff/save', data: Utils.post_params(params)});
    }

    static get_staff(params: { school_id: number, source: 'admin' }) {
        return axios({method: 'get', url: 'users/staff/get', params: params});
    }

    static get_attendances(params: {
        school_id: number, class_id: number, type: 'student' | 'staff' | 'all', min_date: string, max_date: string
    }) {
        return axios({method: 'get', url: 'users/attendance/lists', params: params});
    }
}
