import { Flex, HStack, Stack } from "@chakra-ui/react";
import Footer from "../Footer";
import Panel from "../navigation/Panel";
import NavbarBrand from "../navigation/NavbarBrand";
import { useContext } from "react";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";
import SelectedPhotosActionsMenu from "../navigation/menus/SelectedPhotosActionsMenu";
import MultiRouteUploadPhotosForm from "../forms/upload/MultiRouteUploadPhotosForm";
import UserNavbarMenu from "../navigation/menus/UserNavbarMenu";
import UndoSelectionButton from "../UndoSelectionButton";
import { useIsNavbarFixed } from "@/hooks/useIsNavbarFixed";
import { useIsMounted } from "@/hooks/useIsMounted";
import LoadingPageLayout from "./LoadingPageLayout";

export default function PhotosPageLayout({ children }) {
  const { selectedPhotos } = useContext(MasonryGridContext);
  const { isMounted } = useIsMounted();
  const { isNavbarFixed } = useIsNavbarFixed();
  if (!isMounted) {
    return (
      <>
        <LoadingPageLayout />
      </>
    );
  }
  return (
    <>
      <Flex flexDirection={"column"} minHeight={"100vh"}>
        <Flex
          alignItems={"center"}
          justifyContent={"space-between"}
          width={"100%"}
          paddingX={4}
          paddingY={2}
          borderBottom={"1px"}
          borderColor={"#edf1f5"}
          position={isNavbarFixed ? "fixed" : "static"}
          top={0}
          left={0}
          right={0}
          zIndex={10}
          backgroundColor={"white"}
          boxShadow={isNavbarFixed ? "md" : "none"}
        >
          <Stack>
            {selectedPhotos.length > 0 ? (
              <UndoSelectionButton />
            ) : (
              <NavbarBrand />
            )}
          </Stack>

          <HStack spacing={6}>
            {selectedPhotos.length > 0 ? (
              <SelectedPhotosActionsMenu />
            ) : (
              <>
                <MultiRouteUploadPhotosForm />
                <UserNavbarMenu />
              </>
            )}
          </HStack>
        </Flex>
        <Flex flexDirection={"row"} width={"100%"} minHeight={"100vh"} gap={4}>
          <Panel />
          {children}
        </Flex>
        <Footer />
      </Flex>
    </>
  );
}
