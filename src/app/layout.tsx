import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sri Suraksha Multi Speciality Hospital | Metpally",
  description:
    "Sri Suraksha Multi Speciality Hospital in Metpally provides General Medicine, Gynecology, Diagnostics Laboratory and 24/7 emergency healthcare services.",
  keywords: [
    "Sri Suraksha",
    "Multi Speciality Hospital",
    "Metpally",
    "Telangana",
    "General Medicine",
    "Gynecology",
    "Diagnostics Laboratory",
    "24/7 hospital",
    "emergency care",
  ],
  authors: [{ name: "Sri Suraksha Multi Speciality Hospital" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Sri Suraksha Multi Speciality Hospital | Metpally",
    description:
      "Sri Suraksha Multi Speciality Hospital in Metpally provides General Medicine, Gynecology, Diagnostics Laboratory and 24/7 emergency healthcare services.",
    siteName: "Sri Suraksha Multi Speciality Hospital",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Suraksha Multi Speciality Hospital | Metpally",
    description:
      "Sri Suraksha Multi Speciality Hospital in Metpally provides General Medicine, Gynecology, Diagnostics Laboratory and 24/7 emergency healthcare services.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/logo.png" />
        <link rel="preload" as="image" href="/images/hero-bg.png" />
        <link rel="preload" as="image" href="/images/hero-doctor.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                function clean(){
                  try{
                    var els=document.querySelectorAll('[fdprocessedid]');
                    for(var i=0;i<els.length;i++) els[i].removeAttribute('fdprocessedid');
                  }catch(e){}
                }
                function loop(){
                  clean();
                  if(document.readyState!=='complete') requestAnimationFrame(loop);
                }
                clean();
                loop();
                var mo=new MutationObserver(clean);
                if(document.documentElement){
                  mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['fdprocessedid']});
                }else{
                  document.addEventListener('DOMContentLoaded',function(){
                    mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['fdprocessedid']});
                  });
                }
                window.addEventListener('load',function(){setTimeout(function(){mo.disconnect();},5000);});
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${openSans.variable} antialiased bg-background text-foreground font-[family-name:var(--font-open-sans)]`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
