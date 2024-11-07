import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-slate-700 px-4 py-4 sm:py-4 md:px-8">
      <nav>
        <ul className="flex justify-between">
          <li>
            <Link href="/">Home</Link>
          </li>
          <div className="flex space-x-4">
            <li>
              <Link href="/users/signup">Sign Up</Link>
            </li>
            <li>
              <Link href="/users/login">Log In</Link>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
}
