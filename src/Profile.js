
import { useAuth } from './contexts/AuthContext'
import firebase from "./firebase"
import 'firesql/rx'; // <-- Important! Don't forget
import 'firebase/firestore';
import {useEffect, useState, useRef} from 'react';
import { Link, useHistory } from 'react-router-dom'



const Profile = (props) => {
    let userData = props.currentUserInfo
    const { currentUser } = useAuth()
    const userRef = firebase.firestore().doc("users/" + currentUser.uid)
    const displayNameRef = useRef()
    const birthdayRef = useRef()
    const statusRef = useRef()

    function handleChangePicture(e){

    }

    function handleUpdateProfile(e){
        e.preventDefault();
        if (displayNameRef.current.value !== userData.display_name) {
            userRef.update({
                display_name: displayNameRef.current.value 
            })
        }
    }

    return ( 
        <div className="profilePage">
            <h1>{userData.display_name}'s Profile</h1>
            <div className="profilePhoto">
                <img src={userData.contact_picture} alt="" />
                <button className="changeProfilePicture">Change picture</button>
            </div>
            <form onSubmit={handleUpdateProfile} className="changeProfileInfo">
                <h2>Display Name</h2>
                <input type="text" placeholder={userData.display_name} ref={displayNameRef}/>
                <h2>Birthday</h2>
                <input type="text" placeholder="" ref={birthdayRef}/>
                <h2>Status</h2>
                <input type="text" placeholder="" ref={statusRef}/>
                <input type="submit" value="Update profile" />
            </form>
            <Link to="/dashboard" className="backToDashBTN">
                    <img src="down-arrow.svg" alt="" className="backButton" /><p>Back to messages</p>
            </Link>
        </div>
     );
}
 
export default Profile;