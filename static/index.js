// let signupForm = document.getElementById("signupForm");
// All elemets having id attribute, are directly attached to

// window object.
let loggedInUserInfoDiv = document.getElementById('logged-in-user-info');
let mainElement = document.querySelector('main');

getLoggedInUser().then((user) => {
    if (user) {
        initMessaging(user);
        clientSocket.emit('login',user.id);
    }
}).catch(err => {
    console.log(err);
    alert(err.message);
});

function initMessaging(user) {
    loggedInUser = user;
    loggedInUserInfoDiv.style.display = "flex";
    loggedInUserInfoDiv.querySelector('.title').innerText = user.name;
    document.getElementById('loginSignupBtns').style.display = "none";
    document.querySelector('main').style.display = "flex";
    document.getElementById('homeSection').style.display = "none";
    initConversationList();
}

function logout() {
    logoutUser().then((response) => {
        if (response.isLoggedIn === false) {
            loggedInUser = null;
            loggedInUserInfoDiv.style.display = "none";
            loggedInUserInfoDiv.querySelector('.title').innerText = "";
            document.getElementById('loginSignupBtns').style.display = "initial";
            document.querySelector('main').style.display = "none";
            document.getElementById('homeSection').style.display = "flex";
            let chatSection = eld('chatSection')
            if (chatSection) chatSection.remove();
        }
    }).catch((err) => {
        alert(err.message);
    })
}

loginForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    loginForm.querySelectorAll('.error').forEach(el => el.remove());

    let mobileNumberInput = loginForm.elements[0];
    let passwordInput = loginForm.elements[1];

    let errMessage = '';
    if (mobileNumberInput.value.length == 0)
        errMessage = "Mobile number required"
    else if (!(/^[5-9][0-9]{9}$/).test(mobileNumberInput.value))
        errMessage = "Invalid Mobile number"
    if (errMessage) displayInputError(mobileNumberInput, errMessage);

    if (passwordInput.value.length == 0)
        displayInputError(passwordInput, "Password required");

    if (loginForm.querySelectorAll('.error').length) return;

    dissableForm(loginForm);

    loginUser({ phone: mobileNumberInput.value, password: passwordInput.value })
        .then((user) => {
            $('#loginModal').modal('hide');
            initMessaging(user);
            enableForm(loginForm);
            clientSocket.emit('login',user.id);
        })
        .catch((err) => {
            enableForm(loginForm);
            alert(err.message);
        })
})

signupForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    signupForm.querySelectorAll('.error').forEach(el => el.remove());

    let nameInput = signupForm.elements[0];
    let mobileNumberInput = signupForm.elements[1];
    let passwordInput = signupForm.elements[2];
    let cnfPasswordInput = signupForm.elements[3];

    let errMessage = '';
    nameInput.value = nameInput.value.trim();
    if (nameInput.value.length == 0)
        errMessage = "Name Required"
    else if (!(/^[A-Za-z ]*$/).test(nameInput.value))
        errMessage = "Name must contain characters"
    else if (nameInput.value.length < 2)
        errMessage = "Name must contain 2 characters"
    else if (nameInput.value.length > 20)
        errMessage = "Name must contain less than 20 characters"
    if (errMessage) displayInputError(nameInput, errMessage);

    errMessage = '';
    if (mobileNumberInput.value.length == 0)
        errMessage = "Mobile number required"
    else if (!(/^[5-9][0-9]{9}$/).test(mobileNumberInput.value))
        errMessage = "Invalid Mobile number"
    if (errMessage) displayInputError(mobileNumberInput, errMessage);

    passwordInput.value = passwordInput.value.trim();
    if (passwordInput.value.length == 0)
        displayInputError(passwordInput, "Password required");

    errMessage = ''
    if (cnfPasswordInput.value.length == 0)
        errMessage = "Please confirm password";
    else if (cnfPasswordInput.value != passwordInput.value)
        errMessage = "Enter same password";
    if (errMessage) displayInputError(cnfPasswordInput, errMessage);

    if (signupForm.querySelectorAll('.error').length) return;

    let user = new User(0, nameInput.value, mobileNumberInput.value,
        passwordInput.value);

    dissableForm(signupForm);

    createUser(user)
        .then((user) => {
            $('#signupModal').modal('hide');
            initMessaging(user);
            enableForm(signupForm);
        })
        .catch((err) => {
            enableForm(signupForm);
            alert(err.message);
        })
})

