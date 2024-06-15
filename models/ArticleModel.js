const mongoose=require("mongoose");
const articleSchema=mongoose.Schema({
    title:String,
    description:String,
    link:String,
    author:String
});

const ArticleModel=mongoose.model("article",articleSchema);

module.exports={ArticleModel}