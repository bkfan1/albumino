import SignInForm from "@/components/SignInForm";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default function SignInPage(){
    return(
        <>
        <SignInForm/>
        </>
    )
}

export async function getServerSideProps({req, res}) {
    const session = await getServerSession(req, res, authOptions);
  
    if (session) {
      return {
        redirect: {
          destination: "/photos",
          permanent: false,
        },
      };
    }
  
    return {
      props: {},
    };
  }