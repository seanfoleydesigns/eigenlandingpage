'use client';

export default function Footer() {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#1a1a1a]">
      <span className="text-[11px]" style={{ color: '#333333' }}>
        &copy; 2025 Eigen Information Systems
      </span>
      <span className="text-[11px]" style={{ color: '#333333' }}>
        Brooklyn, NY
      </span>
      <a
        href="mailto:info@eigen.systems"
        className="text-[11px] transition-colors duration-200"
        style={{ color: '#333333' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#333333')}
      >
        info@eigen.systems
      </a>
    </footer>
  );
}
