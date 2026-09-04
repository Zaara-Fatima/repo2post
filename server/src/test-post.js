import { generatePost } from "./services/post.service.js";
import connectdb from "../src/config/db.js";

await connectdb()

const repoId = '6a968988dab94f9f741320d3'
const userId = '6a96866c474b5063b17b9194'

const post = await generatePost(repoId, userId)

console.log(post);
