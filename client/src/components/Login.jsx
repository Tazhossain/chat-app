import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Login = ({ onLogin }) => {
  const [nickname, setNickname] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nickname.trim() || !password) {
      setError("Please fill in all fields")
      return
    }
    onLogin(nickname.trim(), password)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-100">Welcome to Chat</h1>
          <p className="text-zinc-400 mt-2">Enter your nickname and password to join</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-lg">
            Join Chat
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login
