import React, { Component } from "react";

class ChatBar extends Component {
    render() {
        const onKeyDown = event => {

            if (event.key === "Enter") {
                event.preventDefault()
                const newMessage = event.target.value
                this.props.addNewMessage(newMessage)
                event.target.value = ""
            }
        }
        const userName = this.props.currentUser.name;
        return (
            <div className="chatbar">
                <input
                    className="chatbar-username"
                    value={userName}
                    placeholder="Your Name (Optional)"

                />

                <input
                    name="input"
                    className="chatbar-message"
                    placeholder="Type a message and hit ENTER"
                    onKeyDown={onKeyDown}
                />
            </div>
        )
    }
}

export default ChatBar;