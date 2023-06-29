import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import {
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { useContext } from "react";
import { BsGearFill, BsThreeDots, BsTrash, BsTrashFill } from "react-icons/bs";

export default function AlbumNavbarMenu() {
  const { isAlbumOwner } = useContext(AlbumPageContext);

  return (
    <>
      <Menu>
        <Tooltip label="More options">
          <MenuButton>
            <Icon as={BsThreeDots} />
          </MenuButton>
        </Tooltip>

        <MenuList>
          {isAlbumOwner ? (
            <>
              <MenuItem icon={<BsGearFill />}>Settings</MenuItem>
              <MenuItem icon={<BsTrashFill />}>Delete album</MenuItem>
            </>
          ) : (
            <>
              <MenuItem>Leave album</MenuItem>
            </>
          )}
        </MenuList>
      </Menu>
    </>
  );
}
