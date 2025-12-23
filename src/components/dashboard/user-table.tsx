"use client";

import { useState } from "react";
import { 
  Users2, 
  ShieldCheck, 
  MoreVertical, 
  Key, 
  Trash2, 
  Edit3, 
  Plus,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { UserModal } from "./user-modal";
import { deleteUser } from "@/lib/actions/users";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface UserTableProps {
  initialUsers: any[];
}

export default function UserTable({ initialUsers }: UserTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [search, setSearch] = useState("");

  // Keep local state in sync with server data
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to purge this identity from the matrix?")) {
      const res = await deleteUser(id);
      if (res.success) {
        setUsers(users.filter(u => u.id !== id));
      }
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search identities by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card/50 border border-border rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        <button 
          onClick={openCreateModal}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Provision User
        </button>
      </div>

      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identity</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operational Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Access Scope</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-black tracking-tight">{user.name}</p>
                        <p className="text-[11px] font-bold text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase",
                      user.role === "ADMIN" ? "bg-red-500/10 text-red-500" : 
                      user.role === "MANAGER" ? "bg-amber-500/10 text-amber-500" : 
                      "bg-emerald-500/10 text-emerald-500"
                    )}>
                      {user.role === "ADMIN" ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1 max-w-[300px]">
                      {user.permissions && Array.isArray(user.permissions) ? (
                        user.permissions.map((p: string) => (
                          <span key={p} className="px-2 py-0.5 rounded-md bg-secondary border border-border text-[9px] font-black uppercase text-muted-foreground">
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] font-bold text-muted-foreground italic">No specific permissions set</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="p-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors"
                        title="Edit Permissions"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors"
                        title="Purge Identity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}

