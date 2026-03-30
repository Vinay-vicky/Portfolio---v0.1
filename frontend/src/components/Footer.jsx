import { Mail } from 'lucide-react'
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-darkCard/50 py-8 text-slate-300 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm">
          © {new Date().getFullYear()}{' '}
          <a href="https://github.com/Vinay-vicky" target="_blank" rel="noreferrer" className="text-gradient font-bold transition-opacity hover:opacity-80">
            Vignesh R V
          </a>
          . All Rights Reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <a className="transition-transform hover:-translate-y-1 hover:text-indigo-400" href="https://github.com/Vinay-vicky" target="_blank" rel="noreferrer" aria-label="GitHub">
            <FaGithub size={20} />
          </a>
          <a className="transition-transform hover:-translate-y-1 hover:text-blue-400" href="https://www.linkedin.com/in/vignesh-renugambal-b070b8293" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <FaLinkedin size={20} />
          </a>
          <a className="transition-transform hover:-translate-y-1 hover:text-pink-400" href="https://instagram.com/vinay_vicky.2000" target="_blank" rel="noreferrer" aria-label="Instagram">
            <FaInstagram size={20} />
          </a>
          <a className="transition-transform hover:-translate-y-1 hover:text-blue-500" href="https://www.facebook.com/vignesh.velan.52" target="_blank" rel="noreferrer" aria-label="Facebook">
            <FaFacebook size={20} />
          </a>
          <a className="transition-transform hover:-translate-y-1 hover:text-emerald-400" href="tel:+919361477185" aria-label="Contact">
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
