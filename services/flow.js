


const { FLOW, TASK_STATUS, COMPLEX_STEP } = require('../constants');
const Flow = require('../models/flow');
const { Task, ComplexStep } = require('../models/task');

module.exports = {
    create: async (req, res) => {
        const allSteps = await Promise.all(FLOW.map(async (step) => {
            if ('tasks' in step) {
                const tasks = await Promise.all(step.tasks.map(async (subStep) => {
                    const t = new Task(subStep)
                    return t.save();
                })
                )
                const tasksId = tasks.map(task => task._id)
                const c = new ComplexStep({ ...step, tasks: tasksId })
                return c.save()
            }
            const s = new Task(step)
            return s.save()
        }

        ))

        const stepsId = allSteps.map(step => step._id)
        const f = new Flow({ tasks: stepsId })

        f.save((err, flow) => {
            if (err) throw err;
            res.json(flow);
        });

    },

    getStatus: (req, res) => {
        const flowId = req.params.id;
        Flow.findOne({ _id: flowId }).populate({ path: 'tasks', model: Task }).exec((err, f) => {
            if (err) throw err;
            if (f.tasks.find(t => t.status === TASK_STATUS.REJECT)) {
                return res.json({ message: 'rejected' });
            }
            if (f.tasks.find(t => t.status === TASK_STATUS.NOT_DONE)) {
                return res.json({ message: 'in progress' });
            }
            return res.json({ message: 'accepted' });
        })
    },

    getEntireFlow: (req, res) => {
        const flowId = req.params.id;
        Flow.findOne({ _id: flowId }).populate({
            path: 'tasks', model: Task, select: { "payload": 0, "_id": 0, "__v": 0 }, populate: {
                path: 'tasks', model: Task, select: { "payload": 0, "_id": 0, "__v": 0 }
            }
        }).select({ "tasks": 1, "_id": 0 })
            .exec((err, f) => {
                if (err) throw err;
                res.json(f)
            })

    },
}

