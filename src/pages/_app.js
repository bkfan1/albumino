import { AlbumPageProvider } from "@/contexts/AlbumPageContext";
import { PhotoVisorProvider } from "@/contexts/PhotoVisorContext";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <AlbumPageProvider>
        <PhotoVisorProvider>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </PhotoVisorProvider>
      </AlbumPageProvider>
    </SessionProvider>
  );
}
