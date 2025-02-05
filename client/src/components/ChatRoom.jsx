import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Mic, ImageIcon, Smile, X } from "lucide-react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

const ChatRoom = ({ messages, onSendMessage, onSendMedia, onReactToMessage }) => {
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showImageViewer, setShowImageViewer] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioChunks, setAudioChunks] = useState([])
  const mediaRecorderRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [])

  useEffect(() => {
    let typingTimer
    if (input) {
      setIsTyping(true)
      // Emit 'typing' event to server here
    } else {
      setIsTyping(false)
      // Emit 'stop typing' event to server here
    }

    typingTimer = setTimeout(() => {
      setIsTyping(false)
      // Emit 'stop typing' event to server here
    }, 2000)

    return () => clearTimeout(typingTimer)
  }, [input])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input)
      setInput("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      onSendMedia(file)
    }
  }

  const handleEmojiSelect = (emoji) => {
    setInput((prev) => prev + emoji.native)
    setShowEmojiPicker(false)
  }

  const handleReaction = (messageId, emoji) => {
    onReactToMessage(messageId, emoji)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data])
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        onSendMedia(audioBlob)
        setAudioChunks([])
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const renderMessage = (msg) => {
    const content = (() => {
      if (msg.type === "text") {
        return <p className="text-zinc-300 mt-1 break-words">{msg.text}</p>
      } else if (msg.type === "image") {
        return (
          <img
            src={msg.url || "/placeholder.svg"}
            alt="Shared image"
            className="max-w-full h-auto rounded-lg mt-1 cursor-pointer"
            onClick={() => {
              setSelectedImage(msg.url)
              setShowImageViewer(true)
            }}
          />
        )
      } else if (msg.type === "video") {
        return (
          <video controls className="max-w-full h-auto rounded-lg mt-1">
            <source src={msg.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )
      } else if (msg.type === "audio") {
        return (
          <audio controls className="w-full mt-1">
            <source src={msg.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )
      } else if (msg.type === "gif") {
        return (
          <img
            src={msg.url || "/placeholder.svg"}
            alt="GIF"
            className="max-w-full h-auto rounded-lg mt-1"
            autoPlay
            loop
            muted
            playsInline
          />
        )
      }
      return null
    })()

    return (
      <div className="relative group">
        {content}
        <div className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => setShowEmojiPicker(msg.id)}>
            <Smile className="h-4 w-4" />
          </Button>
        </div>
        {showEmojiPicker === msg.id && (
          <div className="absolute right-0 z-10">
            <Picker data={data} onEmojiSelect={(emoji) => handleReaction(msg.id, emoji.native)} />
          </div>
        )}
        {msg.reactions && (
          <div className="flex mt-1 space-x-1">
            {Object.entries(msg.reactions).map(([emoji, count]) => (
              <span key={emoji} className="bg-zinc-800 text-zinc-300 rounded-full px-2 py-1 text-xs">
                {emoji} {count}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full bg-zinc-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 ${msg.user === "System" ? "opacity-75" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex-shrink-0 flex items-center justify-center text-sm text-zinc-300">
              {msg.user[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-zinc-200 truncate">{msg.user}</span>
                <span className="text-xs text-zinc-500 flex-shrink-0">
                  {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                </span>
              </div>
              {renderMessage(msg)}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-zinc-400 italic">Someone is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-zinc-800 p-4 bg-zinc-900">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isRecording ? "Recording..." : "Type a message..."}
            className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-100 text-lg py-6"
            disabled={isRecording}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*,audio/*"
            className="hidden"
          />
          <Button type="button" size="icon" variant="ghost" onClick={() => fileInputRef.current.click()}>
            <ImageIcon className="h-6 w-6" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant={isRecording ? "destructive" : "ghost"}
            onClick={isRecording ? stopRecording : startRecording}
          >
            <Mic className="h-6 w-6" />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => setShowEmojiPicker((prev) => !prev)}>
            <Smile className="h-6 w-6" />
          </Button>
        </form>
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4" style={{ width: "250px", height: "300px" }}>
            <Picker data={data} onEmojiSelect={handleEmojiSelect} previewPosition="none" skinTonePosition="none" />
          </div>
        )}
      </div>

      {showImageViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="max-w-4xl max-h-full p-4">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Full size"
              className="max-w-full max-h-full object-contain"
            />
            <Button
              className="absolute top-4 right-4 bg-zinc-800 hover:bg-zinc-700"
              onClick={() => setShowImageViewer(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatRoom

