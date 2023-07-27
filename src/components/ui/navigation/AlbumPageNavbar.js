import {
  Flex,
  HStack,
  IconButton,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import { BsArrowLeft } from "react-icons/bs";

import { MasonryGridContext } from "@/contexts/MasonryGridContext";
import { useContext} from "react";
import { useRouter } from "next/router";
import SelectedPhotosActionsMenu from "./menus/SelectedPhotosActionsMenu";
import AlbumUploadPhotosMenu from "./menus/AlbumUploadPhotosMenu";
import AlbumOptionsMenu from "./menus/AlbumOptionsMenu";
import { useIsMounted } from "@/hooks/useIsMounted";
import UndoSelectionButton from "../UndoSelectionButton";
import { useIsNavbarFixed } from "@/hooks/useIsNavbarFixed";

export default function AlbumPageNavbar() {

  const { selectedPhotos } = useContext(MasonryGridContext);
  const { isMounted } = useIsMounted();
  const router = useRouter();

  const { isNavbarFixed } = useIsNavbarFixed();

  return (
    <>
      <Flex
        width={"100%"}
        alignItems={"center"}
        justifyContent={"space-between"}
        paddingX={4}
        paddingY={4}
        position={isNavbarFixed ? "fixed" : "static"}
        top={0}
        left={0}
        right={0}
        zIndex={10}
        backgroundColor={"white"}
        boxShadow={isNavbarFixed ? "md" : "none"}
      >
        {selectedPhotos.length > 0 ? (
          <UndoSelectionButton />
        ) : (
          <SkeletonCircle isLoaded={isMounted}>
            <IconButton
              icon={<BsArrowLeft />}
              size={"md"}
              rounded={"full"}
              variant={"ghost"}
              padding={1}
              onClick={() => router.back()}
            />
          </SkeletonCircle>
        )}

        <Skeleton isLoaded={isMounted} rounded={"md"}>
          <HStack gap={4}>
            {selectedPhotos.length > 0 ? (
              <SelectedPhotosActionsMenu />
            ) : (
              <AlbumUploadPhotosMenu />
            )}

            <AlbumOptionsMenu/>
          </HStack>
        </Skeleton>
      </Flex>
    </>
  );
}
