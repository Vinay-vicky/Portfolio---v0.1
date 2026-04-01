function Footer() {
  return (
    <footer className="mt-10 bg-slate-900 py-6 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm sm:flex-row sm:px-6 lg:px-8">
        <p>
          Copyright © {new Date().getFullYear()} -{' '}
          <a href="https://github.com/Vinay-vicky" target="_blank" rel="noreferrer" className="font-semibold text-blue-300 hover:text-blue-200">
            Vignesh
          </a>{' '}
          - All Rights Reserved.
        </p>
        <div className="flex items-center gap-3">
          <a className="text-slate-200 hover:text-white" href="https://www.facebook.com/vignesh.velan.52?mibextid=ZbWKwL" target="_blank" rel="noreferrer">Facebook</a>
          <span>·</span>
          <a className="text-slate-200 hover:text-white" href="https://instagram.com/vinay_vicky.2000" target="_blank" rel="noreferrer">Instagram</a>
          <span>·</span>
          <a className="text-slate-200 hover:text-white" href="tel:+919361477185">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
