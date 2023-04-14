const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
  favorites: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
});

const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketDevice = sequelize.define('basket_device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// const FavoritesBasket = sequelize.define('favorites', {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
// });

// const FavoritesDevice = sequelize.define('favorites_device', {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
// });

const Device = sequelize.define('device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, defaultValue: 0 },
  img: { type: DataTypes.STRING, allowNull: false },
  text: { type: DataTypes.STRING, allowNull: true },
  // favorite: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const Type = sequelize.define('type', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Brand = sequelize.define('brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  devicesCount: { type: DataTypes.INTEGER, allowNull: true },
});

// const Favorites = sequelize.define('favorites', {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   favorit: { type: DataTypes.INTEGER, allowNull: false, defaultValue: false },
// });

const Rating = sequelize.define('rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});

const DeviceInfo = sequelize.define('device_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

const TypeBrand = sequelize.define('type_brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Order = sequelize.define('order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  complete: { type: DataTypes.BOOLEAN, defaultValue: false },
  mobile: { type: DataTypes.STRING(25), allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: true },
});

const OrderDevice = sequelize.define('order_device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  deviceId: { type: DataTypes.INTEGER, allowNull: false },
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  // count: { type: DataTypes.INTEGER, allowNull: false },
});

User.hasOne(Basket);
Basket.belongsTo(User);

// User.hasOne(FavoritesBasket);
// FavoritesBasket.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

// User.hasMany(Favorites);
// Favorites.belongsTo(User);

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);

// FavoritesBasket.hasMany(FavoritesDevice);
// FavoritesDevice.belongsTo(FavoritesBasket);

Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

// Device.hasMany(FavoritesDevice);
// FavoritesDevice.belongsTo(Device);

Device.hasMany(DeviceInfo, { as: 'info' });
DeviceInfo.belongsTo(Device);

Device.hasMany(Rating);
Rating.belongsTo(Device);

// Device.hasMany(Favorites);
// Favorites.belongsTo(Device);

Type.hasMany(Device);
Device.belongsTo(Type);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

User.hasMany(Order);
Order.belongsTo(User, {
  foreignKey: { name: 'userId' },
});

Order.hasMany(OrderDevice);
OrderDevice.belongsTo(Order, {
  foreignKey: { name: 'orderId' },
});

module.exports = {
  User,
  Basket,
  // FavoritesBasket,
  Device,
  Rating,
  Brand,
  BasketDevice,
  // FavoritesDevice,
  Type,
  DeviceInfo,
  TypeBrand,
  Order,
  OrderDevice,
  // Favorites,
};
