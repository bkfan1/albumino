import connection from "@/database/connection";
import Account from "@/database/models/account";
import accountSchema from "@/utils/joi_schemas/account";
import { hash } from "bcrypt";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      try {
        const result = await accountSchema.validateAsync(req.body);
        // console.log(result)
        const db = await connection();

        const account = await Account.findOne({email: result.email})

        if(account){
            return res.status(400).json({})
        }

        const hashedPassword = await hash(result.password, 10);
        await Account.create({
          email: result.email,
          password: hashedPassword,

          firstname: result.firstname,
          lastname: result.lastname,

          created_at: new Date(),
        });

        await db.disconnect();

        return res.status(200).json({});
      } catch (error) {
        console.log(error)
        return res.status(500).json({});
      }

      break;

    default:
      return res.status(405).json({});
      break;
  }
}
