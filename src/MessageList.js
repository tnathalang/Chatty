import React, { Component } from "react";
import Message from "./Message"




class MessageList extends Component {


    render() {
        const renderMessages = this.props.messages.map(message => {

            return (
                < Message key={message.username} username={message.username} content={message.content}
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
