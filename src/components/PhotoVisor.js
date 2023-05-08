import { useContext, useState } from "react";
import {
  Box,
  ButtonGroup,
  Flex,
  Button,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BsInfoCircle, BsThreeDots, BsTrash, BsX } from "react-icons/bs";
import { useRouter } from "next/router";
import PhotoVisorHeader from "./PhotoVisorHeader";
import PhotoVisorBody from "./PhotoVisorBody";
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";

export default function PhotoVisor({ }) {

  const {isOpen, onClose} = useContext(PhotoVisorContext);

  return (
    <>
      <Modal isOpen={isOpen} blockScrollOnMount={true}>
        <ModalOverlay>
          <PhotoVisorHeader/>
          <PhotoVisorBody/>
        </ModalOverlay>
      </Modal>
    </>
  );
}
