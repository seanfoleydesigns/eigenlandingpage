'use client';

export default function TopBar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
      <div
        className="text-[14px] font-bold tracking-[5px] uppercase"
        style={{ color: '#00ffff' }}
      >
        EIGEN
      </div>
      <nav className="flex items-center gap-6">
        {['Vision', 'Platform', 'Contact'].map((link) => (
          <a
            key={link}
            href="#"
            className="text-[11px] font-normal tracking-[2px] uppercase transition-colors duration-200"
            style={{ color: '#555555' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#555555')}
          >
            {link}
          </a>
        ))}
      </nav>
    </header>
  );
}
