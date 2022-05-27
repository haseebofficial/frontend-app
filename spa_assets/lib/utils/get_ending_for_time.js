import { t } from "i18n";

export function getEndingForHours(number) {
    if (number > 100) {
        number = parseInt((((number / 100) % 1) * 100).toFixed(0), 10)
    }
    if (number > 20) {
        number = parseInt((((number / 10) % 1) * 10).toFixed(0), 10)
    }

    if (number === 1) {
        return t("layout.date.hour")
    } else if (number > 1 && number <= 4) {
        return t("layout.date.hours")
    } else {
        return t("layout.date.hours")
    }
}

export function getEndingForMinutes(number) {
    if (number > 100) {
        number = parseInt((((number / 100) % 1) * 100).toFixed(0), 10)
    }
    if (number > 20) {
        number = parseInt((((number / 10) % 1) * 10).toFixed(0), 10)
    }

    if (number === 1) {
        return t("layout.date.minute")
    } else if (number > 1 && number <= 4) {
        return t("layout.date.minutes")
    } else {
        return t("layout.date.minutes")
    }
}