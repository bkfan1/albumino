import connection from "@/database/connection";
import Album from "@/database/models/album";
import Photo from "@/database/models/photo";

export default async function handler(req, res) {
  switch (req.method) {
    case "DELETE":
      try {
        const db = await connection();

        const updatedPhotos = await Photo.updateMany(
          {
            albums: req.query.albumId,
          },
          { $pull: { albums: req.query.albumId } }
        );
        const deletedAlbum = await Album.findByIdAndDelete({
          _id: req.query.albumId,
        });

        return res.status(200).json({});
      } catch (error) {
        return res.status(500).json({});
      }

      break;

    default:
      return res.status(405).json();
      break;
  }
}
