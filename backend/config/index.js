require('dotenv').config()

const mongoDB_URL=process.env.mongoDB_URL;
const PORT=parseInt(process.env.PORT) || 3001;
const JWT_SECRET=process.env.JWT_SECRET;

module.exports={
    mongoDB_URL,
    PORT,
    JWT_SECRET
}