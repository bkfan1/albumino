import AlbumCard from "@/components/AlbumCard";
import Layout from "@/components/Layout";
import {
  Button,
  ButtonGroup,
  Container,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { MdOutlineAddBox } from "react-icons/md";
import { authOptions } from "../api/auth/[...nextauth]";
import connection from "@/database/connection";
import Account from "@/database/models/account";
import Album from "@/database/models/album";
import Link from "next/link";
// import Photo from "@/database/models/photo";


export default function AlbumsPage({albums}) {
  return (
    <>
      <Layout>
        <Flex as="main" flex={6} flexDirection={"column"}>
          <VStack width={"100%"}>
            <Flex
              as="header"
              width={"100%"}
              justifyContent={"space-between"}
              paddingY={2}
              paddingRight={4}
            >
              <Heading size={"lg"}>Albums</Heading>

              <ButtonGroup variant={"ghost"}>
                <Button leftIcon={<MdOutlineAddBox />}>Create album</Button>
              </ButtonGroup>
            </Flex>
          </VStack>

          <Divider />

          <SimpleGrid width={"100%"} minChildWidth="230px" spacing="20px">
            {albums.map((album)=>(
                <AlbumCard key={album.id}  data={album}  />
            ))}

          </SimpleGrid>
        </Flex>
      </Layout>
    </>
  );
}


export async function getServerSideProps({req, res}){

  const session = await getServerSession(req, res, authOptions);

  if(session){

    try {
      const db = await connection();
      const account = await Account.findOne({email: session.user.email})

      if(account){
        let albums = await Album.find({author_account_id: account._id});
        albums = albums.map((album)=>{

          // const albumElements = await Photo.find({album_id: album._id})

          return {
            id: `${album._id}`,
            name: `${album.name}`,
            elements: 0
          }
        })
        return {
          props: {albums}
        }


      }

      return {
        redirect: {
          destination: "/404",
          permanent:false
        }
      }


    } catch (error) {
      return {
        redirect: {
          destination: "/500",
          permanent:false
        }
      }
      
    }




  }

  return {
    redirect: {
      destination: "/signin",
      permanent: false,
    }
  }


}