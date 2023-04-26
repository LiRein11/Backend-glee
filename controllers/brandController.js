const { Brand, Device } = require('../models/models');
const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');

class BrandController {
  async create(req, res) {
    const { name } = req.body;
    const brand = await Brand.create({ name });
    return res.json(brand);
  }

  // async getAll(req, res) {
  //   const brands = await Brand.findAll();
  //   const [count] = await Device.findAndCountAll.map((el,ids)=>({where:{brandId: el.id}}))
  //   console.log(count)
  //   return res.json(brands);
  // }

  async getAll(req, res) {
    const brands = await Brand.findAll();
    const updatedBrands = await Promise.all(
      brands.map(async (brand) => {
        const devicesCount = await Device.count({ where: { brandId: brand.id } });
        return { ...brand.toJSON(), devicesCount };
      }),
    );
    return res.json(updatedBrands);
  }
  
  async deleteBrand(req, res) {
    const { id } = req.params;
    const brand = await Brand.findOne({ where: { id: id } });
    brand.destroy();
    return res.json('Бренд удален');
  }
}

module.exports = new BrandController();