function dissableForm(form) {
    Array.from(form.elements).forEach(el => el.setAttribute('disabled', 'true'));
}
function enableForm(form) {
    Array.from(form.elements).forEach(el => el.removeAttribute('disabled'));
}

function displayInputError(inputElement, errMessage) {
    inputElement.insertAdjacentHTML('afterend',
        `<small class="error text-danger">${errMessage}</small>`);
}

//To Get element by id
function eld(elementId) {
    return document.getElementById(elementId);
}


function addNewConversation() {
    let chatSection = eld('chatSection')
    if (chatSection) chatSection.remove();

    chatSectionHtml = `
        <div id="chatSection">
            <div id="messagingArea">
                <div class="input-group" style="width: 360px;margin: 33vh auto 0;">
                    <div class="input-group-prepend" >
                        <span class="input-group-text material-icons">phone</span>
                    </div>
                    <input class="form-control" type="text" style="width:318px" placeholder="Mobile Number .."
                        onkeyup="onNewMobileNumberInputKeyUp(this)" maxlength="10">
                    <small id="newMobileNumberHelp" class="form-text"></small>
                </div>
            </div>
            <div class="messaging-foot">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text material-icons">message</span>
                    </div>
                    <input id ="messageInput" class="form-control" type="text" disabled="true" 
                    placeholder="Type message here .." maxlength="400">
                </div>
                <button type="button" class="btn btn-light btn-sm btn-icon" 
                    onclick="sendFirstMessage()">
                    <span class="material-icons">send</span>
                </button>
            </div>
        </div>
    `;
    mainElement.insertAdjacentHTML('beforeend', chatSectionHtml);
}

function onNewMobileNumberInputKeyUp(mobileNumberInput) {
    let newMobileNumberHelp = eld('newMobileNumberHelp');
    let errMessage = '';
    newMobileNumberHelp.innerText = '';

    if (mobileNumberInput.value.length == 0)
        errMessage = "Mobile Number Required"
    else if (!(/^[5-9][0-9]{9}$/).test(mobileNumberInput.value))
        errMessage = "Invalid Mobile Number"
    else if (loggedInUser.phone == mobileNumberInput.value)
        errMessage = "Enter Recipient Mobile Number"

    if (errMessage) {
        newMobileNumberHelp.classList.add('text-danger');
        newMobileNumberHelp.innerText = errMessage;
        eld('messageInput').setAttribute('disabled', 'true');
        return;
    }

    selectedRecipient = null;
    selectedRecipient = loggedInUser.contacts.find(contact => contact.phone == mobileNumberInput.value);
    if (selectedRecipient) {
        populateMessages(selectedRecipient.id)
        return;
    }
    getUserByPhone(mobileNumberInput.value).then(user => {
        if (user) {
            newMobileNumberHelp.classList.remove('text-danger')
            newMobileNumberHelp.classList.add('text-success')
            eld('messageInput').removeAttribute('disabled');
            newMobileNumberHelp.innerText = user.name + ' #' + user.id;
            selectedRecipient = user
        }
    }).catch(err => {
        newMobileNumberHelp.innerText = err.message;
    });
}

function sendFirstMessage() {
    messageInput.value.trim();
    if (!messageInput.value) return;
    createMessage(messageInput.value).then(message => {
        selectedRecipient.messages = [message];
        loggedInUser.contacts.push(selectedRecipient);
        initConversation();
        populateMessages(selectedRecipient.id);
    }).catch(err => {
        alert(err.message);
        console.log(err);
    });
}

function initConversation() {
    let sentMessage = selectedRecipient.messages[0];
    let listItem = new ConversationListItem(selectedRecipient.imgUrl, selectedRecipient.name, sentMessage.createdAt, sentMessage.content, 0)
    let conversationsListItemHtml = `
        <li>
            <div class="person-icon" style="background-image: url('${selectedRecipient.imgUrl}');"></div>
            <div class="title">
                <div>${selectedRecipient.name}</div>
                <div style="font-size: 11px;">${listItem.recentMessage}</div>
            </div>
            <div class="time">
                <div style="font-size: 12px">${listItem.datetime}</div>
            </div>
        </li>`;
    conversationsList.insertAdjacentHTML('afterbegin', conversationsListItemHtml);
}

