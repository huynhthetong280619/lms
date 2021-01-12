import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './overwrite.css'

const MessageChat = ({}) => {

    return <div className="message-chat" style={{width: 50, height: 50, position: 'fixed', bottom: 15, right: 25, zIndex: 1000}}>
        <FontAwesomeIcon  icon="comment" style={{width: 50, height: 50, color: '#fff', transform: 'rotateY(180deg)'}}/>
    </div>
}

export default MessageChat;