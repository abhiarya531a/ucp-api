import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();

app.use(cors());

app.use(express.json());

const db = await mysql.createConnection({

    host:
      "ger-game-db-01.centnodes.net",

    user:
      "u199_mqw3riMgAe",

    password:
      "e@pD+oYLj74U0YOZYT!J^G4A",

    database:
      "s199_sunrise"
});

app.post("/login", async(req, res) => {

    try {

        const {
            username,
            discordid
        } = req.body;

        const [rows] =
            await db.execute(

                "SELECT * FROM users WHERE username = ?",

                [username]
            );

        if (!rows.length) {

            return res.json({

                success: false,

                message:
                    "Account not found."
            });
        }

        const user = rows[0];

        if (
            !user.discordid ||
            user.discordid === "0"
        ) {

            return res.json({

                success: false,

                message:
                    "Account not registered to Discord."
            });
        }

        if (
            String(user.discordid)
            !==
            String(discordid)
        ) {

            return res.json({

                success: false,

                message:
                    "Discord ID does not match."
            });
        }

        res.json({

            success: true,

            user
        });

    } catch(error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Internal server error."
        });
    }
});

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        "API running on port " + PORT
    );
});