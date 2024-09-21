const MiniContact = (props) => {
    let contactImage = props.contactImage
    let email = props.email
    let displayName = props.displayName


    function handleContactClick() {
        console.log("Hello World")
    }
    return ( 
        <div onClick={handleContactClick} contact-display-name={displayName} contact-email={email} className="miniContact" >

            <img src={contactImage} alt={email} className="contactPicture" />
        </div>
     );
}
 
export default MiniContact;