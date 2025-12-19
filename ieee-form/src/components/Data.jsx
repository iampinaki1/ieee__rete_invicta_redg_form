import React from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function RegistrationTable() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 8;

  const [isAdmin, setIsAdmin] = React.useState(false);
  const [passwordInput, setPasswordInput] = React.useState("");
  const ADMIN_PASSWORD = "IEEE@123";
  React.useEffect(() => {
    // Only fetch when admin is authenticated
    if (isAdmin) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  async function fetchData() {
    setLoading(true);
    // Don't fetch unless admin authenticated
    if (!isAdmin) {
      setLoading(false);
      setError("Admin login required");
      return;
    }

    try {
      const res = await fetch(`https://ieee-rete-invicta-redg-form.onrender.com/api/forms`);
      if (!res.ok) throw new Error("Failed to load data");

      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!id) return alert("Invalid id");
    if (!window.confirm("Are you sure you want to delete this registration?")) return;

    // optimistic update: remove locally first, but keep a backup
    const backup = rows;
    setRows(prev => prev.filter(r => (r._id || r.id) !== id));

    try {
      const res = await fetch(`https://ieee-rete-invicta-redg-form.onrender.com/api/forms/${id}`, { method: "DELETE" });
      if (!res.ok) {
        // restore backup on failure
        setRows(backup);
        const text = await res.text().catch(() => "");
        throw new Error(text || "Delete failed");
      }
      // Optionally show a toast or success message
    } catch (err) {
      alert("Failed to delete: " + (err.message || err));
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function exportCSV(list) {
    if (!list.length) return alert("No data to export.");

    const headers = ["Name", "College", "Branch", "Email", "Registration Date"];

    const csv = [
      headers.join(","),
      ...list.map(r =>
        [
          csvSafe(r.name),
          csvSafe(r.college),
          csvSafe(r.branch),
          csvSafe(r.email),
          csvSafe(formatDate(r.createdAt)),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rete-invicta-registrations.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  function csvSafe(v) {
    if (v === undefined || v === null) return "";
    return `"${String(v).replace(/"/g, '""')}"`;
  }

  // Filter logic
  const filtered = rows.filter(r =>
    [r.name, r.college, r.branch, r.email]
      .join(" ")
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

  // Pagination logic
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="min-h-screen w-full flex justify-center items-start bg-gray-50 p-4 sm:p-8 fade-in">
      <div
        className="
          w-full max-w-6xl
          rounded-2xl
          p-4 sm:p-6
          shadow-lg
          border
          bg-white/90
          backdrop-blur-sm
          border-gray-200
        "
        style={{ overflow: "hidden" }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 slide-up">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              RETE INVICTA — Registration Data
            </h1>
            <p className="text-sm text-gray-600">IEEE VSSUT Student Branch</p>
          </div>

          {/* <-- Updated header layout: stacks on small screens, inline on sm+ */}
          <div className="w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name, college, branch..."
                className="w-full sm:w-auto flex-1 sm:flex-none px-3 py-2 border rounded-md bg-white outline-none focus:ring-2 focus:ring-offset-1 transition shadow-sm"
                style={{ borderColor: "#1F2F4A", "--tw-ring-color": "#1F2F4A" }}
                aria-label="Search registrations"
              />

              {/* buttons container: stack on small screens */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => exportCSV(filtered)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md font-semibold text-white shadow-sm transform transition active:scale-95 focus:outline-none focus:ring-2 btn-focus-ring"
                  style={{ backgroundColor: "#1F2F4A" }}
                  aria-label="Export CSV"
                  title="Export CSV"
                >
                  Export CSV
                </button>

                <button
                  onClick={fetchData}
                  className="w-full sm:w-auto px-3 py-2 rounded-md border font-medium bg-white hover:bg-gray-50 active:scale-95 transition btn-focus-ring"
                  style={{ borderColor: "#1F2F4A", color: "#1F2F4A" }}
                  aria-label="Refresh data"
                  title="Refresh"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Admin login - shown when not authenticated */}
        {!isAdmin && (
          <div className="p-6 border rounded-md bg-gray-50 mb-4 slide-up">
            <p className="mb-2 text-sm text-gray-700">Admin access required to view registration data.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Enter admin password"
                className="w-full sm:w-auto px-3 py-2 border rounded-md"
                aria-label="Admin password"
              />
              <button
                onClick={() => {
                  if (passwordInput === ADMIN_PASSWORD) {
                    setIsAdmin(true);
                    setPasswordInput("");
                    setError(null);
                  } else {
                    alert("Incorrect password");
                  }
                }}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md font-semibold text-white shadow-sm transform transition active:scale-95 focus:outline-none focus:ring-2 btn-focus-ring"
                style={{ backgroundColor: "#1F2F4A" }}
              >
                Enter
              </button>
            </div>
          </div>
        )}

        {/* Logout button when authenticated */}
        {isAdmin && (
          <div className="flex justify-end mb-3">
            <button
              onClick={() => {
                // clear sensitive data immediately on logout
                setIsAdmin(false);
                setRows([]);
                setLoading(false);
                setError(null);
                setQuery("");
                setPage(1);
              }}
              className="px-3 py-1 rounded-md border text-sm"
              style={{ borderColor: "#1F2F4A" }}
            >
              Logout
            </button>
          </div>
        )}

        {/* Desktop table (md+) */}
        {isAdmin && (
          <div className="hidden md:block overflow-x-auto rounded-md">
          <table className="min-w-full text-sm divide-y">
            <thead>
              <tr className="text-left text-gray-700">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">College</th>
                <th className="py-3 px-3">Branch</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Registration Date</th>
                <th className="py-3 px-3">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-600">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                pageRows.map((r, i) => {
                  const id = r._id || r.id;
                  return (
                    <tr
                      key={id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-3 align-top">{(safePage - 1) * pageSize + i + 1}</td>
                      <td className="py-3 px-3 align-top">{r.name}</td>
                      <td className="py-3 px-3 align-top">{r.college}</td>
                      <td className="py-3 px-3 align-top">{r.branch}</td>
                      <td className="py-3 px-3 align-top wrap-break-word">{r.email}</td>
                      <td className="py-3 px-3 align-top">{formatDate(r.createdAt)}</td>
                      <td className="py-3 px-3 align-top">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigator.clipboard?.writeText(r.email)}
                            className="px-2 py-1 rounded border text-sm hover:shadow-sm transform transition active:scale-95"
                            title="Copy email"
                            style={{ borderColor: "#1F2F4A", color: "#1F2F4A" }}
                          >
                            Copy
                          </button>

                          <button
                            onClick={() => handleDelete(id)}
                            className="px-2 py-1 rounded text-sm text-white hover:opacity-90 transform transition active:scale-95"
                            style={{ backgroundColor: "#c0392b" }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          </div>
        )}

        {/* Mobile cards (sm/md) */}
        {isAdmin && (
          <div className="md:hidden space-y-3">
          {loading ? (
            <div className="py-8 text-center text-gray-600">Loading...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-600">{error}</div>
          ) : pageRows.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No registrations found.</div>
          ) : (
            pageRows.map((r, i) => {
              const id = r._id || r.id;
              return (
                <div
                  key={id}
                  className="p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition transform active:scale-[.99]"
                  role="group"
                  aria-label={`Registration ${r.name}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{r.name}</div>
                      <div className="text-xs text-gray-600">{r.college} • {r.branch}</div>
                      <div className="text-xs text-gray-500 wrap-break-words">{r.email}</div>
                    </div>

                    <div className="text-xs text-gray-500">{formatDate(r.createdAt)}</div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => navigator.clipboard?.writeText(r.email)}
                      className="flex-1 px-3 py-2 rounded-md border text-sm hover:shadow-sm transform transition active:scale-95"
                      style={{ borderColor: "#1F2F4A", color: "#1F2F4A" }}
                    >
                      Copy Email
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="px-3 py-2 rounded-md text-sm text-white hover:opacity-90 transform transition active:scale-95"
                      style={{ backgroundColor: "#c0392b" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-sm text-gray-600">
            Showing {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–
            {Math.min(safePage * pageSize, filtered.length)} of {filtered.length}
          </span>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => setPage(1)}
              disabled={safePage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
              style={{ borderColor: "#1F2F4A" }}
              aria-label="First page"
            >
              «
            </button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
              style={{ borderColor: "#1F2F4A" }}
              aria-label="Previous page"
            >
              Prev
            </button>

            <span className="text-sm">{safePage} / {pageCount}</span>

            <button
              onClick={() => setPage(p => Math.min(pageCount, p + 1))}
              disabled={safePage === pageCount}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
              style={{ borderColor: "#1F2F4A" }}
              aria-label="Next page"
            >
              Next
            </button>
            <button
              onClick={() => setPage(pageCount)}
              disabled={safePage === pageCount}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
              style={{ borderColor: "#1F2F4A" }}
              aria-label="Last page"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
