var mongoose = require('mongoose');
var User = mongoose.model('User');

var DeviceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hardwaredata: {
    manufacture: String,
    name: String,
    model: String,
    uniqueid: String,
    uniquelocale: String,
    uniquecountry: String,
    useragent: String,
    screenwidth: String,
    screenheight: String,
  },
  osdata: {
    systemname: String,
    deviceid: String,
    deviceversion: String,
  },
  appdata: {
    bundleid: String,
    bundlenumber: String,
    appversion: String,
    appversionread: String,
  },
}, {timestamps: true});

// Requires population of user
DeviceSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    hardwaredata: {
      manufacture: this.hardwaredata.manufacture,
      name: this.hardwaredata.name,
      model: this.hardwaredata.model,
      uniqueid: this.hardwaredata.uniqueid,
      uniquelocale: this.hardwaredata.uniquelocale,
      uniquecountry: this.hardwaredata.uniquecountry,
      useragent: this.hardwaredata.useragent,
      screenwidth: this.hardwaredata.screenwidth,
      screenheight: this.hardwaredata.screenheight,
    },
    osdata: {
      systemname: this.osdata.systemname,
      deviceid: this.osdata.deviceid,
      deviceversion: this.osdata.deviceversion,
    },
    appdata: {
      bundleid: this.osdata.bundleid,
      bundlenumber: this.osdata.bundlenumber,
      appversion: this.osdata.appversion,
      appversionread: this.osdata.appversionread,
    },
    createdAt: this.createdAt,
    user: this.user.toProfileJSONFor(user)
  };
};

mongoose.model('Device', DeviceSchema);
