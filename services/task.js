const { COMPLEX_STEP, TASK_STATUS } = require('../constants');
const Flow = require('../models/flow');
const { Task } = require('../models/task');

module.exports = {
    updateTask: (req, res) => {
        const flowId = req.params.id;
        const stepName = req.body.name;
        Flow.findOne({ _id: flowId }).populate({ path: 'tasks', model: Task, populate: { path: 'tasks', model: Task } })
            .exec(async (err, f) => {
                if (err) throw err;
                if (f.tasks.find(t => t.status === TASK_STATUS.REJECT)) {
                    return res.json({ 'message': 'The flow reject so it cannot be updated' });
                }
                const step = f.tasks.find(t => t.status === TASK_STATUS.NOT_DONE)
                if (step && step.description !== stepName) {
                    if (f.tasks.find(t => t.description === stepName).status === TASK_STATUS.DONE) {
                        return res.json({ 'message': 'The task is already done' });
                    }
                    return res.json({ 'message': "There is previous task you haven't done yet" });

                }
                const payload = req.body.payload;
                let task = step
                if (COMPLEX_STEP === step.__t) {
                    task = task.tasks.find(t => t.status === TASK_STATUS.NOT_DONE)
                }

                for (const [datail, condition] of Object.entries(task.payload)) {

                    if (!(datail in payload)) {
                        return res.json({ 'message': 'Not all the requested data sended' });
                    }
                    if (condition !== null) {
                        if (typeof condition === 'number') {
                            if (condition > payload[datail]) {
                                step.status = TASK_STATUS.REJECT
                                const updateStep = await step.save()
                                if (COMPLEX_STEP === step.__t) {
                                    task.status = TASK_STATUS.REJECT;
                                    await task.update()
                                    return res.json(updateStep);
                                }
                                else {
                                    return res.json(updateStep);
                                }
                            }
                        } else {
                            if (condition !== payload[datail]) {
                                step.status = TASK_STATUS.REJECT
                                const updateStep = await step.save()
                                if (COMPLEX_STEP === step.__t) {
                                    task.status = TASK_STATUS.REJECT;
                                    await task.update()
                                    if (err) throw err;
                                    return res.json(updateStep);
                                }
                                else {
                                    return res.json(updateStep);
                                }
                            }
                        }
                    }
                }
                task.status = TASK_STATUS.DONE
                task.save((err, updateTask) => {
                    if (err) throw err;
                    if (COMPLEX_STEP === step.__t && step.tasks.findIndex(object => object._id === task._id) === step.tasks.length - 1) {
                        step.status = TASK_STATUS.DONE;
                        step.save((err, updateStep) => {
                            if (err) throw err;
                            res.json(updateStep);
                        });
                    }
                    else {
                        res.json(updateTask);
                    }
                });
            })
    },
    
    getCurrentStepAndTask: (req, res) => {
        const flowId = req.params.id;
        Flow.findOne({ _id: flowId }).populate({ path: 'tasks', model: Task, populate: { path: 'tasks', model: Task } })
            .exec((err, f) => {
                if (err) throw err;
                const step = f.tasks.find(s => s.status === TASK_STATUS.REJECT || s.status === TASK_STATUS.NOT_DONE)
                if (step === undefined) {
                    return res.json({ message: 'accepted all flow' });
                }
                else {
                    const message = { step: step.description }
                    if (COMPLEX_STEP === step.__t) {
                        const task = step.tasks.find(t => t.status === TASK_STATUS.REJECT || t.status === TASK_STATUS.NOT_DONE)
                        message.task = task.description
                    }
                    return res.json(message);
                }
            })
    },
}