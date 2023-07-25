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
import { BsCalendarEvent, BsPersonFill, BsUpload } from "react-icons/bs";
import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { MdFitScreen } from "react-icons/md";
import { RiCameraLensLine } from "react-icons/ri";
import { nanoid } from "nanoid";
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";

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
  } = useContext(PhotoVisorContext);

  const filteredMetadata = Object.fromEntries(
    Object.entries(currentVisorPhoto.metadata).filter(
      ([key, value]) => value !== null
    )
  );

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
              {Object.keys(filteredMetadata).map((key) => (
                <PhotoDetailBox
                  key={nanoid()}
                  icon={metadataIcons[key]}
                  headingText={filteredMetadata[key]}
                />
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
