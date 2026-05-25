import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { whirlpool } from "hash-wasm";

const app = express();

app.use(cors());

app.use(express.json());


// ======================================
// MYSQL CONNECTION
// ======================================

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


// ======================================
// LOGIN
// ======================================

app.post("/login", async(req, res) => {

    try {

        const {
            username,
            password
        } = req.body;

        // =========================
        // VALIDATION
        // =========================

        if (!username || !password) {

            return res.json({

                success: false,

                message:
                    "Please fill all fields."
            });
        }

        // =========================
        // GET USER
        // =========================

        const [rows] =
            await db.execute(

                "SELECT * FROM users WHERE username = ?",

                [username]
            );

        // =========================
        // ACCOUNT NOT FOUND
        // =========================

        if (!rows.length) {

            return res.json({

                success: false,

                message:
                    "Account not found."
            });
        }

        const user = rows[0];

        // =========================
        // HASH PASSWORD
        // =========================

        const hashedPassword =
            (
                await whirlpool(password)
            ).toUpperCase();

        // =========================
        // VERIFY PASSWORD
        // =========================

        if (
            hashedPassword !==
            String(user.password)
            .toUpperCase()
        ) {

            return res.json({

                success: false,

                message:
                    "Invalid password."
            });
        }

        // =========================
        // REMOVE PASSWORD
        // =========================

        delete user.password;

        // =========================
        // FORMAT USERNAME
        // =========================

        user.username =
            user.username.replace(
                /_/g,
                " "
            );

        // =========================
        // SUCCESS
        // =========================

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


// ======================================
// ROOT
// ======================================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message:
            "Sunrise Gaming API Online"
    });
});


// ======================================
// START SERVER
// ======================================

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        "API running on port " + PORT
    );
});