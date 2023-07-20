import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import {
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Tooltip,
} from "@chakra-ui/react";
import { useContext } from "react";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import UploadPhotosToAlbumForm from "../../forms/upload/UploadPhotosToAlbumForm";
import { useRouter } from "next/router";
import { useIsMounted } from "@/hooks/useIsMounted";

export default function AlbumUploadPhotosMenu() {
  const { setShowAddPhotosForm } = useContext(AlbumPageContext);
  const { isMounted } = useIsMounted();
  const router = useRouter();

  const { query } = router;
  const { albumId } = query;

  return (
    <>
      <Skeleton isLoaded={isMounted}>
        <Menu>
          <Tooltip label="Add or upload photos to album">
            <MenuButton>
              <Icon as={MdOutlineAddPhotoAlternate} />
            </MenuButton>
          </Tooltip>
          <MenuList>
            <UploadPhotosToAlbumForm albumId={albumId} />

            <MenuItem onClick={() => setShowAddPhotosForm(true)}>
              Existent photos
            </MenuItem>
          </MenuList>
        </Menu>
      </Skeleton>
    </>
  );
}
