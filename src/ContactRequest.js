import firebase from "./firebase"
import { FireSQL } from 'firesql';
import 'firesql/rx'; // <-- Important! Don't forget
import 'firebase/firestore';
import { useAuth } from "./contexts/AuthContext";

const ContactRequest = (props) => {
    let name = props.potentialContactName
    let image = props.potentialContactImage
    let currentUserInfo = props.currentUserInfo
    let id = props.uid
    let setReloadContacts = props.setReloadContacts

    console.log(id)
    const { currentUser } = useAuth()

    function handleDecline() {
        firebase.firestore().doc("users/" + id).update({
            contactInvites: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
            contactInvitesList: firebase.firestore.FieldValue.arrayRemove({
                contact_picture: currentUserInfo.contact_picture,
                display_name: currentUserInfo.display_name,
                uid: currentUser.uid
            })
        })
        firebase.firestore().doc("users/" + currentUser.uid).update({
            receivedContactInvites: firebase.firestore.FieldValue.arrayRemove(id),
            receivedContactInvitesList: firebase.firestore.FieldValue.arrayRemove({
                contact_picture: image,
                display_name: name,
                uid: id
            })
        })
    }

    function handleAccept() {
        firebase.firestore().doc("users/" + id).update({
            contactList: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
        })
        firebase.firestore().doc("users/" + currentUser.uid).update({
            contactList: firebase.firestore.FieldValue.arrayUnion(id)})
        setReloadContacts(true)
        handleDecline()
    }

    return (
    <div className="contactRequestItem">
        <img src={image} alt="" />
        <div className="contactRequest">
            <div className="contactRequestInfo">
                <div className="textAndButtons">
                    <p className="previewText">sent you a contact request</p>
                    <div className="acceptDeclineButtons">
                        <button onClick={handleAccept} className="accept">Accept</button>
                        <button onClick={handleDecline} className="decline">Decline</button>
                    </div>
                </div>
                    <div className="nameAndDate">
                        <p className="name">{name}</p>
                        <p className="date">5/12/21</p>
                    </div>
                </div>
        </div>
    </div>  
    
    );
}
 
export default ContactRequest;