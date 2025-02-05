import { User, X } from "lucide-react"

const UserList = ({ users, onClose }) => (
  <div className="w-64 md:w-80 border-l border-zinc-800 bg-zinc-900 overflow-auto fixed right-0 top-0 bottom-0 z-10">
    <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
      <h2 className="text-zinc-100 font-medium flex items-center gap-2">
        <User className="w-4 h-4" />
        Online Users ({users.length})
      </h2>
      <button onClick={onClose} className="text-zinc-400 hover:text-zinc-100">
        <X size={20} />
      </button>
    </div>
    <div className="p-2">
      {users.map((user, index) => (
        <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50">
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm text-zinc-300 relative">
            {user[0]}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></span>
          </div>
          <span className="text-zinc-300">{user}</span>
        </div>
      ))}
    </div>
  </div>
)

export default UserList
