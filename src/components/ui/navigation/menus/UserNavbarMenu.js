import { useIsMounted } from "@/hooks/useIsMounted";
import {
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Tooltip,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BsGearFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";

export default function UserNavbarMenu() {
  const { data: session, status } = useSession();
  const { isMounted } = useIsMounted();

  return (
    <>
      <Skeleton isLoaded={isMounted}>
        <Menu>
          <Tooltip label="More options">
            <MenuButton>
              <Avatar
                size={"sm"}
                name={`${status === "authenticated" ? session.user.name : ""}`}
              />
            </MenuButton>
          </Tooltip>

          <MenuList>
            <Link href={"/settings/account"}>
              <MenuItem icon={<BsGearFill />}>Settings</MenuItem>
            </Link>
            <MenuItem
              onClick={() => signOut({ callbackUrl: "/signin" })}
              icon={<MdLogout />}
            >
              Log out
            </MenuItem>
          </MenuList>
        </Menu>
      </Skeleton>
    </>
  );
}
