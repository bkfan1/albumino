import { PhotoVisorProvider } from "@/contexts/PhotoVisorContext";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <PhotoVisorProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </PhotoVisorProvider>
    </SessionProvider>
  );
}
