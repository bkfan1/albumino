import {
  Button,
  Flex,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import MasonryGrid from "../../masonry/MasonryGrid";
import { useContext, useEffect } from "react";
import axios from "axios";
import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";
import { useRouter } from "next/router";
import { useDisableButtons } from "@/hooks/useDisableButtons";

export default function AddExistentPhotosToAlbumForm({ albumId }) {
  const { showAddPhotosForm, setShowAddPhotosForm, setShowSpinner } =
    useContext(AlbumPageContext);

  const { selectedPhotos, setSelectedPhotos } = useContext(MasonryGridContext);
  const {disableButtons, toggleDisableButtons} = useDisableButtons();

  const router = useRouter();
  const toast = useToast();
  const isEmptySelectedPhotos = selectedPhotos.length === 0 ? true : false;

  useEffect(() => {
    if (!showAddPhotosForm) {
      setSelectedPhotos([]);
    }
  }, [showAddPhotosForm, setSelectedPhotos]);

  const handleOnClickDone = async () => {
    toggleDisableButtons();
    const promises = selectedPhotos.map(async (photo) => {
      const data = {
        photoId: photo.id,
      };
      return axios.post(`/api/album/${albumId}/photos`, data);
    });

    toast({
      status: "loading",
      title: "Adding photos to album...",
    });

    await Promise.all(promises)
      .then((res) => {
        toast({
          status: "success",
          title: "Photos added succesfully",
        });
        setShowAddPhotosForm(false);
        setShowSpinner(true);
        return router.reload();
        
      })
      .catch((error) => {
        toast({
          status: "error",
          title: "An error ocurred while trying to add photos",
        });
        toggleDisableButtons();
      });
  };

  return (
    <>
      <Modal
        isOpen={showAddPhotosForm}
        onClose={() => {
          setShowAddPhotosForm(false);
        }}
        size={"8xl"}
        
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton
            onClick={() => setShowAddPhotosForm(false)}
            position={"absolute"}
            left={0}
            ml={4}
            rounded={"full"}
            isDisabled={disableButtons}
          />
          <ModalHeader>
            <Flex alignItems={"center"} justifyContent={"space-between"} mt={6}>
              <HStack>
                <Heading size={"md"}>Add photos to album</Heading>
              </HStack>

              <Tooltip label={isEmptySelectedPhotos ? "You need to select at least 1 photo to continue" : "Add selected photos"}>
              <Button onClick={handleOnClickDone} colorScheme="blue" isDisabled={isEmptySelectedPhotos || disableButtons}>
                Done
              </Button>
              </Tooltip>
            </Flex>
          </ModalHeader>

          <ModalBody minHeight={"xl"}>
            <MasonryGrid masonryType={"form"} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
