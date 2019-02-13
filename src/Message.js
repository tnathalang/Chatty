import React, { Component } from 'react';

class Message extends Component {
    render() {

        const message = this.props.content
        const username = this.props.username

        return (
            <div className="message" >

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
