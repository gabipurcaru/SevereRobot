/**
 * Site-wide utilities.
 */

require('datejs');

exports.date_format = function(date) {
    date = new Date(date);
    var in_future = false;
    if(date > Date.now()) {
        in_future = true;
    }
    if(date.isToday()) {
        var seconds = Math.abs((Date.now() - date) / 1000);
        var formatted;
        if(seconds < 60) {
            formatted = parseInt(seconds) + " seconds";
        } else if(seconds < 3600) {
            formatted = parseInt(seconds/60) + " minutes";
        } else {
            formatted = parseInt(seconds/3600) + " hours";
        }
        if(in_future) {
            return "in " + formatted;
        } else {
            return formatted + " ago";
        }
    } else if(date.isSameDay(Date.parse('yesterday'))) { 
        return "yesterday at " + date.toString('HH:mm');
    } else if(date.isSameDay(Date.parse('tomorrow'))) {
        return "tomorrow at " + date.toString('HH:mm');
    } else if(date.is().same().year()) {
        return date.toString("MMMM dS") + " at " + date.toString("HH:mm")
    } else {
        return date.toString("MMMM dS, yyyy HH:mm");
    }
};
