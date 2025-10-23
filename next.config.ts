import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    experimental: {
        authInterrupts: true
    },
    async redirects() {
        return [
            {
                source: "/admin",
                destination: "/admin/dashboard/orders",
                permanent: false,
            },
            {
                source: "/admin/dashboard",
                destination: "/admin/dashboard/orders",
                permanent: false,
            },
            {
                source: "/dashboard",
                destination: "/admin/dashboard/orders",
                permanent: false,
            },

        ]
    },
    images : {
        remotePatterns : [
            {
                hostname : "res.cloudinary.com"
            }
        ]
    },
    cacheComponents : true
};

export default nextConfig;
