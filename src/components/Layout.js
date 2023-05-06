import { Container, Flex } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Panel from "./Panel";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter()
  const {pathname} = router;
  return (
    <Flex flexDirection={"column"} minHeight={"100vh"}>
      <Navbar />
      <Flex flexDirection={"row"} width={"100%"} height={"100%"} gap={4} paddingY={4}>
        {pathname === "/album/[albumId]" ? "" : <Panel />}
        {children}
      </Flex>
    </Flex>
  );
}
