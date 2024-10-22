import Navbar from '../components/Navbar';
import './globals.css';

export const metadata = {
  title: 'InkFlow',
  description: 'System zarządzania studiem tatuażu',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
