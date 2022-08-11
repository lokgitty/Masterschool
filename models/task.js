const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { TASK_STATUS } = require('../constants');


const taskSchema = new Schema({
  description: String,

  status: { type: String, default: TASK_STATUS.NOT_DONE, enum: [TASK_STATUS.NOT_DONE, TASK_STATUS.DONE, TASK_STATUS.REJECT] },
  payload:  {},
});
const Task = mongoose.model('task', taskSchema);


const ComplexStep = Task.discriminator('complexStep',
new mongoose.Schema({tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]}));

module.exports = { Task, ComplexStep };