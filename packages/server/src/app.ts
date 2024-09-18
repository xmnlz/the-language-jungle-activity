import path from "node:path";
import dotenv from "dotenv";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { fetchAndRetry } from "./utils";

dotenv.config({ path: "../../.env" });

const app: Application = express();
const port: number = Number(process.env.PORT) || 3001;

app.use(express.json());

if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientBuildPath));
}

app.post("/api/token", async (req: Request, res: Response) => {
  const response = await fetchAndRetry("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // @ts-ignore
    body: new URLSearchParams({
      client_id: process.env.VITE_CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: req.body.code,
    }),
  });

  const { access_token } = (await response.json()) as {
    access_token: string;
  };

  res.send({ access_token });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port} !`);
});
