import React, { Component } from "react";

class ChatBar extends Component {

    handleOnKeyDown = event => {

        if (event.key === "Enter" || event.key === "Tab") {

            if (event.target.value === "") {
                this.props.currentUser
            } else {
                this.props.sendUpdateUsername(event.target.value)
            }
        }
    }
    onKeyDown = event => {

        if (event.key === "Enter") {

            const newMessage = event.target.value
            this.props.addNewMessage(newMessage)

            event.target.value = ""
        }
    }

    render() {
        return (
            <div className="chatbar">
                <input
                    className="chatbar-username"
                    placeholder="Your Name (Optional)"
                    onKeyDown={this.handleOnKeyDown}


                />

                <input
                    name="input"
                    className="chatbar-message"
                    placeholder="Type a message and hit ENTER"
                    onKeyDown={this.onKeyDown}
                />
            </div>
        )
    }
}

export default ChatBar;