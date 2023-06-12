import { addExistentPhotoToAlbum, removePhotoFromAlbum } from "@/middlewares/photo";


export default async function handler(req, res){
    switch (req.method) {
        case "PUT":
            return addExistentPhotoToAlbum(req, res);
            break;
            
        case "DELETE":
            return await removePhotoFromAlbum(req,res)
            
            break;
    
        default:
            return res.status(405).json({})
            break;
    }
}