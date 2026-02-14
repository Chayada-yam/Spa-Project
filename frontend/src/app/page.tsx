import Link from "next/link"

export default function Home() {
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold mb-4">Luxury Spa</h1>
      <p>ผ่อนคลายระดับพรีเมียม ด้วยผลิตภัณฑ์ธรรมชาติ</p>

      <Link href="/booking">
        <button className="mt-6 bg-pink-500 text-white px-6 py-2 rounded">
          จองตอนนี้
        </button>
      </Link>
    </div>
  )
}
