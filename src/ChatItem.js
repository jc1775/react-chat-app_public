import { useAuth } from "./contexts/AuthContext"
import firebase from "./firebase"
import { FireSQL } from 'firesql';
import 'firesql/rx'; // <-- Important! Don't forget
import 'firebase/firestore';
import { useEffect, useState } from "react";

const ChatItem = (props) => {
    const { currentUser } = useAuth()
    let goToChat = props.goToChat
    let chatImage = props.chatImage
    const [ chatName, setChatName ] = useState(props.chatName) 
    let timeUpdated = props.timeUpdated
    let recentText = props.recentText
    let chatID = props.chatID
    let singleChat = props.singleChat

    useEffect(()=>{
        if (singleChat) {
            const otherMember = singleChat.filter(user => user !== currentUser.email)[0]
            var usersRef = firebase.firestore().collection("users").where("email","==", otherMember)
            usersRef.get().then((results) => {
                results.forEach((result) => {
                    var newChatName = result.data().display_name
                    setChatName(newChatName)

                })
            }) 
        }
    },[])

    return ( 
        <div className="chatItem">
            <img src={chatImage} alt="" />
            <button onClick={() => goToChat(chatID, chatName)} className="chatInfo" >
                <p className="previewText">{recentText}</p>
                <div className="nameAndDate">
                    <p className="name">{chatName}</p>
                    <p className="date">{timeUpdated}</p>
                </div>
            </button>
        </div>
     );
}
 
export default ChatItem;