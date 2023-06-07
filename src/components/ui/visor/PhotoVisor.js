import { useContext } from "react";
import { Modal, ModalOverlay } from "@chakra-ui/react";
import PhotoVisorHeader from "./PhotoVisorHeader";
import PhotoVisorBody from "./PhotoVisorBody";
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";

export default function PhotoVisor({}) {
  const { isOpen } = useContext(PhotoVisorContext);

  return (
    <>
      <Modal isOpen={isOpen} blockScrollOnMount={true}>
        <ModalOverlay>
          <PhotoVisorHeader />
          <PhotoVisorBody />
        </ModalOverlay>
      </Modal>
    </>
  );
}
