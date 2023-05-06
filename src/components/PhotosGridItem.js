import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  GridItem,
  HStack,
  IconButton,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  BsInfo,
  BsInfoCircle,
  BsThreeDots,
  BsTrash,
  BsX,
} from "react-icons/bs";
import PhotoVisor from "./PhotoVisor";
import { PhotoVisorProvider } from "@/contexts/PhotoVisorContext";

export default function PhotosGridItem({ data }) {

  const {isOpen, onOpen, onClose} = useDisclosure();
  const {url} = data;

  return (
    <>
      <GridItem>
        <Box position="relative" overflow={"hidden"} _hover={{opacity:"90%", transition:"ease-in-out all", cursor:"pointer"}}>
          <Checkbox position={"absolute"} size={"md"} margin={2} />
          <Image
            src={url}
            alt={"photo"}
            w="100%"
            h="auto"
            borderRadius="md"
            onClick={onOpen}
          />
        </Box>

        <PhotoVisorProvider photo={data} modal={{isOpen, onClose}}>
          <PhotoVisor />

        </PhotoVisorProvider>

        
      </GridItem>
    </>
  );
}
