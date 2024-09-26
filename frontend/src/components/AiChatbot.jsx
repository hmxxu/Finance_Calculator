import React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import robot from "../svgs/ai.svg";
import close from "../svgs/close.svg";
import send from "../svgs/send.svg";
import "../styles/AiChatbot.css";
import { smoothScroll } from "../helperFunctions";

const AiChatbot = () => {
  const [chatBotToggled, setChatBotToggled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [messageHistory, setMessageHistory] = useState([
    {
      user: "bot",
      message:
        "Hello, I am your AI chatbot assistant. Feel free to ask me any questions about finance",
    },
  ]);

  const messagehistoryRef = useRef(null);
  const textareaRef = useRef(null);

  const postMessage = async (message) => {
    try {
      const response = await fetch("http://localhost:8081/AiChatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      });

      const data = await response.json();
      return data.message;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  };

  function handleSendClick() {
    const message = textareaRef.current.value;
    if (message && message.length > 0) {
      sendMessage(message);
    }
  }

  function handleKeyDown(e) {
    const message = textareaRef.current.value;
    if (e.key === "Enter" && !e.shiftKey && message && message.length > 0) {
      e.preventDefault();
      sendMessage(message);
    }
  }

  const sendMessage = async () => {
    setIsDisabled(true);
    const text = textareaRef.current.value;
    // User message
    const UserMessage = {
      user: "user",
      message: text,
    };
    setMessageHistory((prevMessages) => [...prevMessages, UserMessage]);

    // Pending message
    const pendingMessage = {
      user: "bot",
      message: null,
    };
    setMessageHistory((prevMessages) => [...prevMessages, pendingMessage]);

    // Simulating a delay for the bot response
    // const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // await wait(1000);
    // const reply = "This is a testing reply to not waste tokens";

    // Chatbot message
    let reply = await postMessage(text);
    if (reply === undefined) reply = "Server is not responding";

    const botMessage = {
      user: "bot",
      message: reply,
    };
    setMessageHistory((prevMessages) => {
      return [...prevMessages.slice(0, -1), botMessage];
    });

    if (reply !== "Server is not responding") setIsDisabled(false);
  };

  // Rest and Refocus on textarea after chatbot responds
  useEffect(() => {
    if (textareaRef.current && !isDisabled) {
      textareaRef.current.value = "";
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      textareaRef.current.focus();
      autoResizeTextarea();
    }
  }, [isDisabled]);

  // Scroll to the bottom of message history after every message
  useEffect(() => {
    if (messagehistoryRef.current) {
      smoothScroll(messagehistoryRef.current, 1000);
    }
  }, [messageHistory]);

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 161.77;

    if (scrollHeight <= maxHeight) {
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = "hidden";
    } else {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = "auto";
    }
  };

  return (
    <div>
      {/* Icon to open chatbox */}
      {!chatBotToggled && (
        <motion.div
          id="chat-box-open-icon"
          className="robot-icon"
          onClick={() => setChatBotToggled(true)}
          whileHover={{ scale: 1.1, backgroundColor: "#004080" }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={robot} alt="Robot Icon" />
        </motion.div>
      )}
      {/* Chat box */}
      <AnimatePresence mode="wait" onExitComplete={() => null}>
        {chatBotToggled && (
          <motion.div
            id="chat-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div id="chat-box-header">
              <div id={"chat-box-header-body"}>
                {/* Icon in Header */}
                <div id="chat-box-header-icon" className="robot-icon">
                  <img src={robot} alt="Robot Icon" />
                </div>
                <div style={{ fontSize: "18px" }}>Chatbot Assistant</div>
              </div>
              {/* Close button in header */}
              <motion.img
                src={close}
                alt="Close Icon"
                id="chat-box-header-close"
                onClick={() => setChatBotToggled(false)}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                }}
                whileTap={{ scale: 0.9 }}
              />
            </div>
            {/* Message History */}
            <div ref={messagehistoryRef} id="chat-box-message-history">
              {messageHistory.map((messageObj, index) => (
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  {/* Robot icon on th left */}
                  {messageObj.user !== "user" && (
                    <div
                      id="chat-box-message-robot-icon"
                      className="robot-icon"
                    >
                      <img src={robot} alt="Robot Icon" />
                    </div>
                  )}
                  {/* Message Bubble */}
                  <div className={messageObj.user + "-chat-message"}>
                    {!messageObj.message ? (
                      <div id="dot-wrapper">
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                      </div>
                    ) : (
                      messageObj.message
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Input Box */}
            <div
              id="chat-box-input-box"
              style={{
                backgroundColor: isDisabled ? "#eeeeee" : "",
                pointerEvents: isDisabled ? "none" : "",
              }}
            >
              {/* Text Input */}
              <textarea
                ref={textareaRef}
                id="chat-box-input-box-text-box"
                disabled={isDisabled}
                onKeyDown={handleKeyDown}
                onInput={autoResizeTextarea}
                rows={1}
              />
              {/* Send Button */}
              <div id="chat-box-input-box-send-wrapper">
                <motion.img
                  src={send}
                  alt="Send Icon"
                  id="chat-box-input-box-send"
                  onClick={handleSendClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiChatbot;
