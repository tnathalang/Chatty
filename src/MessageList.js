import React, { Component } from "react";
import Message from "./Message"


class MessageList extends Component {


    render() {
        const renderMessages = this.props.messages.map(message => {
            if (message.type === 'incomingMessage') {
                return (
                    < Message key={message.id} message={message} color={this.props.color}
                    />
                )
            } else if (message.type === 'incomingNotification') {
                return (
                    <div className="notification" key={message.id}>
                        <span className="notification-content">{message.content}</span>
                    </div>
                )
            }
        })

        return (
            <main className="messages">
                {renderMessages}
            </main>
        )
    }
}

export default MessageList