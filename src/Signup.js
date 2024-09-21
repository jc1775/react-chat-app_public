import { Link, useHistory } from 'react-router-dom'
import { useRef, useState } from "react"
import { useAuth } from './contexts/AuthContext'
import firebase from "./firebase"
import 'firesql/rx'; // <-- Important! Don't forget
import 'firebase/firestore';

const Signup = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmationRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] =useState(false)
    const history = useHistory()
    const USERSref = firebase.firestore().collection("users")

    async function handleSubmit(e){
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
            return setError("Passwords do not match")
        }

        try {
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value).then(cred =>{
                console.log("signed up")
                console.log(cred.user)
                console.log(cred.user.email)
                var newUser = {
                    email: cred.user.email,
                    display_name: cred.user.email,
                    uid: cred.user.uid,
                    activeChats: [],
                    contact_picture: 'logo192.png',
                    contactList: [],
                    contactInvites: [],
                    receivedContactInvites: [],
                    receivedContactInvitesList: [],
                    contactInvitesList: [],
                }
                USERSref.doc(cred.user.uid).set(newUser)
            })
            
            history.push("/dashboard")
        } catch {
            setError("Failed to create an account")
        }
        setLoading(false)
    }
    return ( 
                <div className='login'>
            <div className="loginWindow signupWindow">
                <form onSubmit={handleSubmit}>
                    <h1>Sign Up</h1>
                    {error && <h2 className="error">{error}</h2>}
                    <h2>Email</h2> 
                    <input type="text" ref={emailRef}/>
                    <h2>Password</h2>
                    <input type="password" ref={passwordRef}/>
                    <h2>Password Confirmation</h2>
                    <input type="password" ref={passwordConfirmationRef}/>
                    <div className="buttonHolder center-flex">
                            <input disabled={loading} type="submit" id='signUp' value="Sign Up"></input>  
                        <Link to="/dashboard">
                        </Link>     
                    </div> 
                </form>
                <h2>Already have an account?</h2> <Link to="/signin"> <h2>Sign In</h2> </Link>   
            </div>
        </div>
     );
}
 
export default Signup;