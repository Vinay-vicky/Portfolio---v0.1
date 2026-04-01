function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-slate-950 py-7 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center text-sm sm:px-6 md:flex-row md:text-left lg:px-8">
        <p className="leading-relaxed text-slate-300">
          Copyright &copy; {new Date().getFullYear()} -{' '}
          <a
            href="https://github.com/Vinay-vicky"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Vignesh
          </a>{' '}
          - All Rights Reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-slate-300 md:justify-end">
          <a className="hover:text-white" href="https://www.facebook.com/vignesh.velan.52?mibextid=ZbWKwL" target="_blank" rel="noreferrer">Facebook</a>
          <span className="text-slate-500">&middot;</span>
          <a className="hover:text-white" href="https://instagram.com/vinay_vicky.2000" target="_blank" rel="noreferrer">Instagram</a>
          <span className="text-slate-500">&middot;</span>
          <a className="hover:text-white" href="tel:+919361477185">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
