interface LogoProps {
    className?: string;
    showTagline?: boolean;
}

export default function Logo({className = '', showTagline = true }: LogoProps) {
    return (
        <div className={`flex flex-col items-start ${className}`}>
            <div className={`font-bold text-2xl sm:text-3xl lg:text-4xl text-primary`}>
                <span className="text-green-600">Khaati</span>
                <span className="text-orange-500"> Bazar</span>
            </div>
            {showTagline && (
                <span className="text-xs md:text-sm text-gray-500">বিশুদ্ধতায় আপোষহীন</span>
            )}
        </div>
    );
}
