const express = require('express');
const router = express.Router();
const flowService = require('./services/flow');
const taskService = require('./services/task');



const cors = require('cors');

router.all('*', cors());

router.route('/flow').post(flowService.create);
router.route('/entireFlow/:id').get(flowService.getEntireFlow);
router.route('/getStatus/:id').get(flowService.getStatus);

router.route('/currentStep/:id').get(taskService.getCurrentStepAndTask);
router.route('/task/:id').put(taskService.updateTask);

module.exports = router;