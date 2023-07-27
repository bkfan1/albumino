import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { useDisableButtons } from "@/hooks/useDisableButtons";
import {
  ButtonGroup,
  HStack,
  IconButton,
  Input,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { BsCheck, BsX } from "react-icons/bs";

export default function ChangeAlbumNameForm({
  currentAlbumName,
  updateAlbumName,
  albumId,
}) {
  const { setShowChangeAlbumNameForm } = useContext(AlbumPageContext);
  const {disableButtons, toggleDisableButtons} = useDisableButtons();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      newName: currentAlbumName,
    },
  });

  const toast = useToast();

  const onSubmit = async (data) => {
    toggleDisableButtons();
    const res = axios.put(`/api/album/${albumId}`, data);
    toast.promise(res, {
      loading: { title: "Changing album name..." },
      success: { title: "Album name changed succesfully" },
      error: { title: "An error occurred while trying to change album name" },
    });

    await res;

    updateAlbumName(data.newName);
    setShowChangeAlbumNameForm(false);
  };

  return (
    <>
      <HStack as="form" onSubmit={handleSubmit(onSubmit)} width={"100%"}>
        <Input
          type="text"
          {...register("newName", {
            required: { value: true, message: "This field is required" },
            minLength: { value: 1, message: "" },
            maxLength: { value: 256, message: "" },
          })}
          onKeyUp={(e) => {
            e.key === "Escape" ? setShowChangeAlbumNameForm(false) : null;
          }}
          variant={"flushed"}
          placeholder="Album name"
          fontSize={"4xl"}
        />

        <Input type="submit" hidden />
        <ButtonGroup isDisabled={disableButtons}>
          <Tooltip label="Cancel">
            <IconButton
              onClick={() => setShowChangeAlbumNameForm(false)}
              icon={<BsX />}
              rounded={"full"}
            />
          </Tooltip>
          <Tooltip label="Change album name">
            <IconButton type="submit" icon={<BsCheck />} rounded={"full"} />
          </Tooltip>
        </ButtonGroup>
      </HStack>
    </>
  );
}
