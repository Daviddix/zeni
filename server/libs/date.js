/**
 * Returns the start and end Date objects for a given period.
 * @param {'today'|'week'|'month'} period - The period for which to get the date range.
 * @returns {{start: Date, end: Date}} An object with 'start' and 'end' Date properties.
 */
// Helper function to get start/end datetimes for Firestore queries
export function getDateRange(period) {
    const now = new Date();
    let startDate = new Date();

    // Reset time to the start of the current day (for consistency)
    startDate.setHours(0, 0, 0, 0);

    switch (period) {
        case 'today':
            // startDate is already set to 00:00:00 today
            break;
        case 'week':
            // Get the date for the start of the current week (Sunday or Monday, depending on locale)
            // Adjusting for Sunday start (0) to match common database practice:
            const dayOfWeek = startDate.getDay(); // 0 is Sunday, 1 is Monday...
            startDate.setDate(startDate.getDate() - dayOfWeek);
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'month':
            // Set the date to the first day of the current month
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
            break;
        default:
            throw new Error(`Invalid period specified: ${period}`);
    }
    
    // The end date is always the moment the query runs (Date.now())
    return { 
        start: startDate, 
        end: now 
    };
}