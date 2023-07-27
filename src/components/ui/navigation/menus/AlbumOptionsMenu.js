import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { AlbumsContext } from "@/contexts/AlbumsContext";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";
import { useIsMounted } from "@/hooks/useIsMounted";
import {
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Tooltip,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { BsGearFill, BsThreeDots, BsTrashFill } from "react-icons/bs";

export default function AlbumOptionsMenu({}) {
  const { data: session, status } = useSession();

  const {
    isAlbumOwner,
    setShowAlbumSettings,
    showDeleteAlbumAlertDialog,
    uploadingPhotosToAlbum,
    setShowDeleteAlbumAlertDialog,
  } = useContext(AlbumPageContext);
  const { handleLeaveAlbum } = useContext(AlbumsContext);
  const {selectedPhotos} = useContext(MasonryGridContext);

  const { isMounted } = useIsMounted();

  const router = useRouter();
  const { query } = router;
  const { albumId } = query;

  const disableButton = selectedPhotos.length > 0 || uploadingPhotosToAlbum;

  return (
    <>
      <Skeleton isLoaded={isMounted}>
        <Menu>
          <Tooltip label="More options">
            <MenuButton>
              <Icon as={BsThreeDots} />
            </MenuButton>
          </Tooltip>

          <MenuList>
            {isAlbumOwner ? (
              <>
                <MenuItem
                  onClick={() => setShowAlbumSettings(true)}
                  icon={<BsGearFill />}
                  isDisabled={disableButton}
                >
                  Settings
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    setShowDeleteAlbumAlertDialog(!showDeleteAlbumAlertDialog)
                  }
                  icon={<BsTrashFill />}
                  isDisabled={disableButton}
                >
                  Delete album
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  onClick={() =>
                    handleLeaveAlbum(albumId, session.user.accountId)
                  }
                  isDisabled={disableButton}
                >
                  Leave album
                </MenuItem>
              </>
            )}
          </MenuList>
        </Menu>
      </Skeleton>
    </>
  );
}
