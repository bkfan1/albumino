import Footer from "../Footer";
import AlbumPageNavbar from "../navigation/AlbumPageNavbar";

export default function AlbumPageLayout({ children }) {
  return (
    <>
      <AlbumPageNavbar />

      {children}

      <Footer />
    </>
  );
}
