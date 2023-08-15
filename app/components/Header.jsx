import Link from "next/link";
import { FaComment } from "react-icons/fa";
import Logos from "./Logos";
export default function Header() {
  return (
    <header className="flex justify-between items-center w-full p-2 px-5 tracking-tight max-w-[50rem] mx-auto">
      <Link href="/" className="flex gap-3 items-baseline">
        <FaComment className="" />
        <h1 className="text-xl font-bold ">Slogan generator</h1>
      </Link>
      <Link href="https://chasecee.com" className="flex gap-3 items-baseline">
        <span className="sr-only">By Chase Cee</span>
        <Logos />
      </Link>
    </header>
  );
}
