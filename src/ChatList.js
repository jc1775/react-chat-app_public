import ChatItem from './ChatItem'
import ContactRequest from './ContactRequest'
import {useEffect, useState} from 'react';

const ChatList = (props) => {
    let chats = props.chats
    let goToChat = props.goToChat
    let contactRequests = props.contactRequests
    let currentUserInfo = props.currentUserInfo
    let setReloadContacts = props.setReloadContacts

    return ( 
        <div className="chatList">
            <div className="contactRequestHolder">
            { contactRequests && contactRequests.map((request) =>(
                <ContactRequest setReloadContacts={setReloadContacts} currentUserInfo={currentUserInfo} key={request.uid} uid={request.uid} potentialContactName={request.display_name} potentialContactImage={request.contact_picture}> </ContactRequest>
            ))}
            </div>
            {chats.map((chat) => (
                <ChatItem singleChat={chat.singleChat} goToChat={goToChat} key={chat.id} chatID={chat.id} chatImage={chat.chatImage} chatName={chat.chatName} recentText={chat.recentText} timeUpdated={chat.timeUpdated}></ChatItem>
            ))}
        </div>
     );
}
 
export default ChatList;