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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import {
  BsCalendar,
  BsCalendarPlus,
  BsEnvelope,
  BsLink45Deg,
  BsPlus,
} from "react-icons/bs";
import { authOptions } from "../../api/auth/[...nextauth]";
import Layout from "@/components/ui/Layout";

import {
  isAlbumOwner,
  isAlbumContributor,
  getAlbum,
} from "@/middlewares/album";
import MasonryGrid from "@/components/ui/masonry/MasonryGrid";
import { useContext, useEffect, useState } from "react";
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import moment from "moment";
import { useSession } from "next-auth/react";
import GenerateInvitationLinkForm from "@/components/ui/forms/GenerateInvitationLinkForm";
import SendAlbumInvitationEmailForm from "@/components/ui/forms/SendAlbumInvitationEmailForm";
import axios from "axios";

export default function AlbumPage({ album }) {
  const { data: session, status } = useSession();

  const { setInAlbumPage, setIsAlbumOwner, showAlbumSettings } =
    useContext(AlbumPageContext);
  const { setVisorPhotos } = useContext(PhotoVisorContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const { id, contributors, name, photos, created_at, updated_at, isOwner } =
    album;

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

  const handleRemoveContributorFromAlbum = async (albumId, contributorId) => {
    try {
      const res = axios.delete(
        `/api/album/${albumId}/contributors/${contributorId}`
      );

      toast.promise(res, {
        loading: { title: "Removing contributor from album..." },
        success: { title: "Contributor from album removed successfully" },
        error: {
          title:
            "An error occurred while trying to removing contributor from album",
        },
      });

      await res;
    } catch (error) {
      toast({
        status: "error",
        title:
          "An error occurred while trying to removing contributor from album",
      });
    }
  };

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
                    title={`${firstname} ${lastname} ${
                      status === "authenticated"
                        ? id === session.user.accountId
                          ? "(You)"
                          : ""
                        : ""
                    }`}
                  />
                ))}
              </AvatarGroup>
              {isOwner ? (
                <ButtonGroup>
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
              <ModalHeader>Add contributor</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Tabs>
                  <TabList>
                    <Tab>
                      <Icon as={BsLink45Deg} mr={1} /> Link
                    </Tab>
                    <Tab>
                      <Icon as={BsEnvelope} mr={1} /> Email
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <GenerateInvitationLinkForm />
                    </TabPanel>

                    <TabPanel>
                      <SendAlbumInvitationEmailForm />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
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
