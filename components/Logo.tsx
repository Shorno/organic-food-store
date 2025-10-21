import Image from "next/image";
import Link from "next/link";

export default function Logo({
                                 width = 200,
                                 height = 150
                             }) {
    return (
        <Link href={"/"}>
            <Image src={"/logo.svg"} alt={"khaatibazar logo"} width={width} height={height} className={"w-40 md:w-50"}/>
        </Link>
    )
}