import { useContext } from "react";
import { Modal, ModalOverlay } from "@chakra-ui/react";
import PhotoVisorHeader from "./PhotoVisorHeader";
import PhotoVisorBody from "./PhotoVisorBody";

export default function PhotoVisor({}) {

  return (
    <>
      <Modal
        blockScrollOnMount={true}
        isCentered
      >
        <ModalOverlay>
          <PhotoVisorHeader />
          <PhotoVisorBody />
        </ModalOverlay>
      </Modal>
    </>
  );
}
