import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import Login from "./components/Login"
import ChatRoom from "./components/ChatRoom"
import UserList from "./components/UserList"
import { Users } from "lucide-react"

const SOCKET_URL = process.env.NODE_ENV === "production" ? window.location.origin : "http://localhost:3000"

function App() {
  const [socket, setSocket] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [showUserList, setShowUserList] = useState(false)

  useEffect(() => {
    const newSocket = io(SOCKET_URL)
    setSocket(newSocket)

    return () => newSocket.close()
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message])
    })

    socket.on("message_history", (history) => {
      setMessages(history)
    })

    socket.on("updateUsers", (users) => {
      setUsers(users)
    })

    socket.on("userTyping", (user) => {
      // Handle user typing indicator
    })

    socket.on("userStoppedTyping", (user) => {
      // Handle user stopped typing indicator
    })

    socket.on("messageReaction", ({ messageId, emoji, user }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: {
                  ...msg.reactions,
                  [emoji]: (msg.reactions?.[emoji] || 0) + 1,
                },
              }
            : msg,
        ),
      )
    })

    socket.on("error", (error) => {
      alert(error)
      setIsLoggedIn(false)
    })

    return () => {
      socket.off("message")
      socket.off("message_history")
      socket.off("updateUsers")
      socket.off("userTyping")
      socket.off("userStoppedTyping")
      socket.off("messageReaction")
      socket.off("error")
    }
  }, [socket])

  const handleLogin = (nickname, password) => {
    socket.emit("join", { nickname, password })
    setIsLoggedIn(true)
  }

  const handleSendMessage = (text) => {
    socket.emit("message", { type: "text", text })
  }

  const handleSendMedia = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileUrl = e.target.result
      let type
      if (file.type.startsWith("image/")) {
        type = file.type.endsWith("gif") ? "gif" : "image"
      } else if (file.type.startsWith("video/")) {
        type = "video"
      } else if (file.type.startsWith("audio/")) {
        type = "audio"
      } else {
        alert("Unsupported file type")
        return
      }
      socket.emit("message", { type, url: fileUrl })
    }
    reader.readAsDataURL(file)
  }

  const handleReactToMessage = (messageId, emoji) => {
    socket.emit("messageReaction", { messageId, emoji })
  }

  if (!socket) return null

  return (
    <div className="h-screen w-screen bg-zinc-900 text-zinc-100 flex flex-col">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <div className="flex items-center justify-between p-4 bg-zinc-800">
            <h1 className="text-xl font-bold">Chat Room</h1>
            <button
              onClick={() => setShowUserList(!showUserList)}
              className="flex items-center gap-2 text-sm bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded-full"
            >
              <Users size={16} />
              Online ({users.length})
            </button>
          </div>
          <div className="flex-1 flex overflow-hidden relative">
            <ChatRoom
              messages={messages}
              onSendMessage={handleSendMessage}
              onSendMedia={handleSendMedia}
              onReactToMessage={handleReactToMessage}
            />
            {showUserList && <UserList users={users} onClose={() => setShowUserList(false)} />}
          </div>
        </>
      )}
    </div>
  )
}

export default App
