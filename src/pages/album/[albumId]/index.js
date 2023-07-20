import {
  Flex,
  Text,
  Heading,
  AvatarGroup,
  Avatar,
  IconButton,
  HStack,
  VStack,
  useToast,
  Icon,
  Image,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  ButtonGroup,
  Button,
  Tooltip,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import {
  BsCalendar,
  BsCalendarPlus,
  BsPencilFill,
  BsPlus,
  BsTrash,
} from "react-icons/bs";
import { authOptions } from "../../api/auth/[...nextauth]";

import {
  isAlbumOwner,
  isAlbumContributor,
  getAlbum,
} from "@/middlewares/album";
import MasonryGrid from "@/components/ui/masonry/MasonryGrid";
import { useContext, useEffect, useState } from "react";
import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { useSession } from "next-auth/react";
import AddContributorToAlbumModal from "@/components/ui/modals/AddContributorToAlbumModal";
import { MasonryGridProvider } from "@/contexts/MasonryGridContext";

import PhotoVisor from "@/components/ui/visor/PhotoVisor";

import AlbumSettingsModal from "@/components/ui/modals/AlbumSettingsModal";
import AlbumPageNavbar from "@/components/ui/navigation/AlbumPageNavbar";
import axios from "axios";
import { useRouter } from "next/router";
import AddExistentPhotosToAlbumForm from "@/components/ui/forms/upload/AddExistentPhotosToAlbumForm";
import ChangeAlbumNameForm from "@/components/ui/forms/ChangeAlbumNameForm";
import Footer from "@/components/ui/Footer";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { useIsMounted } from "@/hooks/useIsMounted";

export default function AlbumPage({ album, isOwner }) {
  const { data: session, status } = useSession();

  const {
    isAlbumOwner,
    setIsAlbumOwner,
    showAddPhotosForm,
    setShowAddContributorsForm,
    showChangeAlbumNameForm,
    setShowChangeAlbumNameForm,
    showDeleteAlbumAlertDialog,
    setShowDeleteAlbumAlertDialog,
  } = useContext(AlbumPageContext);

  const [albumData, setAlbumData] = useState(album);
  const [accountPhotos, setAccountPhotos] = useState(null);

  const { name, photos, contributors, created_at, updated_at } = albumData;

  const router = useRouter();
  const { isMounted } = useIsMounted();

  const toast = useToast();

  const { query } = router;
  const { albumId } = query;

  useEffect(() => {
    setIsAlbumOwner(isOwner);
  }, [isOwner, setIsAlbumOwner]);

  useEffect(() => {
    const fetchAccountPhotos = async () => {
      try {
        const res = await axios.get(`/api/photos`);
        const photos = res.data.photos;

        setAccountPhotos(photos);
      } catch (error) {
        console.log(error);
      }
    };

    if (showAddPhotosForm) {
      fetchAccountPhotos();
    }
  }, [showAddPhotosForm]);

  const handleRemoveContributorFromAlbum = async (contributorId, albumId) => {
    const res = axios.delete(
      `/api/album/${albumId}/contributors/${contributorId}`
    );
    toast.promise(res, {
      loading: { title: "Removing contributor from album..." },
      success: { title: "Contributor removed succesfully" },
      error: {
        title: "An error occurred while trying to remove contributor",
      },
    });

    const updatedAlbumContributors = [...albumData["contributors"]];

    const index = updatedAlbumContributors.findIndex(
      (id) => id === contributorId
    );

    updatedAlbumContributors.splice(index, 1);

    const updatedAlbumData = {
      ...albumData,
      ["contributors"]: updatedAlbumContributors,
    };

    setAlbumData(updatedAlbumData);
  };

  const handleDeleteAlbum = async (albumId) => {
    const res = axios.delete(`/api/album/${albumId}`);
    toast.promise(res, {
      loading: { title: "Deleting album..." },
      success: { title: "Album deleted successfully" },
      error: { title: "An error occurred while trying to delete album" },
    });

    setShowDeleteAlbumAlertDialog(false);

    return router.push("/albums");
  };

  const updateAlbumName = (newName) => {
    const updatedAlbumData = { ...albumData, ["name"]: newName };

    setAlbumData(updatedAlbumData);
  };
 
  return (
    <>
      <MasonryGridProvider photos={photos}>
        <AlbumPageNavbar />
        <Flex
          as={"main"}
          flexDirection={"column"}
          minHeight={"100vh"}
          px={6}
          pt={4}
          gap={6}
        >
          <VStack as={"header"} width={"100%"} gap={1}>
            <Skeleton isLoaded={isMounted} alignSelf={"flex-start"}>
              <VStack className="albumPage__titleContainer" width={"100%"}>
                {isAlbumOwner ? (
                  <>
                    {showChangeAlbumNameForm ? (
                      <ChangeAlbumNameForm
                        albumId={albumId}
                        currentAlbumName={name}
                        updateAlbumName={updateAlbumName}
                      />
                    ) : (
                      <HStack width={"100%"}>
                        <Heading>{name}</Heading>{" "}
                        <Tooltip label="Change album name">
                          <IconButton
                            onClick={() =>
                              setShowChangeAlbumNameForm(
                                !showChangeAlbumNameForm
                              )
                            }
                            icon={<BsPencilFill />}
                            variant={"ghost"}
                            rounded={"full"}
                          />
                        </Tooltip>
                      </HStack>
                    )}
                  </>
                ) : (
                  <Heading width={"100%"}>{name}</Heading>
                )}
              </VStack>
            </Skeleton>

            <VStack
              className="albumPage__datesContainer"
              width={"100%"}
              color={"gray.600"}
            >
              <SkeletonText
                isLoaded={isMounted}
                noOfLines={1}
                skeletonHeight={4}
                alignSelf={"flex-start"}
              >
                <Text width={"100%"}>
                  <Icon as={BsCalendar} mr={1} /> Created at {created_at}
                </Text>
              </SkeletonText>

              <SkeletonText
                isLoaded={isMounted}
                noOfLines={1}
                skeletonHeight={4}
                alignSelf={"flex-start"}
              >
                <Text width={"100%"}>
                  <Icon as={BsCalendarPlus} mr={1} /> Updated at {updated_at}
                </Text>
              </SkeletonText>
            </VStack>

            <Skeleton
              isLoaded={isMounted}
              alignSelf={"flex-start"}
              rounded={"md"}
            >
              <HStack
                className="albumPage__contributorsContainer"
                width={"100%"}
              >
                {contributors.length > 0 ? (
                  <>
                    <AvatarGroup size={"sm"}>
                      {contributors.map(({ id, firstname, lastname }) => (
                        <Avatar
                          key={id}
                          name={`${firstname} ${lastname}`}
                          title={`${firstname} ${lastname} ${
                            status === "authenticated"
                              ? session.user.accountId === id
                                ? "(You)"
                                : ""
                              : ""
                          }`}
                        />
                      ))}
                    </AvatarGroup>
                  </>
                ) : (
                  ""
                )}

                {isAlbumOwner ? (
                  <Tooltip label="Add contributors">
                    <IconButton
                      onClick={() => setShowAddContributorsForm(true)}
                      icon={<BsPlus />}
                      rounded={"full"}
                    />
                  </Tooltip>
                ) : (
                  ""
                )}
              </HStack>
            </Skeleton>
          </VStack>

          <Flex as={"section"} width={"100%"}>
            {photos.length === 0 ? (
              <VStack width={"100%"}>
                <Image src="/empty_state_album.svg" alt="" />
                <Heading size={"md"} fontWeight={"normal"}>
                  Album is empty
                </Heading>
                <Text maxW={"sm"} textAlign={"center"} fontWeight={"bold"}>
                  Add or upload photos to album using{" "}
                  <Icon as={MdOutlineAddPhotoAlternate} boxSize={6} mx={1} />
                  at the navigation bar.
                </Text>
              </VStack>
            ) : (
              <>
                <MasonryGrid />
                <PhotoVisor />
              </>
            )}
          </Flex>
        </Flex>
        <Footer />
      </MasonryGridProvider>

      {showAddPhotosForm && accountPhotos !== null ? (
        <MasonryGridProvider photos={accountPhotos}>
          <AddExistentPhotosToAlbumForm albumId={albumId} />
        </MasonryGridProvider>
      ) : (
        ""
      )}

      <AddContributorToAlbumModal />
      <AlbumSettingsModal
        contributors={contributors}
        handleRemoveContributorFromAlbum={handleRemoveContributorFromAlbum}
      />
      <AlertDialog
        isOpen={showDeleteAlbumAlertDialog}
        onClose={() => {
          setShowDeleteAlbumAlertDialog(false);
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete album</AlertDialogHeader>
            <AlertDialogBody>
              Deleted albums cannot be recovered. Photos in deleted albums are
              kept in Albumino.
            </AlertDialogBody>
            <AlertDialogFooter>
              <ButtonGroup>
                <Button>Cancel</Button>
                <Button
                  onClick={() => handleDeleteAlbum(albumId)}
                  leftIcon={<BsTrash />}
                  colorScheme="red"
                >
                  Delete
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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

    return {
      props: {
        album,
        isOwner,
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
