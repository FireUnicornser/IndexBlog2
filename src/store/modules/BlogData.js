const initState = function () {
    return {
        POSTS: []
    }
}

import octokit from "@/utils/octokit"

export default {
    state: initState(),
    getters: {
        GET_BLOG_LENGTH: function (state) {
            return state.POSTS.length
        }
    },
    actions: {
        BLOG_POST_INIT(context) {
            return new Promise(function (resolve) {
                context.dispatch('BLOG_BODY_INIT').then(function () {
                    context.dispatch('BLOG_COMMENTS_INIT').then(function () {
                        resolve()
                    })
                })
            })

        },
        BLOG_BODY_INIT(context) {
            return new Promise(function (resolve) {
                context.commit('STEP_COMMIT_CHANGE', {
                    STEP_NAME: 'GET_BLOG_BODY',
                    STEP_TOTAL: 1,
                    STEP_DESCRIBE: '获取文章列表',
                })
                octokit.request("GET /repos/{owner}/{repo}/issues", {
                    owner: "FireUnicornser",
                    repo: "govBlog",
                    creator: 'FireUnicornser'
                })
                    .then(function (json) {
                        return json.data
                    })
                    .then(function (datas) {
                        var formatDatas = []
                        for (const data in datas) {
                            var formatLabels = []
                            for (const label in datas[data].labels) {
                                formatLabels.push({
                                    NAME: datas[data].labels[label].name,
                                    DESCRIPTION: datas[data].labels[label].description
                                })
                            }
                            formatDatas.push(
                                {
                                    ISSUES_NUMBER: datas[data].number,
                                    LABELS: formatLabels,
                                    TITLE: datas[data].title,
                                    BODY: datas[data].body,
                                    CREATE_TIME: datas[data].created_at
                                })
                        }
                        context.commit('BLOG_POST_INIT', formatDatas)
                        context.commit('STEP_ADD')
                        resolve()
                    })
            })
        },
        BLOG_COMMENTS_INIT(context) {
            return new Promise(function (resolve) {
                context.commit('STEP_COMMIT_CHANGE', {
                    STEP_NAME: 'GET_BLOG_COMMENTS',
                    STEP_TOTAL: context.getters.GET_BLOG_LENGTH,
                    STEP_DESCRIBE: '获取文章评论',
                })
                for (const post in context.state.POSTS) {
                    octokit.request("GET /repos/{owner}/{repo}/issues/{number}/comments", {
                        owner: "FireUnicornser",
                        repo: "govBlog",
                        number: context.state.POSTS[post].ISSUES_NUMBER,
                        creator: 'FireUnicornser'
                    })
                        .then(function (json) {
                            return json.data
                        })
                        .then(function (datas) {
                            var formatDatas = []
                            for (const data in datas) {
                                formatDatas.push(
                                    {
                                        USER: datas[data].user.login,
                                        AVATAR: datas[data].user.avatar_url,
                                        HOME: datas[data].user.html_url,
                                        BODY: datas[data].body,
                                        CREATE_TIME: datas[data].created_at
                                    }
                                )
                            }
                            context.commit('BLOG_COMMIT_ADD', {
                                id: post,
                                comments: formatDatas
                            })
                            context.commit('STEP_ADD')
                            if (context.rootState.BlogLoad.STEP_FINISH_STATE >= context.rootState.BlogLoad.STEP_TOTAL_STATE) {
                                resolve()
                            }
                        })
                }
            })
        }
    },
    mutations: {
        BLOG_POST_INIT(state, data) {
            state.POSTS = data
        },
        BLOG_COMMIT_ADD(state, data) {
            state.POSTS[data.id]["COMMENTS"] = data.comments
        }
    }
}