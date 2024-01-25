export function napRovidites(datum: Date, locale: Intl.LocalesArgument): string {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        // year: 'numeric',
        // month: 'long',
        // day: 'numeric',
    };
    return datum.toLocaleDateString(locale ? locale : undefined, options)
}

export function YYYYMMDDToDate(datum: string, ora?: number, perc?: number): Date {
    if (datum) {
        return new Date(parseInt(datum.substring(0, 4)), parseInt(datum.substring(4, 6)) - 1, parseInt(datum.substring(6, 8)), (ora ? ora : 0), (perc ? perc : 0));
    } else {
        return new Date();
    }
}

export function dateToYYYYMMDD(datum: Date): string {
    if (datum && datum instanceof Date) {
        return datum.toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replaceAll('.', '').replaceAll(' ', '');
    } else {
        return null;
    }
}