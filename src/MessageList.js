import React, { Component } from "react";
import Message from "./Message"




class MessageList extends Component {


    render() {
        const renderMessages = this.props.messages.map(message => {
            if (message.type === "incomingMessage") {
                return (
                    < Message key={message.id} message={message} color={this.props.color}
                    />
                )
            } else {
                return (
                    <div class="notification">
                        <span class="notification-content">Anonymous1 changed their name to nomnom.</span>
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