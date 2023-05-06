import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home() {
  return <></>;
}

export async function getServerSideProps({ req, res }) {
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
    redirect: {
      destination: "/signin",
      permanent: false,
    },
  };
}
