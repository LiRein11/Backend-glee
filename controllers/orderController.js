const { Order, OrderDevice, Device, Brand, Type } = require('../models/models');
const jwt = require('jsonwebtoken');

class OrderController {
  async create(req, res) {
    try {
      const auth = req.headers.authorization || '';
      const { mobile, basket } = req.body;
      let parseDevices = [];
      for (let key of basket) {
        parseDevices.push(key);
      }
      console.log(parseDevices);
      // const isDeviceInDb = await Device.findAndCountAll({
      //   where: { id: parseDevices },
      //   attributes: ['id'],
      // });
      // isDeviceInDb.count === parseDevices.length
      if (parseDevices) {
        // Если все девайсы будут найдены в БД
        const row = { mobile };
        if (auth) {
          const token = auth.split(' ')[1];
          const { id } = jwt.verify(token, process.env.SECRET_KEY);
          row.userId = id;
          await Order.create(row).then((order) => {
            const { id } = order.get();
            parseDevices.forEach(async (deviceId, i) => {
              await OrderDevice.create({
                deviceId: deviceId.deviceId,
                orderId: id,
                // count: basket[i].count,
              });
            });
          });
        } else{
          await Order.create(row).then((order) => {
            const { id } = order.get();
            parseDevices.forEach(async (deviceId, i) => {
              await OrderDevice.create({
                deviceId: deviceId.id,
                orderId: id,
                // count: basket[i].count,
              });
            });
          });
        }

      } else {
        // Отправка сообщения о девайсах, которые не найдены в БД
        // const notFoundIdDevices = [];
        // const arrDevices = []; // Найденный id
        // isDeviceInDb.rows.forEach((item) => arrDevices.push(item.id));
        // parseDevices.forEach((deviceId) => {
        //   if (!arrDevices.includes(deviceId)) {
        //     notFoundIdDevices.push(deviceId);
        //   }
        // });
        return ApiError.badRequest(
          // res.json(`Устройства с таким id ${notFoundIdDevices.join(', ')} не существуют в БД`),
          res.json('Ошибка с БД')
        );
      }

      return res.json('Спасибо за ваш заказ! Мы скоро свяжемся с вами!');
    } catch (e) {
      return res.json(e);
    }
  }

  async updateOrder(req, res) {
    try {
      const { complete, id } = req.body;

      await Order.findOne({ where: { id } }).then(async (data) => {
        if (data) {
          await Order.update({ complete }, { where: { id } }).then(() => {
            return res.json('Заказ обновлен');
          });
        } else {
          return res.json('Этого заказа не существует в БД');
        }
      });
    } catch (e) {
      return res.json('Обновление не завершено, так как произошла ошибка: ' + e);
    }
  }

  async deleteOrder(req, res) {
    try {
      const { id } = req.body;

      await Order.findOne({ where: { id } }).then(async (data) => {
        if (data) {
          await Order.destroy({ where: { id } }).then(() => {
            return res.json('Заказ удален');
          });
        } else {
          return res.json('Заказ не существует в БД');
        }
      });
    } catch (e) {
      return res.json('Удаление не завершено, так как произошла ошибка: ' + e);
    }
  }

  async getAll(req, res) {
    try {
      const {complete} = req.query;
      // , limit, page 
      // page = page || 1;
      // limit = limit || 4;
      // let offset = page * limit - limit;
      let devices;

// , limit, offset 
// , limit, offset 

      if (complete === 'Не завершено') {
        devices = await Order.findAndCountAll({ where: { complete: false }});
      } else if (complete === 'Завершено') {
        devices = await Order.findAndCountAll({ where: { complete: true }});
      
      } else {
        devices = await Order.findAndCountAll();
      }
      return res.json(devices);
    } catch (e) {
      return res.json(e);
    }
  }

  async getOne(req, res) {
    const { id } = req.params;
    const order = {};

    try {
      let devices;
      let infoDevices = [];
      await Order.findOne({ where: { id } })
        .then(async (data) => {
          order.descr = data;
          devices = await OrderDevice.findAll({
            attributes: ['deviceId', 'count'],
            where: { orderId: data.id },
          });

          for (let device of devises) {
            await Device.findOne({
              attributes: ['name', 'img', 'price'],
              where: { id: device.deviceId },
              include: [
                {
                  attributes: ['name'],
                  model: Type,
                },
                {
                  attributes: ['name'],
                  model: Brand,
                },
              ],
            }).then(async (item) => {
              let newObj = {
                descr: item,
                count: device.count,
              };
              infoDevices.push(newObj);
            });
          }
          order.devices = infoDevices;

          return res.json(order);
        })
        .catch(() => {
          return res.json('Заказ не существует в БД');
        });
    } catch (e) {
      return res.json('Удаление не завершено, так как произошла ошибка');
    }
  }
}

module.exports = new OrderController();
