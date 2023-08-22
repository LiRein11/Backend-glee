const uuid = require('uuid');
const path = require('path');
const { Device, DeviceInfo, BasketDevice } = require('../models/models');
const ApiError = require('../Error/ApiError');
const { Sequelize } = require('sequelize');
class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info, text, favorite } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + '.jpg';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
        text,
        favorite,
      });

      if (info) {
        info = JSON.parse(info); // Когда данные приходят из форм даты, то они приходят в виде строки, для этого их нужно спарсить (приходит массив в виде строки)
        info.forEach((i) =>
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id,
          }),
        );
      }
      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res) {
    try {
      let { name, price, brandId, typeId, text, favorite } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + '.jpg';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));

      const deviceId = req.params.id;

      await Device.update(
        {
          name,
          price,
          brandId,
          typeId,
          text,
          favorite,
          img: fileName,
          price,
          brandId,
          typeId,
          text,
          favorite,
        },
        { where: { id: deviceId } },
      );

      return res.json('Device обновлён');
    } catch (e) {
      console.error(e);
    }
  }

  async getAll(req, res) {
    let { brandId, typeId, limit, page, priceMin, priceMax } = req.query;

    page = page || 1;
    limit = limit || 9;
    priceMin = priceMin || 0;
    priceMax = priceMax || 360;

    let offset = page * limit - limit; // отступ
    let devices;

    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: { price: { [Sequelize.Op.between]: [priceMin, priceMax] } },
        limit,
        offset,
      }); // Фильтрация по цене
    }

    if (brandId && !typeId) {
      if (brandId === 0) {
        devices = await Device.findAndCountAll({
          where: { price: { [Sequelize.Op.between]: [priceMin, priceMax] } },
          limit,
          offset,
        });
      }
      devices = await Device.findAndCountAll({
        where: { brandId, price: { [Sequelize.Op.between]: [priceMin, priceMax] } },
        limit,
        offset,
      });
    }

    if (!brandId && typeId) {
      if (typeId === 0) {
        devices = await Device.findAndCountAll({
          where: { price: { [Sequelize.Op.between]: [priceMin, priceMax] } },
          limit,
          offset,
        });
      }
      devices = await Device.findAndCountAll({
        where: { typeId, price: { [Sequelize.Op.between]: [priceMin, priceMax] } },
        limit,
        offset,
      });
    }

    if (brandId && typeId) {
      if (typeId === 0 && brandId === 0) {
        devices = await Device.findAndCountAll({
          where: { price: { [Sequelize.Op.between]: [priceMin, priceMax] } },
          limit,
          offset,
        });
      }
      if (brandId === 0) {
        devices = await Device.findAndCountAll({
          where: { typeId, price: { [Sequelize.Op.between]: [priceMin, priceMax] } },
          limit,
          offset,
        });
      }
      if (typeId === 0) {
        devices = await Device.findAndCountAll({
          where: { brandId, price: { [Sequelize.Op.between]: [priceMin, priceMax] } },
          limit,
          offset,
        });
      }

      devices = await Device.findAndCountAll({
        where: { typeId, brandId, price: { [Sequelize.Op.between]: [priceMin, priceMax] } },
        limit,
        offset,
      });
    }

    return res.json(devices);
  }

  async getAllDevices(req, res) {
    const devices = await Device.findAndCountAll();
    return res.json(devices);
  }
  // async getAll(req, res) {
  //   let { brandId, typeId, page } = req.query;
  //   page = page || 1;

  //   let offset = page;
  //   let devices;
  //   if (!brandId && !typeId) {
  //     devices = await Device.findAndCountAll({ offset });
  //   }
  //   if (brandId && !typeId) {
  //     devices = await Device.findAndCountAll({ where: { brandId }, offset });
  //   }
  //   if (!brandId && typeId) {
  //     devices = await Device.findAndCountAll({ where: { typeId }, offset });
  //   }
  //   if (brandId && typeId) {
  //     devices = await Device.findAndCountAll({ where: { typeId, brandId }, offset });
  //   }
  //   return res.json(devices);
  // }

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: 'info' }],
    }); // Получение id и массива характеристик девайса
    return res.json(device);
  }
}

module.exports = new DeviceController();
