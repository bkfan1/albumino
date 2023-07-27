import { useDisableButtons } from "@/hooks/useDisableButtons";
import { useIsMounted } from "@/hooks/useIsMounted";
import {
  Button,
  ButtonGroup,
  IconButton,
  Skeleton,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { MdOutlineAddBox } from "react-icons/md";

export default function CreateAlbumForm() {
  const { isMounted } = useIsMounted();
  const {disableButtons, toggleDisableButtons} = useDisableButtons();

  const router = useRouter();
  const toast = useToast();
  const handleCreateAlbum = async () => {
    toggleDisableButtons();
    const data = {
      name: "Untitled album",
    };

    const resPromise = axios.post(`/api/albums/`, data);

    toast.promise(resPromise, {
      loading: { title: "Creating new album..." },
      success: { title: "Album created succesfully" },
      error: { title: "An error ocurred while trying to create album" },
    });

    const res = await resPromise;

    const albumId = res.data.albumId;

    router.push(`/album/${albumId}`);
  };

  return (
    <>
      <Tooltip label="Create album">
        <Skeleton isLoaded={isMounted} rounded={"md"}>
          <ButtonGroup variant={"ghost"} isDisabled={disableButtons}>
            <Button
              onClick={handleCreateAlbum}
              leftIcon={<MdOutlineAddBox />}
              display={{ base: "none", sm: "none", md: "flex" }}
            >
              Create album
            </Button>

            <IconButton
              onClick={handleCreateAlbum}
              icon={<MdOutlineAddBox />}
              display={{ base: "flex", sm: "flex", md: "none" }}
              rounded={"full"}
            />
          </ButtonGroup>
        </Skeleton>
      </Tooltip>
    </>
  );
}
