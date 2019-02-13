import React, { Component } from 'react';

class Message extends Component {
    render() {

        const message = this.props.content
        const username = this.props.username
        const userId = this.props.id

        return (
            <div className="message" >
                {userId}

                <div className="message-username">
                    {username}
                </div>

                <div className="message-content">
                    {message}
                </div>

            </div>
        )
    }
}

export default Message
