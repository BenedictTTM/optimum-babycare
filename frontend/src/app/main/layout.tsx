import Footer from "@/Components/Footer/footer";
import Header from "@/Components/Header/mainNavBar";
import Topbar from '@/Components/Header/topbar';
import UnderTop from '@/Components/Header/undertop';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Topbar />
      <UnderTop />
      <Header />
      <div className="pt-0">
        {children}
      </div>
      <Footer />
    </>
  );
}


