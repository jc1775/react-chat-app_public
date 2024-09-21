import ContactsBar from './ContactsBar'
import ChatList from './ChatList'
import ChatView from './ChatView'
import Swipe, { SwipeItem } from 'swipejs/react';
import {useEffect, useState} from 'react';
import NewChat from './NewChat';
import firebase from "./firebase"
import { FireSQL } from 'firesql';
import 'firesql/rx'; // <-- Important! Don't forget
import 'firebase/firestore';
import { useAuth } from './contexts/AuthContext'
import AddContact from './AddContact';

const Dashboard = (props) => {


    let swipeEl;
    let currentUserInfo = props.currentUserInfo
    let setCurrentUserInfo = props.setCurrentUserInfo

    const [colourClass0, setColour0] = useState('selected');
    const [colourClass1, setColour1] = useState('');
    const [colourClass2, setColour2] = useState('');
    const [viewMessages, setMessages] = useState([]);
    const [chatName, setChatName] = useState('Empty');
    const [chatSelected, isChatSelected] = useState(false)

    const [chatID, setChatID] = useState('');
    const [chats ,setChats] = useState([]);
    const [contactRequests, setContactRequests] = useState(false);
    const [allUsers ,setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [chatMembers, setChatMembers] = useState([])
    const [reloadContacts, setReloadContacts] = useState(false)
    const [minimizeEverything, setMinimizeEverything] = useState(false)

    const MESSAGESref = firebase.firestore().collection("messages")
    const fireSQL = new FireSQL(firebase.firestore())
    const { currentUser } = useAuth()

    var usersRef
    var userRef
    var usersActiveChats = []
    var userContactList = []
    var currentContactList = []

    useEffect(()=>{
        if (reloadContacts) {
            console.log("Reloading Contacts..........")
            setReloadContacts(false)
            usersRef = firebase.firestore().collection("users")
            populateContactsList()
        }
    },[reloadContacts])

    useEffect(() =>{
        
        userRef = firebase.firestore().doc("users/" + currentUser.uid)
        usersRef = firebase.firestore().collection("users")
        getUserInfo()
        getContactRequests()
        populateActiveChats()
        populateContactsList()
    },[])

    async function getUserInfo() {
        await userRef.onSnapshot((userInfo) => {
            setCurrentUserInfo(userInfo.data())
            if (currentContactList === []) {
                currentContactList = userInfo.data().contactList
            } else if (currentContactList !== userInfo.data().contactList) {
                currentContactList = userInfo.data().contactList
                setReloadContacts(true)
            }
        })
    }

    async function populateContactsList(){
        await firebase.firestore().doc("users/" + currentUser.uid).get().then((result) => {
            userContactList = result.data().contactList
        })

        if (userContactList.length !== 0) {
            await usersRef.where("uid","in", userContactList).onSnapshot((usersDoc) => {
                var foundUsers = []
                usersDoc.forEach((doc) => {
                    if (doc.data().email !== currentUser.email) {
                        foundUsers.push(doc.data())
                    }
                })
                setAllUsers(foundUsers)
            })
        }
        
    }

    function populateActiveChats() {
        console.log("Trying to get active chat list")
        var currentUserIDCLEANED = "'" + currentUser.uid + "'"
        console.log(currentUserIDCLEANED)
        const usersChats$ = fireSQL.rxQuery(`
            SELECT activeChats
            FROM users
            WHERE uid = (`+ currentUserIDCLEANED +`)`
        );
        usersChats$.subscribe(results =>{
            console.log(results)
            usersActiveChats = results[0].activeChats
            if (usersActiveChats.toString() !== '[object Object]') {
                getChats()        
            } else{
                setIsLoading(false)
            }
        })
    }

    const getChats = () =>{
        console.log("Trying to get chats")
        console.log(usersActiveChats.toString())
        var usersActiveChatsCLEANED = "'" + usersActiveChats.join("','") + "'";
        const chats$ = fireSQL.rxQuery(`
            SELECT *
            FROM chats
            WHERE id IN (`+ usersActiveChatsCLEANED +`)
            ORDER BY timestamp DESC`
        );
        chats$.subscribe(results => {
            console.log("Subscribing to chats")
            var newResults = [...results]
            setChats(newResults)
            setIsLoading(false)
        });
    }

    const getContactRequests = () =>{
        console.log("Trying to get contactRequests")
        var cleanUID = "'" + currentUser.uid + "'"
        const conactrequests$ = fireSQL.rxQuery(`
            SELECT receivedContactInvitesList
            FROM users
            WHERE uid = (`+ cleanUID  +`)`
        );
        conactrequests$.subscribe(results => {
            console.log("Subscribing to contactRequests")
            if (typeof results[0] !== 'undefined') {
                var results2 = results[0].receivedContactInvitesList
                var newResults = [...results2]
                setContactRequests(newResults)
            }
            
        });
    }

    const goToChat = (id, cName) => {    
        isChatSelected(true) 
        swipeEl.slide(1,500)
        setChatName(cName)
        console.log(cName)
        var chatID = id
        var chatMessages
        console.log("Trying to get messages for: ", chatID)
        var chatIDCLEANED = "'"+ chatID + "'"
        setIsLoading(true)
        const messages$ = fireSQL.rxQuery(`
            SELECT *
            FROM messages
            WHERE chatID =` + chatIDCLEANED +`
            ORDER BY timestamp`
        );
        messages$.subscribe(results => {
        console.log(results)
        chatMessages = results
        setMessages(chatMessages)
        setChatID(chatID)
        setIsLoading(false)
        chatScrollToBottom()
        });
    }
    
    function newSentMessage(e, [id, messageContent], callback = refreshMessageList) {
        e.preventDefault()
        if (messageContent.content.replace(/ /g,'') === '' ) {
            console.log("blank")
        } else {
            var chatID = id.chatID
            var chatMessages
            var chatIDCLEANED = "'"+ chatID + "'"
            const messagesPromiseInit = fireSQL.query(`
                SELECT *
                FROM messages
                WHERE chatID =` + chatIDCLEANED
            );
            messagesPromiseInit.then(messages => {
                console.log(messages)
                chatMessages = messages
                var current = new Date();
                messageContent.time = current.toLocaleTimeString().slice(0,-6) + " " +  current.toLocaleTimeString().slice(-2)
                messageContent.messageID = chatMessages.length + 1
                messageContent.chatID = chatID
                messageContent.timestamp = firebase.firestore.Timestamp.fromDate(new Date())
                MESSAGESref.add(messageContent)
                var currentChatRef = firebase.firestore().doc("chats/"+chatID)
                var recentTextContent = messageContent.author + ": " + messageContent.content
                if (recentTextContent.length > 40) {
                    recentTextContent = recentTextContent.slice(0,37) + "..."
                }
                currentChatRef.update({
                    recentText: recentTextContent,
                    timeUpdated: messageContent.time,
                    timestamp: firebase.firestore.Timestamp.fromDate(new Date())
                })
                const messagesPromiseEnd = fireSQL.query(`
                    SELECT *
                    FROM messages
                    WHERE chatID =` + chatIDCLEANED +`
                    ORDER BY timestamp`
                );

                messagesPromiseEnd.then(messages => {
                    console.log(messages)
                    chatMessages = messages
                    //callback(chatMessages)
                });
            });

        } 
    }

    function refreshMessageList(chatMessages){
        let chatMessagesNew = [...chatMessages]
        setMessages(chatMessagesNew)
        console.log("Messages refreshed")
        chatScrollToBottom()
    }

    function chatScrollToBottom(){
        setTimeout(function(){
            var objDiv = document.querySelector("div.messages")
            objDiv.scrollTop = objDiv.scrollHeight;
            console.log("Chat Scrolled")
        },100)
        
    }

    const goToChatBasic = () => {
        swipeEl.slide(1,500)
    }

    const changeButtonColour = (index) => {
        var slideIndex = index
        var messageTextElement = document.querySelector("textarea.messageInput");
        if (slideIndex === 0) {
            setColour0('selected')
            setColour1('')
            setColour2('')
            messageTextElement.blur()
        } else if (slideIndex === 1) {
            setColour1('selected')
            setColour0('')
            setColour2('')
        }else if (slideIndex === 2) {
            setColour2('selected')
            setColour1('')
            setColour0('')
            messageTextElement.blur()
        }
    }      

    return ( 
        <div className="dashboardWindow">
            <ContactsBar setMinimizeEverything={setMinimizeEverything} minimizeEverything={minimizeEverything} setReloadContacts={setReloadContacts} setChatMembers={setChatMembers} allUsers={allUsers}></ContactsBar>
            <NewChat minimizeEverything={minimizeEverything} setMinimizeEverything={setMinimizeEverything} chatGroup={chatMembers}></NewChat>
            <div>
            <nav className="dashButtons">
                <button style={chatSelected ? {} : {width: "300%"} } className={colourClass0} id='chats' onClick={() => swipeEl.slide(0,500)}>CHATS</button>
                <button style={chatSelected ? {} : {display: "none"} } className={colourClass1} id='chat-messages' onClick={goToChatBasic} chatid={chatID}>{chatName}</button>
                <button style={chatSelected ? {} : {display: "none"} } className={colourClass2} id='chat-tools' onClick={() => swipeEl.slide(2,500)}>CHAT_TOOLS</button>
            </nav>
            { isLoading && <div className="loading" ><img src="loader.svg" alt="" /></div>}
            <Swipe ref={o => swipeEl = o} callback={changeButtonColour} startSlide={0} auto={0} style={ chatSelected ? {pointerEvents: "all"} : {pointerEvents: "none"} }  >
                <SwipeItem>
                    <ChatList setReloadContacts={setReloadContacts} currentUserInfo={currentUserInfo} contactRequests={contactRequests} goToChat={goToChat} chats={chats}></ChatList>
                </SwipeItem>
                <SwipeItem style={chatSelected ? {} : {display: "none"} }>
                    <ChatView currentUserInfo={currentUserInfo} newSentMessage={newSentMessage} messageList={viewMessages} chatID={chatID}></ChatView>
                </SwipeItem>
                <SwipeItem>
                </SwipeItem>

            </Swipe>            
            </div>
        </div>
     );
}


export default Dashboard;