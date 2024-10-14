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
    cpf: joi.string().length(11).pattern(/^[0-9]+$/).required(), 
    name: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    address: joi.string().min(5).max(255).required(),
    phone: joi.string().min(10).max(15).required(),
  });

  return schema.validate(client);
}

function UpdateClient(client) {
  const schema = joi.object().keys({
    cpf: joi.string().length(11).pattern(/^[0-9]+$/),  
    name: joi.string().min(3).max(50),
    email: joi.string().email(),
    address: joi.string().min(5).max(255),
    phone: joi.string().min(10).max(15),
  }).or('cpf', 'name', 'email', 'address', 'phone'); 

  return schema.validate(client);
}

module.exports = {
  GetClients,
  CreateClient,
  UpdateClient,
};
