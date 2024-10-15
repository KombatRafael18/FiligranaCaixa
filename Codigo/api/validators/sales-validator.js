const joi = require("joi");

function CreateSale(sale) {
  const schema = joi.object().keys({
    clientId: joi.number().integer().required(),
    totalAmount: joi.number().positive().required(),
    saleType: joi.string().valid('Varejo', 'Atacado').required(),
    paymentMethod: joi.string().valid('Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Pix', 'Boleto').required()
  });

  return schema.validate(sale);
}

function UpdateSale(sale) {
  const schema = joi.object().keys({
    clientId: joi.number().integer(),
    totalAmount: joi.number().positive(),
    saleType: joi.string().valid('Varejo', 'Atacado'),
    paymentMethod: joi.string().valid('Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Pix', 'Boleto')
  }).or('clientId', 'totalAmount', 'saleType', 'paymentMethod');

  return schema.validate(sale);
}

module.exports = {
  CreateSale,
  UpdateSale
};
