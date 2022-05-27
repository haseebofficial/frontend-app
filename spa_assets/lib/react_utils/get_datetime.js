import { appendLeadingZero } from "utils/localize_date"
import { t } from 'i18n';

export default function getDatetimeResults(array) {
    let newArray
    newArray = array.map((arr) => {
        let year = Number(arr.since_date.substr(0, 4))
        let month = Number(arr.since_date.substr(5, 2))
        let day = Number(arr.since_date.substr(8, 2))
        let since_hour = arr.since_hour
        let to_hour = arr.to_hour
        let since_minutes = arr.since_minutes
        let to_minutes = arr.to_minutes
        let newTime = ((to_hour * 60) + to_minutes) - ((since_hour * 60) + since_minutes)
        let date = new Date(year, month - 1, day, since_hour, since_minutes)
        let totalSecondsFrom = date.getTime()
        let totalSecondsTo = totalSecondsFrom + (newTime * 60 * 1000)
        return {
            id: arr.id,
            year,
            month,
            day,
            timeHoursFrom: since_hour,
            timeMinutesFrom: since_minutes,
            timeHoursTo: to_hour,
            timeMinutesTo: to_minutes,
            time: newTime,
            totalSecondsFrom,
            totalSecondsTo,
            selectTimeString: `${appendLeadingZero(day)}/${appendLeadingZero(month)}/${year} - ${t("layout.date.from")} ${appendLeadingZero(since_hour)}:${appendLeadingZero(since_minutes)} ${t("layout.date.to")} ${appendLeadingZero(to_hour)}:${appendLeadingZero(to_minutes)}`,
            newInterval: {
                since: `${year}-${appendLeadingZero(month)}-${appendLeadingZero(day)} ${appendLeadingZero(since_hour)}:${appendLeadingZero(since_minutes)}`,
                to: `${year}-${appendLeadingZero(month)}-${appendLeadingZero(day)} ${appendLeadingZero(to_hour)}:${appendLeadingZero(to_minutes)}`
            },
        }
    })
    return newArray
}