import { useContext } from "react";
import { Modal, ModalOverlay } from "@chakra-ui/react";
import PhotoVisorHeader from "./PhotoVisorHeader";
import PhotoVisorBody from "./PhotoVisorBody";
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";

export default function PhotoVisor({}) {
  const { isOpen, onClose } = useContext(PhotoVisorContext);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior={"inside"}
      >
        <ModalOverlay bg={"black"}>
          <PhotoVisorHeader />
          <PhotoVisorBody />
        </ModalOverlay>
      </Modal>
    </>
  );
}
