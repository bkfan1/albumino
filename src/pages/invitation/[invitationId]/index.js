import connection from "@/database/connection";
import AlbumInvitation from "@/database/models/AlbumInvitation";
import Account from "@/database/models/account";
import Album from "@/database/models/album";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Button, Heading, VStack } from "@chakra-ui/react";
import axios from "axios";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function InvitationPage({ details }) {
  const { invitation, author, album } = details;

  const {handleSubmit} = useForm();
  const router = useRouter()

  const onSubmit = async()=>{
    try {
        const data = {
            status: "accepted"
        }
        const res = await axios.put(`/api/album/${album.id}/invitation/${invitation.id}`, data);
        console.log("yes!")
        router.push(`/album/${album.id}`)
        
    } catch (error) {
        console.log(error)
        
    }
  }


  return (
    <>
    {invitation.status === "pending" && <VStack as={"form"} maxWidth={"sm"} onSubmit={handleSubmit(onSubmit)}>
            <VStack>
              <Heading size={"lg"} textAlign={"center"}>
                {author.name} invited you to {album.name}
              </Heading>
            </VStack>
            <Button type="submit" width={"100%"} colorScheme="green">
              Accept invitation
            </Button>
          </VStack>}
    {invitation.status === "accepted" && <Heading>Invitation expired</Heading>}

    </>
  );
}

export async function getServerSideProps({ req, res, query }) {
  const db = await connection();
  const session = await getServerSession(req, res, authOptions);
  const foundInvitation = await AlbumInvitation.findById(query.invitationId);

  if (!foundInvitation) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }

  const author = await Account.findById(foundInvitation.sender_id);
  if(session.user.accountId === author._id.toString()){
    return {
        redirect: {
            permanent: false,
            destination:"/"
        }
    }
  }

  const albumDetails = await Album.findById(foundInvitation.album_id);

  return {
    props: {
      details: {
        author: {
            name:`${author.firstname} ${author.lastname}`,
        },

        album: {
            id: albumDetails._id.toString(),
            name: albumDetails.name,
        },
        
        invitation: {
            id: foundInvitation._id.toString(),
            status: foundInvitation.status,
        }
      },
    },
  };
}