function initConversationList() {
    conversationsList.querySelectorAll('li').forEach(li => li.remove());
    let conversationsListItemHtml;
    let listItem;
    let recentMessage;
    if(!loggedInUser.contacts.length) return;
    loggedInUser.contacts.forEach(contact => {
        recentMessage = contact.messages[0];
        contact.messages.reverse();
        listItem = new ConversationListItem(contact.imgUrl, contact.name, recentMessage.createdAt, recentMessage.content, 0)
        conversationsListItemHtml = `
        <li onclick="populateMessages(${contact.id}, this)">
            <div class="person-icon" style="background-image: url('${listItem.imgUrl}');"></div>
            <div class="title">
                <div>${listItem.name}</div>
                <div style="font-size: 11px;">${listItem.recentMessage}</div>
            </div>
            <div class="time">
                <div style="font-size: 12px">${listItem.datetime}</div>
            </div>
        </li>`;
        conversationsList.insertAdjacentHTML('afterbegin', conversationsListItemHtml);
    });
    
    populateMessages(loggedInUser.contacts[loggedInUser.contacts.length - 1].id,
        conversationsList.firstElementChild)
}

function populateMessages(contactId, el) {
    conversationsList.querySelectorAll('li').forEach(li => li.style.background = "none")
    if (el) el.style.background = "#eee"

    selectedRecipient = loggedInUser.contacts.find(contact => contact.id == contactId);
    let messagesHtml = "";
    let chatSection = eld('chatSection')
    if (chatSection) chatSection.remove();

    selectedRecipient.messages.forEach(message => {
        if (message.senderId == loggedInUser.id) {
            messagesHtml += `<div class="msg-right">
            <div class="msg-text">${message.content}</div>
            <div class="person-icon"></div>
        </div>`
        } else {
            messagesHtml += `<div class="msg-left">
                <div class="person-icon"></div>
                <div class="msg-text">${message.content}</div>
            </div>`
        }
    });
    chatSectionHtml = `
        <div id="chatSection">
            <div class="messaging-head">
                <div class="person-icon"></div>
                <div class="title">${selectedRecipient.name}</div>
                <div class="dropleft">
                    <button type="button" class="btn btn-light btn-sm btn-icon" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <span class="material-icons">
                            more_vert
                        </span>
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Delete Conversation</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Separated link</a>
                    </div>
                </div>
            </div>
            <div id="messagingArea">
                ${messagesHtml}
            </div>
            <div class="messaging-foot">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text material-icons">message</span>
                    </div>
                    <input id ="messageInput" class="form-control" type="text" 
                    placeholder="Type message here .." maxlength="400">
                </div>
                <button type="button" class="btn btn-light btn-sm btn-icon" 
                    onclick="sendMessage()">
                    <span class="material-icons">send</span>
                </button>
            </div>
        </div>
    `;
    mainElement.insertAdjacentHTML('beforeend', chatSectionHtml);
}

let clientSocket = io();
// io("localhost:4500");

function sendMessage() {
    let message = new Message(0, loggedInUser.id, selectedRecipient.id, false, false, false, null, messageInput.value, false, false)
    messageInput.value = '';
    clientSocket.emit('message', message);
    selectedRecipient.messages.push(message);
    messagingArea.insertAdjacentHTML('beforeend',
        `<div class="msg-right">
        <div class="msg-text">${message.content}</div>
        <div class="person-icon"></div>
    </div>`
    );
}

clientSocket.on("messageRecieved",message=>{
    console.log(message);
    if(selectedRecipient.id == message.senderId){
        selectedRecipient.messages.push(message);
        messagingArea.insertAdjacentHTML('beforeend',`<div class="msg-left">
            <div class="person-icon"></div>
            <div class="msg-text">${message.content}</div>
        </div>`)
    }else{
        loggedInUser.contacts.find(contact=>contact.id == message.senderId).messages.push(message);
    }
})


$('#signupModal').on('show.bs.modal', (ev) => {
    $('#loginModal').modal('hide');
})

$('#signupModal').on('hide.bs.modal', (ev) => {
    signupForm.elements[0].value = null;
    signupForm.elements[1].value = null;
    signupForm.elements[2].value = null;
    signupForm.elements[3].value = null;
})
$('#loginModal').on('hide.bs.modal', (ev) => {
    loginForm.elements[0].value = null;
    loginForm.elements[1].value = null;
})