import './globals.css';

export const metadata = {
  title: 'Tryout TKA KKGMI Surabaya 10',
  description: 'Aplikasi Pendaftaran Tryout TKA',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-pendidikan-light text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
