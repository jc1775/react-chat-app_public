import { useAuth } from './contexts/AuthContext'
import NavbarLoggedIn from './NavbarLoggedIn';
import NavbarLoggedOut from './NavbarLoggedOut';

const Navbar = (props) => {
    const { currentUser } = useAuth()
    let setAddingContact = props.setAddingContact
    return (
        
        <div className="navHolder">
            { currentUser ? <NavbarLoggedIn setAddingContact={setAddingContact}></NavbarLoggedIn> : <NavbarLoggedOut></NavbarLoggedOut>}
        </div>
     );
}
 
export default Navbar;