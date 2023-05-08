import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
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
import { useContext } from "react";
import PhotoVisor from "./PhotoVisor";

export default function PhotosGridItem({ data }) {
  const { onOpen, setCurrentPhoto } = useContext(PhotoVisorContext);
  const { url } = data;

  return (
    <>
      <GridItem>
        <Box
          position="relative"
          overflow={"hidden"}
          _hover={{
            opacity: "90%",
            transition: "ease-in-out all",
            cursor: "pointer",
          }}
        >
          <Checkbox position={"absolute"} size={"md"} margin={2} />
          <Image
            src={url}
            alt={"photo"}
            w="100%"
            h="auto"
            borderRadius="md"
            onClick={() => {
              setCurrentPhoto(data);
              onOpen();
            }}
          />
        </Box>
      </GridItem>
      <PhotoVisor />
    </>
  );
}
