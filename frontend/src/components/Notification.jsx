import "./Notification.css";

function Notification({
    message
}) {

    if (!message) return null;

    return (

        <div className="notification">

            {message}

        </div>

    );
}

export default Notification;