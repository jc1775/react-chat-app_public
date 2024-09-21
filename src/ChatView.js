import Message from "./Message"
import { useEffect, useRef, useState } from 'react';
import { useAuth } from './contexts/AuthContext'

const ChatView = (props) => {
    let currentUserInfo = props.currentUserInfo
    let messageList = props.messageList
    const newMessageList = Object.keys(messageList).map((key)=> [Number(key), messageList[key]])
    const { currentUser } = useAuth()
    const [keyboardOpen, isKeyboardOpen] = useState(false)
    const messageHolderREF = useRef()
    const sendMessagesHolderREF = useRef()
    let newSentMessage = props.newSentMessage
    let chatID = props.chatID

    useEffect(() => {
        var messageArea = document.querySelector("div.sendMessage");
        var messageTextElement = document.querySelector("textarea.messageInput");
        messageTextElement.addEventListener("focus",moveTextArea, false);
        messageTextElement.addEventListener("blur",moveTextAreaBack, false);
        function moveTextArea(){
            isKeyboardOpen(true)
            console.log(sendMessagesHolderREF.current.offsetTop)
        }
        function moveTextAreaBack(){
            isKeyboardOpen(false)
        }
    },[])

    function getText(){
        var textInput =  document.querySelector("textarea.messageInput")
        var text = textInput.value
        textInput.value = ''
        return text
    }

    return ( 
        <div className="chatView">
            <div className="messages" ref={messageHolderREF}>
                {newMessageList.map((message) => (
                    <Message 
                    key={message[1].messageID} 
                    type={ message[1].authorID === currentUser.uid ? 'sent': 'received' } 
                    author={message[1].author} 
                    messageContent={message[1].content} 
                    time={message[1].timestamp.toDate().toLocaleTimeString().slice(0,-6) + " " +  message[1].timestamp.toDate().toLocaleTimeString().slice(-2)
                    }></Message>
                ))}
            </div>
            <div className="sendMessage" ref={sendMessagesHolderREF}>
                <div className="tempHolder">
                    <textarea wrap="hard" placeholder='Type a message' type="text" className="messageInput" />
                <button className="sendMessageButton" onMouseDown={(e) => newSentMessage(e, [{chatID},{authorID:currentUser.uid ,author: currentUserInfo.display_name, time: '1:25 PM', content:getText()}])}> 
                    <img src="message.svg" alt="" />
                </button>
                </div>
                
                {keyboardOpen && <div className="keyboardPadding"></div>}
                
            </div>
        </div>
     );
}
 
export default ChatView;