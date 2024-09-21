const Message = (props) => {
    let messageClass = "message " + props.type
    let messageContent = props.messageContent
    let author = props.author
    let time = props.time
    return ( 
        <div className={messageClass}>
            <p className="name">{author}</p>
            <p className='messageContent'>{messageContent}</p>
            <p className="time">{time}</p>
        </div>
     );
}
 
export default Message;