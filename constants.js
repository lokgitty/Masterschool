const FLOW = [
    {
        description: 'Personal Details Form',
        payload: { first_name: null, last_name: null, email: null, timestamp: null }
    },
    {
        description: 'IQ Test',
        payload: { test_id: null, score: 75, timestamp: null }
    },
    {
        description: 'Interview',
        tasks: [{
            description: 'Schedule interview',
            payload: { interview_date: null }
        },
        {
            description: 'Perform interview',
            payload: { interview_date: null, interviewer_id: null, decision: 'passed_interview' }

        },
        ]

    }, {
        description: 'Sign Contract',
        tasks: [{
            description: 'Upload identification document',
            payload: { passport_number: null, timestamp: null }

        },
        {
            description: 'Sign the contract',
            payload: { timestamp: null }

        }]

    }, {
        description: 'Payment',
        payload: { payment_id: null, timestamp: null }


    }, {
        description: 'Join Slack',
        payload: { email: null, timestamp: null }


    },
]

const COMPLEX_STEP = 'complexStep'

const TASK_STATUS = {
    DONE: 'done',
    REJECT: 'reject',
    NOT_DONE: 'not done'
}

module.exports = {
    FLOW,
    COMPLEX_STEP,
    TASK_STATUS
}