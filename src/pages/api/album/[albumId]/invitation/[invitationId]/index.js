import connection from "@/database/connection";
import AlbumInvitation from "@/database/models/AlbumInvitation";

export default async function handler(req, res) {
  switch (req.method) {
    case "PUT":
      try {
        const db = await connection();
        const updated = await AlbumInvitation.findByIdAndUpdate(
          { _id: req.query.invitationId },
          {
            status: req.body.status,
          }
        );

        return res.status(200).json({})
      } catch (error) {
        return res.status(500).json({});
      }

      break;

    default:
      return res.status(405).json({});
      break;
  }
}
