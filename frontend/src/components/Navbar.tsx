import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="flex justify-between p-4 bg-pink-200">
      <h1 className="font-bold">Luxury Spa</h1>
      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/services">Services</Link>
        <Link href="/booking">Booking</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
  )
}
