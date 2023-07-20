import {
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import PhotoDetailBox from "../PhotoDetailBox";
import { useContext } from "react";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";
import {
  BsCalendar,
  BsCalendarEvent,
  BsPersonFill,
  BsUpload,
} from "react-icons/bs";
import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { MdFitScreen } from "react-icons/md";
import { RiCameraLensLine } from "react-icons/ri";

const metadataIcons = {
  device: RiCameraLensLine,
  resolution: MdFitScreen,
  datetime: BsCalendarEvent,
  uploaded_at: BsUpload,
};

export default function PhotoVisorDrawer() {
  const { inAlbumPage } = useContext(AlbumPageContext);
  const {
    currentVisorPhoto,
    showCurrentVisorPhotoDetails,
    setShowCurrentVisorPhotoDetails,
  } = useContext(MasonryGridContext);

  return (
    <>
      <Drawer
        isOpen={showCurrentVisorPhotoDetails}
        onClose={() => {
          setShowCurrentVisorPhotoDetails(false);
        }}
      >
        <DrawerOverlay bg={"#0000"} />

        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <VStack>
              <Text width={"100%"}>Details</Text>
              <Divider />
            </VStack>
          </DrawerHeader>

          <DrawerBody>
            <VStack gap={4} width={"100%"}>
              {Object.entries(currentVisorPhoto.metadata).map((entries) => (
                <>
                  {entries[1] ? (
                    <PhotoDetailBox
                      icon={metadataIcons[entries[0]]}
                      headingText={entries[1]}
                    />
                  ) : (
                    ""
                  )}
                </>
              ))}

              {!currentVisorPhoto.metadata.datetime ? (
                <PhotoDetailBox
                  icon={BsUpload}
                  headingText={currentVisorPhoto.uploaded_at}
                />
              ) : (
                ""
              )}

              {inAlbumPage ? (
                <>
                  <PhotoDetailBox
                    icon={BsPersonFill}
                    headingText={`${currentVisorPhoto.author.firstname} ${currentVisorPhoto.author.lastname}`}
                    descriptionText={"Owns this photo"}
                  />
                </>
              ) : (
                ""
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
