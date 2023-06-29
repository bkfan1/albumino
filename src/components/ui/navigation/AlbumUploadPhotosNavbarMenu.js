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
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

export default function AlbumUploadPhotosNavbarMenu() {
  const { setShowAddPhotosForm, setShowUploadPhotosForm } =
    useContext(AlbumPageContext);

  return (
    <>
      <Menu>
        <Tooltip label="Add or upload photos to album">
          <MenuButton>
            <Icon as={MdOutlineAddPhotoAlternate}/>
          </MenuButton>
        </Tooltip>
        <MenuList>
          <MenuItem onClick={() => setShowAddPhotosForm(true)}>
            Add photos
          </MenuItem>
          <MenuItem onClick={() => setShowUploadPhotosForm(true)}>
            Upload photos from this device
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
