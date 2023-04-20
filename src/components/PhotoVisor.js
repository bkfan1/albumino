import { Modal, ModalOverlay, useDisclosure } from "@chakra-ui/react"


export default function PhotoVisor(){
    const {isOpen, onOpen, onClose} = useDisclosure();

    return(
        <>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay>
                
            </ModalOverlay>

        </Modal>
        </>
    )

}