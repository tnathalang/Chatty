import React, { Component } from 'react';
import ChatBar from "./ChatBar"
import MessageList from "./MessageList"
import uuid from "uuid"



class App extends Component {


  constructor(props) {
    super(props)
    this.state = {
      currentUser: { name: "Bob" },
      messages: [] // messages coming from the server will be stored here as they arrive
    };
  }



  componentDidMount() {
    const url = 'ws://localhost:3001'
    this.socketServer = new WebSocket(url)

    this.socketServer.onopen = event => {
      console.log("Connected to the server");
    };

    this.socketServer.onmessage = message => {

      const newMessage = JSON.parse(message.data)
      console.log("client onMessage: ", newMessage)
      this.setState({
        messages: this.state.messages.concat(newMessage)
      })
    }





  }

  sendNewMessage = updateMessage => {


    const msg = {
      type: 'postMessage',
      username: this.state.currentUser.name,
      content: updateMessage,
      id: uuid.v4()
    }

    this.socketServer.send(JSON.stringify(msg))

  }

  addNewMessage = updateMessage => {

    this.sendNewMessage(updateMessage)

    const newMessage = {
      id: uuid.v4(),
      username: this.state.currentUser.name,
      content: updateMessage
    };
    const messages = this.state.messages.concat(newMessage)
    this.setState({
      messages: messages
    })
  }

  sendUpdateUsername = newUsername => {
    const message = {
      type: 'PostNotification',
      content: `${this.state.currentUser.name} has changed their name to ${newUsername}`
    }

    this.socketServer.send(JSON.stringify(message))
    return message
  }

  updateUsername = newUsername => {
    let newMessage = this.sendUpdateUsername(newUsername)
    console.log(newUsername)
    const messages = this.state.messages.concat(newMessage)
    console.log("messages is being created")
    this.setState({
      currentUser: { name: newUsername },
      messages: messages
    }, () => { console.log(this.state.currentUser) })
  }



  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>

        <MessageList
          messages={this.state.messages}
        />

        <div className="message system">
          {this.sendUpdateUsername}
        </div>


        <ChatBar
          currentUser={this.state.currentUser.name}
          addNewMessage={this.addNewMessage}
          updateUsername={this.updateUsername}

        />

      </div>
    )
  }
}
export default App;