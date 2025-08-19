import { useState, useEffect } from "react";
import { useAuthenticationStatus, useSignOut } from "@nhost/react";
import AuthForm from "./components/AuthForm";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import { apollo } from "./apollo";
import "./app.css";

export default function App() {
  const { isAuthenticated, isLoading, user } = useAuthenticationStatus();
  const { signOut } = useSignOut();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    await apollo.clearStore();
    setSelectedChatId(null);
  };

  useEffect(() => {
    if (!isLoading) {
      apollo.resetStore();
      setSelectedChatId(null);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading)
    return (
      <div className="loading-spinner-container" aria-label="Loading">
        <div className="loading-spinner" />
      </div>
    );

  if (!isAuthenticated) return <AuthForm />;


  return (
    <div className={darkMode ? "app-container dark-theme" : "app-container light-theme"}>
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            title={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? (
              // Close Icon (X)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--menu-bar-bg)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              // Hamburger Icon (three bars)
              <>
                <span className="menu-bar"></span>
                <span className="menu-bar"></span>
                <span className="menu-bar"></span>
              </>
            )}
          </button>

          <span className="app-title">AI Chatbot</span>
        </div>
        <div className="header-actions">
          <button
            className="header-pill"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} theme`}
            title={`Switch to ${darkMode ? "light" : "dark"} theme`}
          >
            {darkMode ? "🌙" : "🌞"}
          </button>
          <div className="header-pill online-pill">
            <span className="online-dot"></span>
            <span>Online</span>
          </div>
          <button className="header-pill signout-pill" onClick={handleSignOut}>
            <span className="material-icons" style={{ fontSize: 18, marginRight: 4 }}>
              logout
            </span>
            <span>LOGOUT</span>
          </button>
        </div>
      </header>



      {/* Main page with Sidebar + ChatWindow */}
      <div className="app-main">
        <aside className={sidebarOpen ? "sidebar sidebar-open" : "sidebar"}>
          <ChatList
            onSelectChat={(id) => {
              setSelectedChatId(id);
              setSidebarOpen(false);
            }}
            selectedChat={selectedChatId}
          />
        </aside>
        <main className="chat-window-wrapper">
          <ChatWindow chatId={selectedChatId} />
        </main>
      </div>
    </div>
  );
}
