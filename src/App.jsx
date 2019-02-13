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
      this.socketServer.send("Connected to the server");
    };

    this.socketServer.onmessage = message => {
      console.log(message.data)
      const newMessage = JSON.parse(message.data)
      this.setState({
        messages: this.state.messages.concat(newMessage)
      })
    }




    setTimeout(() => {

      // Add a new message to the list of messages in the data store
      const newMessage = { id: uuid.v4(), username: "Michelle", content: "Hello there!" };
      const messages = this.state.messages.concat(newMessage)
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({ messages: messages })
    }, 3000);
  }

  sendNewMessage = updateMessage => {


    const msg = {
      type: 'postMessage',
      username: "Bob",
      content: updateMessage,
      id: uuid.v4()
    }

    this.socketServer.send(JSON.stringify(msg))

  }

  addNewMessage = updateMessage => {

    this.sendNewMessage(updateMessage)

    const newMessage = {
      id: uuid.v4(),
      username: "Bob",
      content: updateMessage
    };
    const messages = this.state.messages.concat(newMessage)


    this.setState({
      messages: messages
    })
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
          Anonymous1 changed their name to nomnom.
        </div>


        <ChatBar
          currentUser={this.state.currentUser}
          addNewMessage={this.addNewMessage}
        />

      </div>
    )
  }
}
export default App;
