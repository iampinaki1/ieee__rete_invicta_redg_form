import React from "react";

export default function IEEEForm() {
  const [form, setForm] = React.useState({
    name: "",
    college: "",
    branch: "",
    email: "",
  });
  const [status, setStatus] = React.useState(null);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch('http://localhost:5000/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(await res.text());

      setStatus('success');
      setForm({ name: '', college: '', branch: '', email: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 fade-in">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md
          rounded-2xl
          p-6 md:p-8
          shadow-lg
          border
          bg-white/10
          backdrop-blur-sm
          border-white/20
          relative
        "
        aria-label="RETE INVICTA - IEEE registration form"
        style={{ color: "#1F2F4A" }}
      >
        <div className="slide-up">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
          RETE INVICTA
          <div className="text-sm font-medium mt-1">IEEE VSSUT Student Branch — Registration</div>
        </h1>
        </div>

        {/* Name */}
        <label className="block font-medium mb-1">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
          placeholder="Enter your name"
          className="w-full mb-3 px-3 py-2 border rounded-md focus:ring-2 focus:outline-none bg-transparent"
          style={{ borderColor: "#1F2F4A", "--tw-ring-color": "#1F2F4A" }}
          required
        />

        {/* College */}
        <label className="block font-medium mb-1">College</label>
        <input
          name="college"
          value={form.college}
          onChange={handleChange}
          type="text"
          placeholder="Enter your college"
          className="w-full mb-3 px-3 py-2 border rounded-md focus:ring-2 focus:outline-none bg-transparent"
          style={{ borderColor: "#1F2F4A", "--tw-ring-color": "#1F2F4A" }}
          required
        />

        {/* Branch */}
        <label className="block font-medium mb-1">Branch</label>
        <input
          name="branch"
          value={form.branch}
          onChange={handleChange}
          type="text"
          placeholder="Enter your branch"
          className="w-full mb-3 px-3 py-2 border rounded-md focus:ring-2 focus:outline-none bg-transparent"
          style={{ borderColor: "#1F2F4A", "--tw-ring-color": "#1F2F4A" }}
          required
        />

        {/* Email */}
        <label className="block font-medium mb-1">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 px-3 py-2 border rounded-md focus:ring-2 focus:outline-none bg-transparent"
          style={{ borderColor: "#1F2F4A", "--tw-ring-color": "#1F2F4A" }}
          required
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 rounded-md font-semibold text-white disabled:opacity-60 btn-focus-ring"
          style={{ backgroundColor: "#1F2F4A" }}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Submitting...' : 'Submit'}
        </button>

        {status === 'success' && (
          <p className="mt-4 text-sm text-green-600 slide-up">Form submitted successfully!</p>
        )}
        {status === 'error' && (
          <p className="mt-4 text-sm text-red-600 slide-up">There was an error submitting the form.</p>
        )}
      </form>
    </div>
  );
}
