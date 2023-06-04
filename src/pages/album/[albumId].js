import {
  Flex,
  Text,
  Heading,
  AvatarGroup,
  Avatar,
  ButtonGroup,
  IconButton,
  HStack,
  VStack,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { BsCalendar, BsCalendarPlus, BsLink, BsPlus } from "react-icons/bs";
import { authOptions } from "../api/auth/[...nextauth]";
import PhotosGrid from "@/components/PhotosGrid";
import Layout from "@/components/Layout";
import SendAlbumInvitationForm from "@/components/forms/SendAlbumInvitationForm";
import { isAlbumOwner, isAlbumContributor, getAlbum } from "@/middlewares/album";

export default function AlbumPage({ album }) {
  console.log(album)
  const { contributors, name, photos, created_at, updated_at, isOwner } = album;

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Layout>
        <Flex width={"100%"} flexDirection={"column"} gap={6} paddingX={6}>
          <VStack as="header" width={"100%"}>
            <Tooltip label="Album name" placement="bottom-start">
              <Heading width={"100%"}>{name}</Heading>
            </Tooltip>

            <VStack width={"100%"} color={"gray.600"}>
              <HStack width={"100%"}>
                <BsCalendar />
                <Text width={"100%"}>
                  Created: {new Date(created_at).toUTCString()}
                </Text>
              </HStack>
              <HStack width={"100%"}>
                <BsCalendarPlus />
                <Text width={"100%"}>
                  Last update: {new Date(updated_at).toUTCString()}
                </Text>
              </HStack>
            </VStack>

            <HStack width={"100%"}>
              <AvatarGroup size={"sm"}>
                {contributors.map(({id, firstname, lastname}) => (
                  <Avatar key={id} name={`${firstname} ${lastname}`} title={`${firstname} ${lastname}`}  />
                ))}
              </AvatarGroup>
              {isOwner ? <ButtonGroup>
                <Tooltip label="Share album">
                  <IconButton icon={<BsLink />} borderRadius={"full"} />
                </Tooltip>

                <Tooltip label="Add contributors">
                  <IconButton
                    onClick={onOpen}
                    icon={<BsPlus />}
                    borderRadius={"full"}
                  />
                </Tooltip>
              </ButtonGroup> : ""}
            </HStack>
          </VStack>
          <PhotosGrid photos={photos} />
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalCloseButton />
            <ModalContent>
              <ModalBody>
                <SendAlbumInvitationForm />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Flex>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, res, query }) {
  
  const session = await getServerSession(req, res, authOptions);

  const isOwner = await isAlbumOwner(query.albumId, session.user.accountId);

  if(!isOwner){
    const isContributor = await isAlbumContributor(query.albumId, session.user.accountId);
    if(!isContributor){
      return {
        redirect: {
          destination:"/",
          permanent:false,
        }
      }
    }
  
  }

  const album = await getAlbum(query.albumId);
  album["isOwner"] = isOwner

  return {
    props: {
      album
    },
  };
}
