import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField'
import socketClient from 'socket.io-client';
import * as uuid from 'uuid';
import './index.css'

const client = socketClient('localhost:4444')

function App() {
  const [message, setMessage] = React.useState('')
  const [userName, setUserName] = React.useState('')
  const [messageList, setMessageList] = React.useState([])

  useEffect(() => {
    client.on('chat', (id, userName, message, userId) => {
      setMessageList((messageList) => [...messageList, {id, userName, message, userId}])
    })
  }, [])

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  const handleUsernameChange = (e) => {
    setUserName(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    client.emit('chat', uuid.v4(), userName, message)
    setMessage('')
  }

  return (
    <div className="App">
    	<div id="controlBox">
    	  	<TextField fullWidth placeholder="Enter your username" onChange={handleUsernameChange}/>
	      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
	        <TextField id="writeMessage" value={message} placeholder="Enter your message and press [ENTER]"  onChange={handleMessageChange}/>
	      </form>
	      <div id="toolBox">
	      	<div className="rooms button inactive"></div>
	      	<div className="status button inactive"></div>
	      	<div className="settings button inactive"></div>
	      </div>
    	</div>
    	<div id="messagesWrap">
	        <div id="messages">
	          {messageList.map(({id, userName, message, userId}) => 
	            <div key={id} className="messageBlock" data-color={userId%4} data-userid={userId}>
	              <div className="userName">{userName}</div>
	              <div className="message">{message}</div>
	              <img className="avatar" alt="" src={"/img/avatars/" + (userId % 49) + ".png"} />
	            </div>
	          )}
	           </div>
        </div>
    </div>
  );
}

export default App;
