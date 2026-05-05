import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isMenu = location.pathname === '/menu'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollLink = (anchor) =>
    isMenu ? `/#${anchor}` : `#${anchor}`

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#FDF8F0]/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link to="/" className="cursor-pointer">
          <img src="/logo.png" alt="Caffineria" className="h-10 w-auto" />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <a
              href={scrollLink('chi-siamo')}
              className="font-body text-[15px] font-medium text-[#3C2415] cursor-pointer
                         hover:text-[#722F37] transition-colors duration-300 tracking-wide"
            >
              Chi siamo
            </a>
          </li>
          <li>
            <Link
              to="/menu"
              className={`font-body text-[15px] font-medium cursor-pointer tracking-wide
                         transition-colors duration-300 hover:text-[#722F37]
                         ${isMenu ? 'text-[#722F37]' : 'text-[#3C2415]'}`}
            >
              Menu
            </Link>
          </li>
          <li>
            <a
              href={scrollLink('sedi')}
              className="font-body text-[15px] font-medium text-[#3C2415] cursor-pointer
                         hover:text-[#722F37] transition-colors duration-300 tracking-wide"
            >
              Le sedi
            </a>
          </li>
          <li>
            <a
              href={scrollLink('sedi')}
              className="px-5 py-2 rounded-full border border-[#722F37] text-[#722F37]
                         text-[14px] font-medium hover:bg-[#722F37] hover:text-[#FDF8F0]
                         transition-all duration-300 cursor-pointer"
            >
              Vieni a trovarci
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-[2px] bg-[#3C2415] transition-all duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-[#3C2415] transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-[#3C2415] transition-all duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden bg-[#FDF8F0]/95 backdrop-blur-md overflow-hidden transition-all duration-300 ${open ? 'max-h-64' : 'max-h-0'}`}>
        <ul className="flex flex-col py-4 px-6 gap-4">
          <li>
            <a
              href={scrollLink('chi-siamo')}
              onClick={() => setOpen(false)}
              className="block font-body text-[16px] font-medium text-[#3C2415]
                         cursor-pointer hover:text-[#722F37] transition-colors duration-300"
            >
              Chi siamo
            </a>
          </li>
          <li>
            <Link
              to="/menu"
              onClick={() => setOpen(false)}
              className="block font-body text-[16px] font-medium text-[#3C2415]
                         cursor-pointer hover:text-[#722F37] transition-colors duration-300"
            >
              Menu
            </Link>
          </li>
          <li>
            <a
              href={scrollLink('sedi')}
              onClick={() => setOpen(false)}
              className="block font-body text-[16px] font-medium text-[#3C2415]
                         cursor-pointer hover:text-[#722F37] transition-colors duration-300"
            >
              Le sedi
            </a>
          </li>
          <li>
            <a
              href={scrollLink('sedi')}
              onClick={() => setOpen(false)}
              className="inline-block mt-1 px-5 py-2 rounded-full border border-[#722F37]
                         text-[#722F37] text-[14px] font-medium cursor-pointer"
            >
              Vieni a trovarci
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
