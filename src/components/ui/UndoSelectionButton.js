import { MasonryGridContext } from "@/contexts/MasonryGridContext";
import { HStack, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { useContext } from "react";
import { BsXLg } from "react-icons/bs";

export default function UndoSelectionButton() {
  const { selectedPhotos, handleUndoSelection, deletingSelectedPhotos } =
    useContext(MasonryGridContext);

  return (
    <>
      <HStack>
        <Tooltip label="Undo selection">
          <IconButton
            onClick={handleUndoSelection}
            icon={<BsXLg />}
            variant={"ghost"}
            rounded={"full"}
            isDisabled={deletingSelectedPhotos}
          />
        </Tooltip>
        <Text>{selectedPhotos.length} selected</Text>
      </HStack>
    </>
  );
}
