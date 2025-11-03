function Header() {
  return (
    <header className="w-full bg-[#180343] shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between h-16 px-6">
        <a
          href="/"
          className="text-[rgb(214,158,3)] font-bold text-xl no-underline"
        >
          Daily Tarot Reader
        </a>
        <nav className="flex space-x-6">
          <a
            href="/calendar"
            className="text-white font-semibold hover:text-[rgb(214,158,3)] hover:underline transition duration-200"
          >
            Calendar
          </a>
          <a
            href="/about"
            className="text-white font-semibold hover:text-[rgb(214,158,3)] hover:underline transition duration-200"
          >
            About
          </a>
          <a
            href="/support"
            className="text-white font-semibold hover:text-[rgb(214,158,3)] hover:underline transition duration-200"
          >
            Support
          </a>
          <a
            href="https://dailytarotreaderblog.com/"
            className="text-white font-semibold hover:text-[rgb(214,158,3)] hover:underline transition duration-200"
          >
            Blog
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
