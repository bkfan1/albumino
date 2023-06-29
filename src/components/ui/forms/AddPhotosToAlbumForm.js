import {
  Heading,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import MasonryGrid from "../masonry/MasonryGrid";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AlbumPageContext } from "@/contexts/AlbumPageContext";

export default function AddPhotosToAlbumForm() {
  const {showAddPhotosForm, setShowAddPhotosForm} = useContext(AlbumPageContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [accountPhotos, setAccountPhotos] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchAccountPhotos = async () => {
      try {
        const res = await axios.get(`/api/photos`);
        const photos = res.data.photos;

        setAccountPhotos(photos);
      } catch (error) {
        toast({
          status: "error",
          title: "An error occurred while fetching the account photos",
        });
      }
    };

    if (showAddPhotosForm) {
      fetchAccountPhotos();
    }

    return () => {
      setAccountPhotos([]);
    };
  }, [showAddPhotosForm, toast]);

  return (
    <>
      <Modal isOpen={showAddPhotosForm} onClose={()=>{
        setShowAddPhotosForm(false)
      }} size={"6xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size={"md"}>Add photos to album</Heading>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <MasonryGrid photos={accountPhotos} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
