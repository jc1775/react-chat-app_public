import { useEffect, useRef, useState } from "react";
import firebase from "./firebase"
import { FireSQL } from 'firesql';
import { useAuth } from "./contexts/AuthContext";

const AddContact = (props) => {
    let setAddingContact = props.setAddingContact
    let currentUserInfo = props.currentUserInfo
    const [isSearching, setIsSearching] = useState(false)
    const searchStringREF = useRef()
    const addContactREF = useRef()
    const usersRef = firebase.firestore().collection("users")
    const [contactName, setContactName] = useState()
    const [foundContactSTATE, setFoundContact] = useState()
    
    const [contactEmail, setContactEmail] = useState()
    const [contactPicture, setContactPicture] = useState()
    const [error, setError] = useState('')
    const [isError, setIsError] = useState(false)
    const {currentUser} = useAuth()
    var searchString
    var foundContact

    function handleTryAgain() {
        setIsSearching(false)
        setIsError(false)
        setError("")
    }

    function handleWindowClose(e){
        if (e.target === addContactREF.current) {
            setAddingContact(false)
        }
    }

    function handleSendContactRequest(){
        console.log(foundContactSTATE.data())

        firebase.firestore().doc("users/" + foundContactSTATE.data().uid).update({
            receivedContactInvitesList: firebase.firestore.FieldValue.arrayUnion({
                uid: currentUser.uid,
                display_name: currentUserInfo.display_name,
                contact_picture: currentUserInfo.contact_picture
            }),
            receivedContactInvites: firebase.firestore.FieldValue.arrayUnion(
            currentUser.uid,
            )
        })
        firebase.firestore().doc("users/" + currentUser.uid).update({
            contactInvitesList: firebase.firestore.FieldValue.arrayUnion({
                uid: foundContactSTATE.data().uid,
                display_name: foundContactSTATE.data().display_name,
                contact_picture: foundContactSTATE.data().contact_picture
            }),
            contactInvites: firebase.firestore.FieldValue.arrayUnion(
            foundContactSTATE.data().uid,
            )
        })

        setIsSearching(false)
        setIsError(false)
        setError("")
    }

    async function handleContactSearch(e){
        e.preventDefault()
        searchString = searchStringREF.current.value
        console.log(currentUserInfo.contactList)
        console.log(searchString)
        if (searchString === currentUser.email) {
            setIsError(true)
            setError("Cannot add self as contact")
        } else if (searchString === '') {
            setIsError(true)
            setError("Search field blank")
        } else {
            await usersRef.where("email","==",searchString).get().then((result) =>{
            result.forEach((item) =>{
                foundContact = item.data()
                setFoundContact(item)
                if (foundContact.contactInvites.includes(currentUser.uid)) {
                    setIsError(true)
                    setError("You already have an invite pending from " + searchString)
                } else if (currentUserInfo.contactInvites.includes(foundContact.uid)) {
                    setIsError(true)
                    setError("Invite already sent to " + searchString)
                } else if (currentUserInfo.contactList.includes(foundContact.uid)) {
                    setIsError(true)
                    setError(searchString + " is already a contact")
                } else {
                    setContactName(item.data().display_name)
                    setContactEmail(item.data().email)
                    setContactPicture(item.data().contact_picture)
                }
                setIsSearching(true)
            })
        })
        if (typeof foundContact === 'undefined') {
            setIsError(true)
            setError("No contact found with address: " + searchString)
        }
        }
    }

    useEffect(() =>{
        searchStringREF.current.focus()
    },[])

    return ( 
        <div onClick={handleWindowClose} className="addContact" ref={addContactREF}>
            <div className="addContactWindow">
                {isSearching ? 
                    <div className="contactFoundWindow">
                        {!isError && <div className="foundContactPicture"><img src={contactPicture} alt="" /></div>}

                       <h2> {isError ? error : contactName +" has been found @"+contactEmail+"!" } </h2>
                        {isError ? 
                            <button onClick={handleTryAgain} className="sendContactRequest">Try Again</button>
                        :
                            <button onClick={handleSendContactRequest} className="sendContactRequest">Send Invite</button>
                        }
                    </div>
                :
                    <div className="contactSearchWindow">
                        <form onSubmit={handleContactSearch} className="contactSearchForm">
                            <h2>Search by email</h2>
                            <input ref={searchStringREF} type="text" className="contactSearchBar" placeholder="Contact email..."/>
                            <input type="submit" className="contactSearchSubmit" value="Search"/>
                        </form>
                    </div>
                } 
            </div>
        </div>
     );
}
 
export default AddContact;