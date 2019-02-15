import React, { Component } from 'react';
import ChatBar from "./ChatBar"
import MessageList from "./MessageList"
import uuid from "uuid"



class App extends Component {


  constructor(props) {
    super(props)
    this.state = {
      currentUser: { id: null, name: "", color: 'black' },
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
      switch (newMessage.type) {
        case 'incomingClientInfo':

          this.updateClientInfo(newMessage)
          break;
        case 'incomingNotification':
          this.addNewNotification(newMessage)
          break;
        default:
          console.log('Unknown Message from server')
      }
      this.setState({
        messages: this.state.messages.concat(newMessage)
      })
    }
  }

  updateClientInfo = ({ id, name, color, numOfClients }) => {
    console.log('CLIENTS', numOfClients)

    this.setState({
      currentUser: {
        name,
        id,
        color
      },
      numOfClients
    })

  }


  addNewNotification = msg => {

    console.log(`adding ${JSON.stringify(msg)}`)
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

    this.setState({

      currentUser: {
        ...this.state.currentUser,
        name: newUsername
      },
      messages: messages
    }, () => { console.log(this.state.currentUser) })
  }



  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <h4>User Online: {this.state.numOfClients} </h4>
        </nav>

        <MessageList
          messages={this.state.messages}
          color={this.state.currentUser.color}
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