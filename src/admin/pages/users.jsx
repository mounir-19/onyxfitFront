import { useState, useEffect, useRef } from "react";
import { getUsers } from "../../api/users";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    fetchUsers();
    return () => { hasFetched.current = false; };
  }, []);

  useEffect(() => {
    const filteredUsers = users.filter(
      (u) =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.last_name?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredUsers);
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data.data || response.data || []);
      setFiltered(response.data.data || response.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 mb-2">
            Users{" "}
            <span className="text-lg text-zinc-500 font-normal">({filtered.length})</span>
          </h1>
          <p className="text-zinc-500">View registered customers</p>
        </div>
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm"
            disabled={loading}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">👥</div>
            <p className="text-lg font-bold text-zinc-900 mb-2">
              {search ? "No users found" : "No users yet"}
            </p>
            <p className="text-sm text-zinc-500">
              {search ? "Try a different search term" : "No registered customers"}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-zinc-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">
                          {`${user.first_name || ""} ${user.last_name || ""}`.trim() || "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{user.phone || "—"}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {formatDate(user.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
