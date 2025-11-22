import type { Metadata } from "next";
import { Montserrat, Merriweather, Source_Code_Pro } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find My Bike - Search eBay UK for Your Missing Bike",
  description:
    "Upload a photo of your missing bike and find similar listings on eBay UK. Search by image, make, and model to locate your bike quickly.",
  keywords: [
    "bike search",
    "find bike",
    "eBay UK",
    "bicycle search",
    "missing bike",
  ],
  openGraph: {
    title: "Find My Bike - Search eBay UK for Your Missing Bike",
    description:
      "Upload a photo of your missing bike and find similar listings on eBay UK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${montserrat.variable} ${merriweather.variable} ${sourceCodePro.variable} antialiased flex flex-col min-h-full`}>
        {children}
      </body>
    </html>
  );
}
