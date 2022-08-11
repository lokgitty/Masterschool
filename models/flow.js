const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flowSchema = new Schema({
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});

const Flow = mongoose.model('flow', flowSchema);

module.exports = Flow;