var mongoose = require('mongoose');
var User = mongoose.model('User');

var SkillSchema = new mongoose.Schema({
  typeaccount: String,
  userid: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true});

// Requires population of user
SkillSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    typeaccount: this.type.
    userid: this.userid,
    createdAt: this.createdAt,
    user: this.user.toProfileJSONFor(user)
  };
};

mongoose.model('Skill', SkillSchema);
