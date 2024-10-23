import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h2 className="text-xl font-bold">
          <Link href="/">InkFlow</Link>
        </h2>
        <ul className="flex space-x-4">
          <li>
            <Link href="/clients">Obsługa klientów</Link>
          </li>
          <li>
            <Link href="/marketing">Marketing</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
