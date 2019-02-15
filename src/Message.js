import React, { Component } from 'react';

class Message extends Component {
    render() {
        const { content, username, userId, color } = this.props.message

        return (
            <div className="message" >
                {userId}

                <div className="message-username" style={{ color: color }}>
                    {username}
                </div>

                <div className="message-content">
                    {content}
                </div>

            </div>
        )
    }
}

export default Message
