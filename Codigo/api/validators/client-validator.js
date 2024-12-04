const joi = require("joi");

function GetClients(req) {
  const schema = joi.object().keys({
    pagina: joi.number().integer().min(1).allow(null),
    quantidade: joi.number().integer().min(1).max(20).allow(null),
  });

  return schema.validate(req.query);
}

function CreateClient(client) {
  const schema = joi.object().keys({
    cpf: joi
      .string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .required(),
    name: joi.string().min(3).max(50).required(),
    email: joi.string().email().optional(),
    address: joi.string().min(5).max(255).required(),
    phone: joi.string().min(10).max(15).required(),
    cashback: joi.number().precision(2).default(0),
  });

  return schema.validate(client);
}

function UpdateClient(client) {
  const schema = joi
    .object()
    .keys({
      cpf: joi
        .string()
        .length(11)
        .pattern(/^[0-9]+$/),
      name: joi.string().min(3).max(50),
      email: joi.string().email(),
      address: joi.string().min(5).max(255),
      phone: joi.string().min(10).max(15),
      cashback: joi.number().precision(2).default(0),
    })
    .or("cpf", "name", "email", "address", "phone", "cashback");

  return schema.validate(client);
}

function GetById(params) {
  const schema = joi.object({
    id: joi.number().integer().required(),
  });

  return schema.validate(params);
}

function GetByCpf(params) {
  const schema = joi.object({
    cpf: joi
      .string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .required(),
  });

  return schema.validate(params);
}

module.exports = {
  GetClients,
  CreateClient,
  UpdateClient,
  GetById,
  GetByCpf,
};
