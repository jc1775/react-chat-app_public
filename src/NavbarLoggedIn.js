import { Link, useHistory } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'

const NavbarLoggedIn = (props) => {
    const [error, setError] = useState('')
    const { logout } = useAuth()
    const history = useHistory()
    let setAddingContact = props.setAddingContact

    async function handleLogout(){
        setError('')
        try {
            await logout()
            history.push("/signin")
        } catch {
            setError('Failed to log out')
        }
    }
    
    function handleAddContact(){
        setAddingContact(true)
    }

    return ( 
        <nav className="navbar navbarLoggedIn">
            <h1>Test Chat App</h1>
            <div className="links">
                <Link to="/profile" className="profile_btn">
                    <img src="logo192.png" alt="" className="profilePicture" />
                </Link>
                <div className="dropdown">
                <button className="dropbtn"><img src="settings.png" alt="" className="settingsPicture" /></button>
                <div className="dropdown-content">
                    <button onClick={handleAddContact}>Add Contact</button>
                    <button onClick={handleLogout}>Log out</button>
                </div>
                </div>
                

                
            </div>
        </nav>
     );
}
 
export default NavbarLoggedIn;