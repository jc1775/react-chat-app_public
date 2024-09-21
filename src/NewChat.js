import { useEffect, useRef, useState } from "react";
import ContactTag from "./ContactTag";
import firebase from "./firebase"
import 'firesql/rx'; // <-- Important! Don't forget
import 'firebase/firestore';
import { useAuth } from './contexts/AuthContext'

const NewChat = (props) => {
    let chatMembers = props.chatGroup
    let setMinimizeEverything = props.setMinimizeEverything
    let minimizeEverything = props.minimizeEverything
    
    const startChattingButtonREF = useRef()
    const chatNameREF = useRef()
    const contactSearchREF = useRef()
    const chatMembersList = useRef()

    const [disableChatNameInput, setChatNameInputDisabled] = useState(true)
    const [chatNameInputPlaceholder, setChatNameInputPlaceholder] = useState("Add contacts to chat")
    const [isGroupChat, setIsGroupChat] = useState(false)

    const chatsRef = firebase.firestore().collection("chats")
    const usersRef = firebase.firestore().collection("users")

    const { currentUser } = useAuth()

    var contactsElements

    function handleSearch() {
        contactsElements = document.querySelector("div.contactsHolder").childNodes
        //console.log(contactsElements)
        contactsElements.forEach((contact) => {
            var contact_email = contact.getAttribute("contact-email")
            var contact_display_name = contact.getAttribute("contact-display-name")
            if ((!(contact_email.toLowerCase().includes(contactSearchREF.current.value.toLowerCase()))) && (!(contact_display_name.toLowerCase().includes(contactSearchREF.current.value.toLowerCase())))) {
                contact.style.display = "none"
            } else {
                contact.style.display = "block"
            }
        })
        //console.log(contactSearchREF.current.value)
    }

    function handleStartChat() {
        if (chatMembers.length === 0) {
            console.log("No contacts added")
        }  else if (chatNameREF.current.value === '') {
            console.log("No name added")
        } else if (chatNameREF.current.value.length > 30) {
            console.log("Name too long")
        } else {
            //startChattingButtonREF.current.style.transform = "translate3d(" + 1000 + "%, " + 0 + "px, 0)";
            var newChatRef = chatsRef.doc();
            var current = new Date();
            newChatRef.set({
                chatImage: 'logo192.png',
                chatName: chatNameREF.current.value,
                recentText: 'New Chat!',
                timeUpdated: current.toLocaleTimeString().slice(0,-6) + " " +  current.toLocaleTimeString().slice(-2),
                id: newChatRef.id,
                moderators: [currentUser.uid],
                timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
            })
            var chatMembersEmails = [currentUser.email]
            chatMembers.forEach((member) => {
                chatMembersEmails.push(member.getAttribute("contact-email"))
            })
            newChatRef.update({
                singleChat: isGroupChat ? false : chatMembersEmails,
            })
            usersRef.where("email", "in", chatMembersEmails).get().then((members) =>{
                members.forEach((member) => {
                    var memberRef = firebase.firestore().doc("users/"+member.data().uid)
                    console.log(member.data())
                    memberRef.update({
                        activeChats: firebase.firestore.FieldValue.arrayUnion(newChatRef.id) 
                    })
                })
            })
            setMinimizeEverything(true)
            //setReloadChats(true)
        }
    }

    useEffect(() => {
        if (chatMembers.length === 1) {
            chatNameREF.current.value = chatMembers[0].getAttribute("contact-display-name")
        } else if (chatMembers.length >= 2) {
            chatNameREF.current.value = ''
            setIsGroupChat(true)
            setChatNameInputDisabled(false)
            setChatNameInputPlaceholder("Enter group chat name")
            
        }
    },[chatMembers])

    useEffect(() => {
        chatNameREF.current.value = ''
        contactSearchREF.current.value = ''
        setIsGroupChat(false)
        contactsElements = document.querySelector("div.contactsHolder").childNodes
        contactsElements.forEach((ele) => {
            ele.style.display = "block"
        })
    },[minimizeEverything])
    
    return ( 
        
        <div className="newChat">
            
            <div className="contactSearch">
                <input type="text" placeholder="Find a contact..." className="search" ref={contactSearchREF} onChange={handleSearch}/>
                <button className="startSearch">o</button>
            </div>
            <div className="chatFormation" ref={chatMembersList}>
                
            </div>
            <div className="chatContext">
                <input disabled={disableChatNameInput} type="text" placeholder={chatNameInputPlaceholder} className="chatNameInput" ref={chatNameREF} />

                { isGroupChat && <h2>Group Chat Members</h2> } 
                <div className="tagHolder" style={ !isGroupChat ? {display:"none"} : {display: "flex"} } >
                    {chatMembers.map((member) => (
                        <ContactTag email={member.getAttribute("contact-email")} key={member.getAttribute("contact-email")} display_name={member.getAttribute('contact-display-name')}></ContactTag>
                    ))}
                </div>
            </div>
            <button className="startChatting" onClick={handleStartChat} ref={startChattingButtonREF} >Start Chatting! >>> </button>

            
        </div>
     );
}
 
export default NewChat;