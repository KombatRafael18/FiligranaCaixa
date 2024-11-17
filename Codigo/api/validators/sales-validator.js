const joi = require("joi");

function CreateSale(sale) {
  const schema = joi.object().keys({
    client_id: joi.number().integer().allow(null).required(),
    total_amount: joi.number().positive().required(),
    discount: joi.number().min(0).required(),
    cashback: joi.number().min(0).required(),
    sale_type: joi.string().valid("varejo", "atacado").required(),
    payment_method: joi
      .string()
      .valid("CRÉDITO", "DÉBITO", "PIX", "PROMISSORIA", "QR PIX", "DINHEIRO")
      .required(),
    sale_date: joi.date().required(),
    products: joi
      .array()
      .items(
        joi.object({
          codigo: joi.string().required(),
          valor: joi.number().positive().required(),
          quantity: joi.number().positive().required(),
        })
      )
      .required(),
  });

  return schema.validate(sale);
}

function UpdateSale(sale) {
  const schema = joi
    .object()
    .keys({
      clientId: joi.number().integer(),
      totalAmount: joi.number().positive(),
      saleType: joi.string().valid("Varejo", "Atacado"),
      paymentMethod: joi
        .string()
        .valid("Crédito", "Débito", "Dinheiro", "Pix", "QR Pix", "Promissoria"),
    })
    .or("clientId", "totalAmount", "saleType", "paymentMethod");

  return schema.validate(sale);
}

module.exports = {
  CreateSale,
  UpdateSale,
};
