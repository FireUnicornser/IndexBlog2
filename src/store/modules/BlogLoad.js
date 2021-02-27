const initState = function () {
    return {
        BODY_STATE: 'READY_LOAD',
        PLUGINS_STATE: 'WAIT_BODY_LOAD',
        STEP_TOTAL_STATE: 0,
        STEP_FINISH_STATE: 0,
        STEP_PROCESS_NAME: 'FREE',
        STEP_DESCRIBE: ''
    }
}
export default {
    state: initState(),
    actions: {
        BLOG_LOAD_INIT(context) {
            return new Promise(function (resolve) {
                context.dispatch('BLOG_POST_INIT').then(function () {
                    context.commit('STEP_COMMIT_CHANGE', {
                        STEP_NAME: 'FREE',
                        STEP_TOTAL: 0,
                        STEP_DESCRIBE: '',
                    })
                    context.commit('BLOG_BODY_LOAD_DONE')
                    resolve()
                })
            })
        }
    },
    mutations: {
        BLOG_BODY_LOAD_DONE(state) {
            state.BODY_STATE = "LOAD_DONE"
            state.PLUGINS_STATE = "READY_LOAD"
        },
        STEP_COMMIT_CHANGE(state, Payload) {
            state.STEP_PROCESS_NAME = Payload.STEP_NAME
            state.STEP_FINISH_STATE = 0
            state.STEP_TOTAL_STATE = Payload.STEP_TOTAL
            state.STEP_DESCRIBE = Payload.STEP_DESCRIBE
        },
        STEP_ADD(state) {
            state.STEP_FINISH_STATE++
        }
    }
}