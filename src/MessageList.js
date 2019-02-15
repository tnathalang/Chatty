import React, { Component } from "react";
import Message from "./Message"




class MessageList extends Component {


    render() {
        const renderMessages = this.props.messages.map(message => {
            console.log("POGGERINO", message)

            return (
                < Message key={message.id} message={message}
                />
            )
        })

        return (
            <main className="messages">
                {renderMessages}

            </main>
        )
    }
}

export default MessageList