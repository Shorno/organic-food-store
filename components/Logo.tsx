import Image from "next/image";

export default function Logo({
                                 width = 200,
                                 height = 150
                             }) {
    return (
        <Image src={"/logo.svg"} alt={"khaatibazar logo"} width={width} height={height} className={"w-40 md:w-50"}/>
    )
}