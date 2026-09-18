export const metadata = {
  title: 'ICCS // Intelligent Campus Cognitive System',
  description: 'Controlled by Ayush Kumar Pal',
  icons: {
    icon: '/icon.jpg', // यह वर्सेल को साफ़ निर्देश देगा कि आपकी अपलोड की हुई इमेज को ही ऐप का लोगो बनाए
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-slate-100 antialiased">{children}</body>
    </html>
  )
}

