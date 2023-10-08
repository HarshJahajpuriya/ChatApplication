class User{
    constructor(id, name, phone, password, imgUrl, status, sentMessages, recievedMessages){
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.password = password;
        this.imgUrl = imgUrl;
        this.status = status;
        this.sentMessages = sentMessages;
        this.recievedMessages = recievedMessages;
    }
}

class Message{
    constructor(id, senderId, recieverId, isArivedAtServer, 
        isDelivered, isSeen, createdAt, content,
        isDeletedBySender, isDeletedByReciever
    ){
        this.id = id; 
        this.content = content; 
        this.isArivedAtServer = isArivedAtServer;  
        this.isDelivered = isDelivered; 
        this.isSeen = isSeen; 
        this.isDeletedByReciever = isDeletedByReciever; 
        this.senderId = senderId; 
        this.recieverId = recieverId; 
        this.createdAt = createdAt; 
        this.isDeletedBySender = isDeletedBySender; 
    }
}

class ConversationListItem{
    constructor(imgUrl, name, datetime, recentMessage, newMessagesCount){
        this.imgUrl = imgUrl;
        this.name = name;
        this.datetime = formatDateTime(datetime);
        this.recentMessage = limitStr(recentMessage,29);
        this.newMessagesCount = newMessagesCount;
    }
}