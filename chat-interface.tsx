"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Home, Plus, MessageSquare, User, MoreVertical, X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ChatInterface() {
  const [showSettings, setShowSettings] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [sounds, setSounds] = useState(true)
  const [theme, setTheme] = useState("blue")

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      {/* Top Navigation */}
      <div className="flex items-center gap-2 p-2 bg-zinc-800/50 backdrop-blur-lg border-b border-zinc-800">
        <Button variant="ghost" size="icon" className="text-zinc-400">
          <Home className="h-5 w-5" />
        </Button>
        <div className="flex-1 flex items-center gap-2 px-4 py-1.5 bg-zinc-700/50 rounded-full">
          <MessageSquare className="h-4 w-4 text-zinc-400" />
          <span className="text-sm">tlk.io/tmiami</span>
        </div>
        <Button variant="ghost" size="icon" className="text-zinc-400">
          <Plus className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 text-sm">1</span>
          <Button variant="ghost" size="icon" className="text-zinc-400" onClick={() => setShowSettings(!showSettings)}>
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Channel Header */}
      <div className="flex items-center justify-between p-4 bg-zinc-800">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-zinc-700">T</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-light">tmiami</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-zinc-400">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Tab Bar */}
      <div className="flex justify-center gap-8 p-4 border-b border-zinc-800">
        <Button variant="ghost" size="icon" className="text-zinc-400">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-zinc-400">
          <User className="h-5 w-5" />
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-80 bg-zinc-800 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Notifications</span>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <span>Sounds</span>
                <Switch checked={sounds} onCheckedChange={setSounds} />
              </div>
              <div className="border-t border-zinc-700 pt-4">
                <div className="flex justify-center gap-2">
                  {["blue", "pink", "gray", "black"].map((color) => (
                    <button
                      key={color}
                      className={`h-8 w-8 rounded-full ${
                        color === "blue"
                          ? "bg-blue-500"
                          : color === "pink"
                            ? "bg-pink-500"
                            : color === "gray"
                              ? "bg-zinc-500"
                              : "bg-zinc-900"
                      } ${theme === color ? "ring-2 ring-white" : ""}`}
                      onClick={() => setTheme(color)}
                    />
                  ))}
                </div>
              </div>
              <Button variant="secondary" className="w-full bg-zinc-700 hover:bg-zinc-600">
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Online Users */}
      <div className="flex justify-center p-4 text-sm text-zinc-400">1 online</div>

      {/* Chat Messages */}
      <div className="p-4 space-y-4">
        {/* Example message */}
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-zinc-700 text-sm">T</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm">Hello world!</p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800">
        <Input placeholder="Type a message..." className="bg-zinc-800 border-zinc-700" />
      </div>
    </div>
  )
}

