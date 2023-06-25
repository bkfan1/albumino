import { AlbumPageProvider } from "@/contexts/AlbumPageContext";
import { PhotoVisorProvider } from "@/contexts/PhotoVisorContext";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const titlesForPages = {
  "/signin": "Sign In",
  "/signup": "Sign Up",
  "/photos": "Photos",
  "/albums": "Albums",
  "/album/[albumId]": "Album",
  "/album/create": "Create album",
  "/shared": "Shared",
  "/invitation": "Album Invitation",
  "/account/settings": "Account Settings",
  "/500": "Server Error",
  "/404": "Not found",
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const { pathname } = router;
  const [pageTitle, setPageTitle] = useState(null);

  useEffect(() => {
    const updatePageTitle = () => {
      const foundTitle = titlesForPages[pathname];

      if (foundTitle) {
        setPageTitle(foundTitle);
      }
    };

    updatePageTitle();
  }, [pathname]);

  return (
    <SessionProvider session={session}>
      <AlbumPageProvider>
        <PhotoVisorProvider>
          <ChakraProvider>
            <Head>
              <title>
                {pageTitle === null ? "Albumino" : `${pageTitle} - Albumino`}
              </title>
            </Head>
            <Component {...pageProps} />
          </ChakraProvider>
        </PhotoVisorProvider>
      </AlbumPageProvider>
    </SessionProvider>
  );
}
