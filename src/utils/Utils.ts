import moment from "moment";

export class Utils {
    static post_params(data: any) {
        const form = new FormData();
        Object.entries(data).forEach(([prop, val]) => {
            if (val !== null) {
                form.append(prop, val as string)
            }
        })
        return form
    }

    static get_date_from_string(date: string) {
        if (date === "") {
            return new Date()
        } else {
            const parts = date.split('-')
            return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
        }
    }

    static date_to_string(date: Date) {
        return moment(date).format("YYYY-MM-DD")
    }
}
