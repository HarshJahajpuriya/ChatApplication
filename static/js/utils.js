function limitStr(str, limit) {
    if(str.length > limit && limit>3){
        return str.substr(0, limit-3)+"...";
    }
    return str;
}

function formatDateTime(dateTimeStr){
    return new Date(dateTimeStr).toLocaleString('en-us', {hour: '2-digit', minute:'2-digit'})
}