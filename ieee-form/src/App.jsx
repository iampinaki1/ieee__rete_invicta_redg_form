import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import IEEEForm from './components/Form'
import RegistrationTable from './components/Data'

function NavButton({ to, children }) {
  const loc = useLocation()
  const active = loc.pathname === to
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md font-semibold text-white shadow-sm transition transform active:scale-95 ${active ? 'opacity-100' : 'opacity-95'}`}
      style={{ backgroundColor: '#1F2F4A' }}
    >
      {children}
    </Link>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-center">
          <div className="text-lg font-bold text-gray-900">RETE INVICTA</div>
          <div className="flex gap-3">
            <NavButton to="/form">Fill Form</NavButton>
            <NavButton to="/data">View Data</NavButton>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<IEEEForm/>} />
          <Route path="/form" element={<IEEEForm/>} />
          <Route path="/data" element={<RegistrationTable/>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
