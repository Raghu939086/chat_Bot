import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CHATS, CREATE_CHAT } from "../graphql";
import "./chatlist.css";

export default function ChatList({ onSelectChat, selectedChat }) {
  const { data, loading, error } = useQuery(GET_CHATS);
  const [createChat] = useMutation(CREATE_CHAT);

  if (loading) return <p style={{ padding: "16px" }}>Loading chats...</p>;
  if (error) return <p style={{ padding: "16px" }}>Error: {error.message}</p>;

  const handleNewChat = async () => {
    const title = prompt("Enter chat title:");
    if (!title) return;

    const res = await createChat({
      variables: { title },
      update: (cache, { data: { insert_chats_one } }) => {
        const existingChats = cache.readQuery({ query: GET_CHATS });
        if (existingChats) {
          cache.writeQuery({
            query: GET_CHATS,
            data: { chats: [insert_chats_one, ...existingChats.chats] },
          });
        }
      },
    });

    if (res.data?.insert_chats_one) {
      onSelectChat(res.data.insert_chats_one.id);
    }
  };

  return (
    <div className="sidebar-content">
      <div className="sidebar-header-fixed">
        <h2>Conversations</h2>
      </div>
      <nav className="chatlist-nav-scroll">
        {data?.chats?.map((chat) => {
         
          return (
            <div
              key={chat.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectChat(chat.id)}
              className={`chatlist-item ${selectedChat === chat.id ? "chatlist-item-active" : ""}`}
            >
              <div className="chatlist-title">{chat.title || "New Chat"}</div>
              
            </div>
          );
        })}
      </nav>
      <button className="sidebar-new-btn-fixed" onClick={handleNewChat}>
        + New Conversation
      </button>
    </div>
  );
}
