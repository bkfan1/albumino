import connection from "@/database/connection";
import AlbumInvitation from "@/database/models/AlbumInvitation";
import Account from "@/database/models/Account";
import Album from "@/database/models/Album";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Flex, Heading } from "@chakra-ui/react";
import { getServerSession } from "next-auth";

import { invitationExists, isInvitationAuthor } from "@/middlewares/invitation";
import { isAlbumContributor } from "@/middlewares/album";
import AlbumInvitationForm from "@/components/ui/forms/AlbumInvitationForm";

export default function InvitationPage({ details }) {
  return (
    <>
      <Flex
        as="main"
        minHeight={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {invitation.status === "pending" && (
          <AlbumInvitationForm details={details} />
        )}
        {invitation.status === "accepted" && (
          <Heading>Invitation expired</Heading>
        )}
      </Flex>
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

    const foundInvitation = await AlbumInvitation.findById({
      _id: query.invitationId,
    });

    const isAuthor = await isInvitationAuthor(
      query.invitationId,
      session.user.accountId
    );

    const isContributor = await isAlbumContributor(
      albumDetails._id.toString(),
      session.user.accountId
    );

    if (isAuthor || isContributor) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const albumDetails = await Album.findById(foundInvitation.album_id);

    const author = await Account.findById(albumDetails.author_account_id);

    return {
      props: {
        details: {
          author: {
            name: `${author.firstname} ${author.lastname}`,
          },

          album: {
            id: albumDetails._id.toString(),
            name: albumDetails.name,
          },

          invitation: {
            id: foundInvitation._id.toString(),
            status: foundInvitation.status,
          },
        },
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
