import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";


export default async function handler(req, res){
    const session = await getServerSession(req, res, authOptions)

    if(session){
        console.log(session.user)
        return await res.status(200).json({})
    }
    return await res.status(401).json({})


}