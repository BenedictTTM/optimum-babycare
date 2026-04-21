import Footer from "@/Components/Footer/footer";

import Topbar from '@/Components/Header/topbar';
import Header from '@/Components/Header/mainNavBar';
import UnderTop from '@/Components/Header/undertop';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Topbar />
      <UnderTop/>
      <Header />
      <div className="pt-0">
        {children}
      </div>
      <Footer />
    </>
  );
}


