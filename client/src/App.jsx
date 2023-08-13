import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";

const socket = new WebSocket(`wss://message-board-backend.onrender.com`);

function ChatButtble({ userName, message, time, selectedUserName }) {
  let momentObj = moment(time);
  if (userName == selectedUserName) {
    return (
      <div className="chat chat-end">
        <div className="chat-header flex items-center">
          Me ({userName})<div className="text-xs opacity-50 mx-1">{momentObj.fromNow()}</div>
        </div>
        <div className="chat-bubble chat-bubble-secondary shadow-md border-t border-white">{message}</div>
      </div>
    );
  } else {
    return (
      <div className="chat chat-start">
        <div className="chat-header flex items-center">
          {userName}
          <div className="text-xs opacity-50 mx-1">{momentObj.fromNow()}</div>
        </div>
        <div className="chat-bubble shadow-md border-t border-white">{message}</div>
      </div>
    );
  }
}

function Tooltip({ toolTipMessage, content, isShowing }) {
  if (isShowing == true) {
    return (
      <div className="tooltip tooltip-open tooltip-error w-full" data-tip={toolTipMessage}>
        {content}
      </div>
    );
  } else {
    return content;
  }
}

function App() {
  const [messages, setMessages] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [warningAboutEmptyMessageInput, setWarningAboutEmptyMessageInput] = useState(false);
  const messagesDivRef = useRef();
  const userNameInputRef = useRef();
  const messageInputRef = useRef();

  //websocket
  socket.addEventListener("open", (event) => {
    console.log("WebSocket connection established");
  });

  socket.addEventListener("message", (event) => {
    fetchMessages();
  });

  socket.addEventListener("close", (event) => {
    console.log("WebSocket connection closed");
  });

  //runs on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  //runs whenever the messages are done set
  useEffect(() => {
    messagesDivRef.current.scrollTo(0, messagesDivRef.current.scrollHeight);
  }, [messages]);

  function fetchMessages() {
    axios
      .get("https://message-board-backend.onrender.com")
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }

  function handleSendMessage() {
    let messageIsValid = true;

    let userName;
    if (userNameInputRef.current.value.trim() == "" || userNameInputRef.current.value == undefined) {
      userName = "anonymous user";
    } else {
      console.log("you enterd a valid username");
      userName = String(userNameInputRef.current.value);
    }

    let message;
    if (messageInputRef.current.value == "") {
      message = "no messsage";
      setWarningAboutEmptyMessageInput(true);
      setTimeout(() => setWarningAboutEmptyMessageInput(false), 2000);

      messageIsValid = false;
    } else {
      message = String(messageInputRef.current.value);
    }

    if (messageIsValid) {
      axios
        .post(`https://message-board-backend.onrender.com/create`, {
          userName: userName,
          message: message,
          time: String(new Date()),
        })
        .then(() => {
          messageInputRef.current.value = "";
          fetchMessages();
        });
    }
  }

  return (
    <div className="p-6 h-screen bg-gradient-to-tr from-purple-200 to-rose-200 flex flex-col gap-8 justify-center items-center selection:bg-accent">
      <h2 className="absolute bottom-10 font-semibold opacity-75 drop-shadow-sm">
        <div className="text-center font-mono">
          Balazs Hevesi
          <br />
          2023
        </div>
      </h2>
      <h2 className="absolute top-10 font-semibold opacity-75 drop-shadow-sm">
        <div className="text-center uppercase font-mono">message board</div>
      </h2>

      <div className="mockup-window border-2 border-white bg-base-300 mx-auto max-w-3xl w-full shadow-xl">
        <div className="bg-base-200 h-full">
          <div className="p-2 border-b border-zinc-200 shadow-lg">
            <input
              ref={userNameInputRef}
              type="text"
              placeholder="Enter your username here"
              onChange={() => {
                setSelectedUserName(userNameInputRef.current.value);
              }}
              className="input input-sm w-full"
            />
          </div>
          <div ref={messagesDivRef} className="overflow-auto max-h-96 p-4">
            {messages != undefined || messages.length != 0 ? (
              messages.map((message) => <ChatButtble key={message._id} userName={message.userName} message={message.message} time={message.time} selectedUserName={selectedUserName}></ChatButtble>)
            ) : (
              <div className="text-center">
                <span className="loading loading-dots loading-lg"></span>
              </div>
            )}
          </div>
          <div className="p-2 border-t border-zinc-200 shadow-lg sticky rounded-t-xl bottom-0">
            <div className="w-full flex items-center gap-2 bg-opacity-30">
              <Tooltip
                toolTipMessage="field cannot be empty"
                isShowing={warningAboutEmptyMessageInput}
                content={
                  <input
                    ref={messageInputRef}
                    type="text"
                    placeholder="Type your message here"
                    className="input w-full"
                    onKeyUp={() => {
                      if (event.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                  />
                }
              ></Tooltip>
              <button className="btn btn-active btn-primary" onClick={handleSendMessage}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
