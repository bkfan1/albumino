import connection from "@/database/connection";
import AlbumInvitation from "@/database/models/AlbumInvitation";
import Account from "@/database/models/Account";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Flex } from "@chakra-ui/react";
import { getServerSession } from "next-auth";

import { invitationExists, isInvitationAuthor } from "@/middlewares/invitation";
import { getAlbum, isAlbumContributor } from "@/middlewares/album";
import AlbumInvitationForm from "@/components/ui/forms/invitation/AlbumInvitationForm";
import NavbarBrand from "@/components/ui/navigation/NavbarBrand";
import Footer from "@/components/ui/Footer";
import InvalidInvitationFigure from "@/components/ui/figures/InvalidInvitationFigure";

export default function InvitationPage({ details }) {
  const { invitation } = details;
  return (
    <>
      <Flex
        as="main"
        minHeight={"100vh"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <NavbarBrand />
        {invitation.status === "pending" && (
          <AlbumInvitationForm details={details} />
        )}
        {invitation.status === "accepted" && <InvalidInvitationFigure />}
      </Flex>
      <Footer />
    </>
  );
}

export async function getServerSideProps({ req, res, query }) {
  try {
    const session = await getServerSession(req, res, authOptions);

    const db = await connection();
    const exists = await invitationExists(query.invitationId);

    if (!exists) {
      return {
        redirect: {
          permanent: false,
          destination: "/404",
        },
      };
    }

    const foundInvitation = await AlbumInvitation.findById(query.invitationId);
    const albumDetails = await getAlbum(foundInvitation.album_id);

    if (session) {
      const isAuthor = await isInvitationAuthor(
        query.invitationId,
        session.user.accountId
      );

      const isContributor = await isAlbumContributor(
        albumDetails.id,
        session.user.accountId
      );

      if (isAuthor || isContributor) {
        return {
          redirect: {
            destination: "/photos",
            permanent: false,
          },
        };
      }
    }

    const author = await Account.findById(albumDetails.author_account_id);

    const details = {
      author: {
        name: `${author.firstname} ${author.lastname}`,
      },

      album: {
        id: albumDetails.id,
        name: albumDetails.name,
        cover: albumDetails.cover,
      },

      invitation: {
        id: foundInvitation._id.toString(),
        status: foundInvitation.status,
      },
    };

    return {
      props: {
        details,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
}
