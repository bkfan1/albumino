import { ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";
import { HiMinusCircle } from "react-icons/hi";

export default function SelectedPhotosActionsMenu() {
  return (
    <>
      <ButtonGroup variant={"ghost"} className="selectedPhotosActionsMenu">
        <Tooltip label="Remove photos">
          <IconButton icon={<HiMinusCircle />} />
        </Tooltip>
        <Tooltip label="Delete photos">
          <IconButton icon={<BsTrash />} />
        </Tooltip>
      </ButtonGroup>
    </>
  );
}
