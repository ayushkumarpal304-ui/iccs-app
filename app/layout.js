export const metadata = {
  title: 'ICCS // Intelligent Campus Cognitive System',
  description: 'Controlled by Ayush Kumar Pal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-slate-100 antialiased">{children}</body>
    </html>
  )
}

