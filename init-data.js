/**
 * Initialize data in database.
 * Usage: node src/init-data
 */
'use strict';

require('./bootstrap');
const co = require('co');
const User = require('./models').User;
const Site = require('./models').Site;
const Device = require('./models').Device;
const DeviceIngressPath = require('./models').DeviceIngressPath;
const MCLChannel = require('./models').MCLChannel;
const DeviceProfile = require('./models').DeviceProfile;
const logger = require('./common/logger');
const helper = require('./common/helper');

const USER_COUNT = 2000;

co(function*() {
  // hash a password
  const password = yield helper.hashString('password');
  // clear uesrs
  yield User.remove();
  // add users
  for (let i = 0; i < USER_COUNT; i++) {
    const user = {
      email: `user${i}@test.com`,
      password,
      displayName: `user${i}`,
      jobTitle: 'job title',
      department: 'department',
      phoneNumber: '111-222-333',
      accountEnabled: 'true',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
    };
    yield User.create(user);
  }

  // init sites
  yield Site.remove();
  const site1 = yield Site.create({ name: 'Customer X' });
  const site2 = yield Site.create({ name: 'Customer Y' });
  yield Site.create({ name: 'Customer Z' });

  // init device ingress paths
  yield DeviceIngressPath.remove();
  const path1 = yield DeviceIngressPath.create({ ingressPath: 'Device' });
  const path2 = yield DeviceIngressPath.create({ ingressPath: 'Software' });

  // init devices
  yield Device.remove();
  const device1 = yield Device.create({
    name: 'device1',
    ingressPathId: path1._id,
    deviceId: '1234-5678-9012-1111',
    activationCode: 'code1',
    connectionString: 'http://xx.yy.zz',
    model: 'model',
    firmware: 'firmware',
    createdAt: new Date(),
    createdBy: 'system',
    lastDataPoint: new Date(),
    siteId: site1._id,
  });
  const device2 = yield Device.create({
    name: 'device2',
    ingressPathId: path2._id,
    deviceId: '1234-5678-9012-2222',
    activationCode: 'code2',
    connectionString: 'http://xx.yy.zz',
    model: 'model',
    firmware: 'firmware',
    createdAt: new Date(),
    createdBy: 'system',
    lastDataPoint: new Date(),
    parentId: device1._id,
    siteId: site1._id,
  });
  const device3 = yield Device.create({
    name: 'device3',
    ingressPathId: path1._id,
    deviceId: '1234-5678-9012-3333',
    activationCode: 'code3',
    connectionString: 'http://xx.yy.zz',
    model: 'model',
    firmware: 'firmware',
    createdAt: new Date(),
    createdBy: 'system',
    lastDataPoint: new Date(),
    parentId: device2._id,
    siteId: site1._id,
  });
  const device4 = yield Device.create({
    name: 'device4',
    ingressPathId: path2._id,
    deviceId: '1234-5678-9012-4444',
    activationCode: 'code4',
    connectionString: 'http://xx.yy.zz',
    model: 'model4',
    firmware: 'firmware4',
    createdAt: new Date(),
    createdBy: 'system',
    lastDataPoint: new Date(),
    parentId: device2._id,
    siteId: site1._id,
  });
  yield Device.create({
    name: 'device5',
    ingressPathId: path2._id,
    deviceId: '1234-5678-9012-5555',
    activationCode: 'code5',
    connectionString: 'http://xx.yy.zz',
    model: 'model5',
    firmware: 'firmware5',
    createdAt: new Date(),
    createdBy: 'system',
    lastDataPoint: new Date(),
    parentId: device1._id,
    siteId: site1._id,
  });
  yield Device.create({
    name: 'device6',
    ingressPathId: path1._id,
    deviceId: '1234-5678-9012-6666',
    parentId: device4._id,
    siteId: site1._id,
  });
  yield Device.create({
    name: 'device7',
    ingressPathId: path1._id,
    deviceId: '1234-5678-9012-7777',
    siteId: site1._id,
  });
  yield Device.create({
    name: 'device8',
    ingressPathId: path2._id,
    deviceId: '1234-5678-9012-8888',
    parentId: device3._id,
    siteId: site1._id,
  });

  yield Device.create({
    name: 'device9',
    ingressPathId: path2._id,
    deviceId: '1234-5678-9012-9999',
    siteId: site2._id,
  });
  yield Device.create({
    name: 'device10',
    ingressPathId: path1._id,
    deviceId: '1234-5678-9012-0000',
    siteId: site2._id,
  });

  // init MCL channels
  yield MCLChannel.remove();
  for (let i = 1; i <= 50; i++) {
    yield MCLChannel.create({
      tag: `tag${i}`,
      mclname: `name${i}`,
      lname: `long name ${i}`,
      sname: `short name ${i}`,
      unit: `unit${i}`,
      lunit: `long unit ${i}`,
      sunit: `short unit ${i}`,
      desc: `desc${i}`,
      vtype: `vtype${i}`,
      array_size: 10,
      enums: [{ s: 'sss1', v: 'vvv1' }, { s: 'sss2', v: 'vvv2' }],
      category: `category${i}`,
      lcategory: `long category ${i}`,
      scategory: `short category ${i}`,
      writable: true,
      default: `default${i}`,
      min: `min${i}`,
      max: `max${i}`,
      dynamic_minmaxdefault: false,
    });
  }

  // init device profile
  yield DeviceProfile.remove();
  for (let i = 1; i <= 10; i++) {
    yield DeviceProfile.create({
      name: `name${i}`,
      version: `version${i}`,
      vendor: `vendor${i}`,
      family: `family${i}`,
      role: `role${i}`,
      model: `model${i}`,
      model_lname: `model long name ${i}`,
      model_sname: `model short name ${i}`,
      hardware: `hardware${i}`,
      software: `software${i}`,
      channelIds: [],
      createdAt: new Date(),
      createdBy: 'system',
    });
  }
}).then(() => {
  logger.info('done');
  process.exit();
}).catch((e) => {
  logger.error(e);
  logger.error(e.stack);
  process.exit();
});
