import React, { Component } from 'react';
import ChatBar from "./ChatBar"
import MessageList from "./MessageList"
import uuid from "uuid"



class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentUser: { id: null, name: "", color: "black" },
      messages: [] // messages coming from the server will be stored here as they arrive
    };
  }

  componentDidMount() {
    const url = 'ws://localhost:3001'
    this.socketServer = new WebSocket(url)

    this.socketServer.onopen = event => {
      console.log("Connected to the server");
    };

    this.socketServer.onmessage = event => {

      const newMessage = JSON.parse(event.data)
      console.log("what is me", newMessage)
      switch (newMessage.type) {
        case 'incomingClientInfo':
          this.updateClientInfo(newMessage)
          break;
        case 'incomingNotification':
          this.updateMessages(newMessage)
          break;
        case 'incomingMessage':
          console.log("incomingMessage")
          this.updateMessages(newMessage)
          break;
        default:
          console.log('Unknown Message from server')
      }
    }
  }


  updateClientInfo = ({ id, name, color, numOfClients }) => {
    this.setState({
      currentUser: {
        name,
        id,
        color
      },
      numOfClients
    })
  }

  updateMessages = (msg) => {
    this.setState({

      messages: [...this.state.messages, msg]

    })
  }


  addNewMessage = updateMessage => {

    const newMessage = {
      type: "postMessage",
      username: this.state.currentUser.name,
      content: updateMessage,
      color: this.state.currentUser.color
    };

    this.socketServer.send(JSON.stringify(newMessage))
  }

  sendUpdateUsername = newUsername => {
    const message = {
      type: 'PostNotification',
      content: `${this.state.currentUser.name} has changed their name to ${newUsername}`
    }
    console.log("PLEASE TALK", newUsername)

    this.socketServer.send(JSON.stringify(message))
  }

  // updateUsername = newUsername => {
  //   let newMessage = this.sendUpdateUsername(newUsername)
  //   console.log(newUsername)
  //   const messages = this.state.messages.concat(newMessage)

  //   this.setState({

  //     currentUser: {
  //       ...this.state.currentUser,
  //       name: newUsername
  //     },
  //     messages: messages
  //   })
  // }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <h4>Currently Online: {this.state.numOfClients} </h4>
        </nav>

        <MessageList
          messages={this.state.messages}
          color={this.state.currentUser.color}
        />

        <div className="message system">

        </div>


        <ChatBar
          currentUser={this.state.currentUser.name}
          addNewMessage={this.addNewMessage}
          sendUpdateUsername={this.sendUpdateUsername}

        />

      </div>
    )
  }
}
export default App;