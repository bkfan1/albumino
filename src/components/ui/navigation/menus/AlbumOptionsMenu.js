import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { AlbumsContext } from "@/contexts/AlbumsContext";
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
import { BsGearFill, BsThreeDots, BsTrash, BsTrashFill } from "react-icons/bs";

export default function AlbumOptionsMenu({}) {
  const { data: session, status } = useSession();

  const {
    isAlbumOwner,
    setShowAlbumSettings,
    showDeleteAlbumAlertDialog,
    setShowDeleteAlbumAlertDialog,
  } = useContext(AlbumPageContext);
  const { handleLeaveAlbum } = useContext(AlbumsContext);
  const { isMounted } = useIsMounted();

  const router = useRouter();
  const { query } = router;
  const { albumId } = query;

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
                >
                  Settings
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    setShowDeleteAlbumAlertDialog(!showDeleteAlbumAlertDialog)
                  }
                  icon={<BsTrashFill />}
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
