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
  ModalHeader,
} from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { BsCalendar, BsCalendarPlus, BsLink, BsPlus } from "react-icons/bs";
import { authOptions } from "../../api/auth/[...nextauth]";
import Layout from "@/components/ui/Layout";

import SendAlbumInvitationForm from "@/components/ui/forms/SendAlbumInvitationForm";
import {
  isAlbumOwner,
  isAlbumContributor,
  getAlbum,
} from "@/middlewares/album";
import MasonryGrid from "@/components/ui/masonry/MasonryGrid";
import { useContext, useEffect } from "react";
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import moment from "moment";

export default function AlbumPage({ album }) {
  const { setInAlbumPage, setIsAlbumOwner } = useContext(AlbumPageContext);
  const { setVisorPhotos } = useContext(PhotoVisorContext);

  const { contributors, name, photos, created_at, updated_at, isOwner } = album;

  useEffect(() => {
    setInAlbumPage(true);

    return () => {
      setInAlbumPage(false);
    };
  }, [setInAlbumPage]);

  useEffect(() => {
    setIsAlbumOwner(isOwner);

    return () => {
      setIsAlbumOwner(false);
    };
  }, [isOwner, setIsAlbumOwner]);

  useEffect(() => {
    setVisorPhotos(photos);

    return () => {
      setVisorPhotos([]);
    };
  }, [photos, setVisorPhotos]);

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
                  Created:{" "}
                  {moment(created_at).format("MMMM Do YYYY, h:mm:ss a")}
                </Text>
              </HStack>
              <HStack width={"100%"}>
                <BsCalendarPlus />
                <Text width={"100%"}>
                  Last update:{" "}
                  {moment(updated_at).format("MMMM Do YYYY, h:mm:ss a")}
                </Text>
              </HStack>
            </VStack>

            <HStack width={"100%"}>
              <AvatarGroup size={"sm"}>
                {contributors.map(({ id, firstname, lastname }) => (
                  <Avatar
                    key={id}
                    name={`${firstname} ${lastname}`}
                    title={`${firstname} ${lastname}`}
                  />
                ))}
              </AvatarGroup>
              {isOwner ? (
                <ButtonGroup>
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
                </ButtonGroup>
              ) : (
                ""
              )}
            </HStack>
          </VStack>
          <MasonryGrid />
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />

            <ModalContent>
              <ModalHeader>
                <Tooltip label="Close modal">
                  <ModalCloseButton />
                </Tooltip>
              </ModalHeader>
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
  try {
    const session = await getServerSession(req, res, authOptions);

    const isOwner = await isAlbumOwner(query.albumId, session.user.accountId);

    const isContributor = await isAlbumContributor(
      query.albumId,
      session.user.accountId
    );

    if (!isOwner && !isContributor) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const album = await getAlbum(query.albumId);

    if (!album) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }

    album["isOwner"] = isOwner;

    console.log(album);

    return {
      props: {
        album,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
}
