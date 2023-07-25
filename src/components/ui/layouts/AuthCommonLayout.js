import { Flex, HStack } from "@chakra-ui/react";
import Footer from "../Footer";
import Panel from "../navigation/Panel";
import NavbarBrand from "../navigation/NavbarBrand";
import UserNavbarMenu from "../navigation/menus/UserNavbarMenu";
import MultiRouteUploadPhotosForm from "../forms/upload/MultiRouteUploadPhotosForm";
import { useIsNavbarFixed } from "@/hooks/useIsNavbarFixed";
import { useIsMounted } from "@/hooks/useIsMounted";
import LoadingPageLayout from "./LoadingPageLayout";

export default function AuthCommonLayout({ children }) {
  const {isMounted} = useIsMounted();
  const { isNavbarFixed } = useIsNavbarFixed();

  if(!isMounted){
    return (
      <>
      <LoadingPageLayout/>
      </>
    )
  }


  return (
    <>
      <Flex
        alignItems={"center"}
        justifyContent={"space-between"}
        paddingY={2}
        paddingX={4}
        border={"1px"}
        borderColor={"#edf1f5"}
        position={isNavbarFixed ? "fixed" : "static"}
        top={0}
        left={0}
        right={0}
        zIndex={10}
        backgroundColor={"white"}
        boxShadow={isNavbarFixed ? "md" : "none"}
      >
        <NavbarBrand />

        <HStack spacing={6}>
          <MultiRouteUploadPhotosForm />
          <UserNavbarMenu />
        </HStack>
      </Flex>
      <Flex flexDirection={"row"} width={"100%"} minHeight={"100vh"} gap={4}>
        <Panel />
        {children}
      </Flex>
      <Footer />
    </>
  );
}
