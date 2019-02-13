import React, { Component } from 'react';
import ChatBar from "./ChatBar"
import MessageList from "./MessageList"




class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentUser: { name: "Bob" }, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        {
          username: "Bob",
          content: "Has anyone seen my marbles?",
        },
        {
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        }
      ]
    }
  }
  componentDidMount() {

    setTimeout(() => {

      // Add a new message to the list of messages in the data store
      const newMessage = { id: 3, username: "Michelle", content: "Hello there!" };
      const messages = this.state.messages.concat(newMessage)
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({ messages: messages })
    }, 3000);
  }

  // addNewMessage = messages => {
  //   this.setState({
  //     messages: messages
  //   })
  // }




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
        />

      </div>
    )
  }
}
export default App;
