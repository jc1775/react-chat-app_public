const ContactTag = (props) => {
    let display_name = props.display_name
    return ( 
        <h3 className="contactTag">{display_name}</h3>
     );
}
 
export default ContactTag;