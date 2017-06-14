var mongoose = require('mongoose');
var User = mongoose.model('User');

var DeviceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hardware_data: {
    manufacture: String,
    name: String,
    model: String,
    unique_id: String,
    unique_locale: String,
    unique_country: String,
    user_agent: String,
    screen_width: String,
    screen_height: String
  },
  os_data: {
    system_name: String,
    device_id: String,
    device_version: String
  },
  app_data: {
    bundle_id: String,
    bundle_number: String,
    app_version: String,
    app_version_read: String
  },
}, {timestamps: true});

// Requires population of user
DeviceSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    hardware_data: {
      manufacture: this.hardware_data.manufacture,
      name: this.hardware_data.name,
      model: this.hardware_data.model,
      unique_id: this.hardware_data.unique_id,
      unique_locale: this.hardware_data.unique_locale,
      unique_country: this.hardware_data.unique_country,
      user_agent: this.hardware_data.user_agent,
      screen_width: this.hardware_data.screen_width,
      screen_height: this.hardware_data.screen_height
    },
    os_data: {
      system_name: this.os_data.system_name,
      device_id: this.os_data.device_id,
      device_version: this.os_data.device_version
    },
    app_data: {
      bundle_id: this.app_data.bundle_id,
      bundle_number: this.app_data.bundle_number,
      app_version: this.app_data.app_version,
      app_version_read: this.app_data.app_version_read
    },
    createdAt: this.createdAt,
    user: this.user.toProfileJSONFor(user)
  };
};

mongoose.model('Device', DeviceSchema);
