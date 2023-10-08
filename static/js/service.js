let loggedInUser = null;
let selectedRecipient = null;

function createUser(user) {
    return sendXhr('http://localhost:4500/create-user', 'POST', user);
}
function getLoggedInUser() {
    return sendXhr('http://localhost:4500/get-logged-in-user', 'GET');
}
function loginUser(credentials) {
    return sendXhr('http://localhost:4500/login-user', 'POST', credentials);
}
function logoutUser() {
    return sendXhr('http://localhost:4500/logout-user', 'GET');
}
function getUserByPhone(phoneNumber){
    return sendXhr(`http://localhost:4500/get-user-by-phone/${phoneNumber}`, 'GET');
}
function createMessage(msgText) {
    return sendXhr('http://localhost:4500/create-message', 'POST', {recieverId: selectedRecipient.id, content: msgText });
}

function sendXhr(url, method, data) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);        
        xhr.responseType = 'json';

        xhr.onload = () => {
            if (xhr.status < 400) 
                resolve(xhr.response);
            else 
                console.log(url+" , " + xhr.response);
                reject(xhr.response)
        }

        xhr.onerror = (ev) => reject(ev);
        xhr.ontimeout = (ev) => reject(ev);

        if (data) {
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
        else xhr.send();
    });
}
