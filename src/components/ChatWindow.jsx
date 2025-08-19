import React, { useState, useRef, useEffect } from "react";
import { useSubscription, useMutation } from "@apollo/client";
import { MESSAGES_SUBSCRIPTION, SEND_MESSAGE } from "../graphql";
import "./loading.css";

export default function ChatWindow({ chatId }) {
  // Step 1: Show prompt if no chat is selected
if (!chatId) {
  return (
    <div className="empty-chat-glass-container">
      <div className="empty-bot-logo">
        {/* Large Bot Icon SVG */}
        <svg width="70" height="70" viewBox="0 0 1024 1024" fill="none">
          <circle cx="512" cy="512" r="320" fill="#4f5ee3" opacity="0.2"/>
          <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5z" fill="#4f5ee3"/>
        </svg>
      </div>
      <div className="empty-chat-glass-text">
        Please create a new chat or select a chat to start messaging.
      </div>
    </div>
  );
}



  const [content, setContent] = useState("");
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const messagesEndRef = useRef(null);

  const { data, loading } = useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { chat_id: chatId },
    skip: !chatId,
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  useEffect(() => {
    const doScroll = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    doScroll();
    const t1 = setTimeout(doScroll, 0);
    const t2 = setTimeout(doScroll, 100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [data?.messages?.length]);

  useEffect(() => {
    if (!data || !data.messages.length) {
      setWaitingForResponse(false);
      return;
    }
    const lastMessage = data.messages[data.messages.length - 1];
    setWaitingForResponse(lastMessage.role === "user");
  }, [data]);

  if (loading && !waitingForResponse) return <p style={{ padding: 16 }}>Loading messages...</p>;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    await sendMessage({
      variables: {
        chat_id: chatId,
        content,
      },
    });
    setContent("");
  };

  const BotAvatar = (
    <svg
      className="bot-avatar"
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 1024 1024"
      style={{ flexShrink: 0, marginRight: 10 }}
    >
      <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" />
    </svg>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: 16,
        boxSizing: "border-box",
        minHeight: 0,
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          maxHeight: "100%",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
          backgroundColor: "#f9fafb",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          boxSizing: "border-box",
        }}
      >
        {data?.messages?.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                alignSelf: isUser ? "flex-end" : "flex-start",
                maxWidth: "70%",
                gap: 8,
                boxSizing: "border-box",
              }}
            >
              {!isUser && BotAvatar}
              <div
                style={{
                  backgroundColor: isUser ? "#22c55e" : "#e0f2fe",
                  color: isUser ? "white" : "#2563eb",
                  padding: "10px 15px",
                  borderRadius: 16,
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  lineHeight: "1.4",
                  flex: "1",
                }}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {waitingForResponse && (
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "8px 12px",
              borderRadius: 16,
              backgroundColor: "#f0f0f0",
              maxWidth: "70%",
              marginTop: 4,
              boxSizing: "border-box",
              alignItems: "center",
              gap: 10,
            }}
          >
            {BotAvatar}

            <div className="thinking-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: "flex" }}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "8px 0 0 8px",
            padding: "10px",
            fontSize: 16,
            boxSizing: "border-box",
            outline: "none",
          }}
          disabled={waitingForResponse}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#22c55e",
            color: "white",
            border: "none",
            padding: "10px 24px",
            borderRadius: "0 8px 8px 0",
            fontSize: 16,
            cursor: waitingForResponse ? "not-allowed" : "pointer",
          }}
          disabled={waitingForResponse}
        >
          Send
        </button>
      </form>
    </div>
  );
}
