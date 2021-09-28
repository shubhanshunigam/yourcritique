var mongoose = require("mongoose");

var restaurantShema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   dollar:String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Restaurant", restaurantShema);