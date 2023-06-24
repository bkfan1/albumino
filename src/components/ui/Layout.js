import { Flex } from "@chakra-ui/react";
import Navbar from "./navigation/Navbar";
import Panel from "./navigation/Panel";
import { useRouter } from "next/router";
import Footer from "./Footer";

export default function Layout({ children }) {
  const router = useRouter();
  const { pathname } = router;

  const hidePanel = pathname === "/album/[albumId]" || pathname === "/album/create"
  return (
    <Flex flexDirection={"column"} minHeight={"100vh"}>
      <Navbar />
      <Flex flexDirection={"row"} width={"100%"} minHeight={"100vh"} gap={4}>
        {hidePanel ? "" : <Panel />}
        {children}
      </Flex>
      <Footer/>
    </Flex>
  );
}
