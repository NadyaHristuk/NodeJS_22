const ToDo_model = require('./todo_item');

module.exports.gets = () => ToDo_model.find();

module.exports.getById = (paramsID) => ToDo_model.findById(paramsID);

module.exports.add = (data) => ToDo_model.create(data);

module.exports.update = (paramsID, data) => ToDo_model.findByIdAndUpdate(paramsID, { $set: { task: data.task }}, {new: true});

module.exports.delete = (paramsID) => ToDo_model.findOneAndRemove(paramsID);
