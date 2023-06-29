import {
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BsGearFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";

export default function UserNavbarMenu() {
  const { data: session, status } = useSession();

  return (
    <>
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
          <Link href={"/account/settings"}>
          <MenuItem icon={<BsGearFill />}>Settings</MenuItem></Link>
          <MenuItem
            onClick={() => signOut({ callbackUrl: "/signin" })}
            icon={<MdLogout />}
          >
            Log out
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
