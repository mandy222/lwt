module.exports = app => {
    require('./auth')(app)
    require('./role')(app)
    require('./category')(app)
    const express = require('express')
    const assert = require('http-assert')
    const jwt = require('jsonwebtoken')
    const User = require('../../models/User')
    const Info = require('../../models/Information')
    const router = express.Router({
        mergeParams: true
    })

    // 创建
    router.post('/create', async (req, res) => {
        if (req.Model.modelName === 'Role') {
            const { name } = req.body
             const role = await req.Model.findOne({ name })
             JSON.stringify(role) !== 'null' && assert(undefined, 422, '角色名称重复')
        }
        if (req.Model.modelName === 'User') {
            const {
                username
            } = req.body
            const user = await req.Model.findOne({
                username
            })
            JSON.stringify(user) !== 'null' && assert(undefined, 422, '用户名称重复')
        }
        if (req.Model.modelName === 'Authority') {
            const { code } = req.body
            const auth = await req.Model.findOne({ code })
            JSON.stringify(auth) !== 'null' && assert(undefined, 422, '权限编码重复')
        }

        await req.Model.create(req.body)

        if (req.Model.modelName === 'Trend') {
            const { likes, comments } = req.body
            // 查找最新插入的动态
            const trendsRes = await req.Model.find({}).limit(1).sort({_id:-1})

            // 点赞时自动创建未读消息
            if (likes) {
                for (let i = 0; i < likes.length; i++) {
                    let info = {
                        recipient: req.body.user,
                        sender: likes[i],
                        category: '5e8f0851fc93c137e413537f', // 点赞分类
                        content: trendsRes[0]._id
                    }
                    if (info.recipient !== info.sender) {
                        await Info.create(info)
                    }
                }
            }
            if (comments) {
                for (let i = 0; i < comments.length; i++) {
                    let info = {
                        recipient: req.body.user,
                        sender: comments[i].user,
                        category: '5e8f0845fc93c137e413537e', // 评论分类
                        content: trendsRes[0]._id,
                        comment: comments[i].content
                    }
                    if (info.recipient !== info.sender) {
                        await Info.create(info)
                    }
                }
            }
        }
        res.send({
            success: true
        })
    })

    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    // 更新
    router.put('/update/:id', async (req, res) => {
        if (req.Model.modelName === 'Trend') {
            const {
                likes,
                comments
            } = req.body

            // 查找原来的动态
            const trendsRes = await req.Model.findById(req.params.id)
            
            let oldLikes = []
            let newLikes = []
            for (let i = 0; i < trendsRes.likes.length; i++) {
                oldLikes.push(String(trendsRes.likes[i]))
            }

            // 点赞时自动创建未读消息 长度
            if (likes.length > 0) {
                // 判断是否有新增的点赞
                const arr = likes.concat(oldLikes)
                for (let k = 0; k < arr.length; k++) {
                    if (oldLikes.indexOf(arr[k]) === -1 && newLikes.indexOf(arr[k]) === -1) {
                        newLikes.push(arr[k])
                    }
                }

                for (let j = 0; j < newLikes.length; j++) {
                    let info = {
                        recipient: req.body.user,
                        sender: newLikes[j],
                        category: '5e8f0851fc93c137e413537f', // 点赞分类
                        content: req.params.id
                    }
                    if (info.recipient !== info.sender) {
                        await Info.create(info)
                    }
                }
            }

            let oldComments = []
            for (let i = 0; i < trendsRes.comments.length; i++) {
                trendsRes.comments[i].id = trendsRes.comments[i]._id
                delete trendsRes.comments[i]._id
                // delete trendsRes.comments[i].commentsTime
                oldComments.push(JSON.stringify({
                    id: String(trendsRes.comments[i]._id),
                    commentsTime: String(new Date(trendsRes.comments[i].commentsTime).format("yyyy-MM-dd hh:mm:ss")),
                    user: String(trendsRes.comments[i].user),
                    content: String(trendsRes.comments[i].content)
                }))
            }

            // console.log('oldComments', oldComments)

            let commentsTemp = Array.from(comments)
            for (let i = 0; i < commentsTemp.length; i++) {
                // delete commentsTemp[i].commentsTime
                commentsTemp[i].commentsTime = new Date(commentsTemp[i].commentsTime).format("yyyy-MM-dd hh:mm:ss")
                commentsTemp[i] = JSON.stringify(commentsTemp[i])
            }

            console.log('commentsTemp', commentsTemp)
            let newComments = []
            if (comments.length > 0) {
                const arr = commentsTemp.concat(oldComments)
                // console.log('arr', arr)
                for (let n = 0; n < arr.length; n++) {
                    // console.log('arr[n]', arr[n])
                    if (oldComments.indexOf(arr[n]) === -1 
                    && newComments.indexOf(arr[n]) === -1 ) {
                        newComments.push(arr[n])
                    }
                }
                console.log('newComments', newComments)
                for (let i = 0; i < newComments.length; i++) {
                    newComments[i] = JSON.parse(newComments[i])
                    // // console.log('newComments[i]', newComments[i])
                    if (req.body.user !== newComments[i].user) {
                        let info = {
                            recipient: req.body.user,
                            sender: newComments[i].user,
                            category: '5e8f0845fc93c137e413537e', // 评论分类
                            content: req.params.id,
                            comment: newComments[i].content
                        }
                        await Info.create(info)
                    }
                }
            }
        }
        await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send({
            success: true
        })
    })

    // 删除
    router.delete('/delete/:id', async (req, res) => {
        await req.Model.findByIdAndDelete(req.params.id)
        res.send({
            success: true
        })
    })

    // 列表查询
    router.get('/list', async (req, res) => {
        const queryOptions = {}
        if (req.Model.modelName === 'Role') {
            queryOptions.select = {
                'name': 1
            }
        }
        const items = await req.Model.find()
            .setOptions(queryOptions).sort({
                'updatedAt': -1
            }).lean()
        res.send(items)
    })
    // 列表分页查询
    router.get('/page/list', async (req, res) => {
        const queryOptions = {}
        const queryOptions2 = {}
        const queryOptions3 = {}
        const queryOptions4 = {}
        let searchArr = []
        // // console.log('req.query.searchForm', req.query.searchForm)
        const searchForm = req.query.searchForm && JSON.parse(req.query.searchForm) || {}
        // // console.log('searchForm', searchForm)
        // 处理查询逻辑与字段显示
        if (req.Model.modelName === 'Category') {
            queryOptions.populate = {
                path: 'parent',
                select: {
                    name: 1
                }
            }
        }

        if (req.Model.modelName === 'User') {
            queryOptions.populate = {
                path: 'role',
                select: {name: 1}
            }
            queryOptions2.populate = {
                path: 'follower',
                select: {
                    username: 1
                }
            }
            queryOptions3.populate = {
                path: 'fans',
                select: {
                    username: 1
                }
            }
        }

        if (req.Model.modelName === 'Activity') {
            queryOptions.populate = {
                path: 'participants',
                select: {
                    username: 1
                }
            }
            queryOptions.select = {
                createdAt: 0,
                updatedAt: 0
            }
            queryOptions3.populate = {
                path: 'categories',
                select: {
                    name: 1
                }
            }
            queryOptions4.populate = {
                path: 'collectedUsers',
                select: {
                    username: 1
                }
            }
        }

        if (req.Model.modelName === 'Information') {
            queryOptions.populate = {
                path: 'recipient',
                select: {
                    username: 1
                }
            }
            queryOptions2.populate = {
                path: 'sender',
                select: {
                    username: 1
                }
            }
            queryOptions3.populate = {
                path: 'category',
                select: {
                    name: 1
                }
            }
        }

        if (req.Model.modelName === 'Trend') {
            queryOptions.populate = {
                path: 'user',
                select: {
                    username: 1
                }
            }
            queryOptions.select = {
                updatedAt: 0
            }
        }

        if (req.Model.modelName === 'News') {
            queryOptions.populate = {
                path: 'categories',
                select: {
                    name: 1
                }
            }
        }

        // 处理条件查询 字符串类型用$regex 数组匹配用$in
        if (searchForm) {
            for (let key in searchForm) {
                let obj = {}
                if (req.Model.modelName === 'Activity') {
                    if (key === 'categories') {
                        obj[key] = {
                            $in: searchForm[key]
                        }
                    }
                    else if (key === 'status') {
                        obj[key] = searchForm[key]
                    }
                    else if (key === 'time') {
                        startTime = new Date(searchForm[key])
                        startTime = new Date(startTime.setDate(startTime.getDate() - 1))
                        obj[key] = {
                            '$gte': new Date(startTime),
                            '$lt': new Date(searchForm[key])
                        }
                    }
                    else {
                        obj[key] = {
                            $regex: searchForm[key]
                        }
                    }
                } 
                 else if (req.Model.modelName === 'Information') {
                    obj[key] = searchForm[key]
                }
                else if (req.Model.modelName === 'Category') {
                    if (key === 'parent') {
                        obj[key] = searchForm[key]
                    } else {
                        obj[key] = {
                            $regex: searchForm[key]
                        }
                    }
                }
                else if (req.Model.modelName === 'News') {
                    if (key === 'categories') {
                       obj[key] = {
                           $in: searchForm[key]
                       }
                    } else {
                        obj[key] = {
                            $regex: searchForm[key]
                        }
                    }
                }
                else if (req.Model.modelName === 'Trend') {
                     if ( key === 'createdAt' ) {
                        startTime = new Date(searchForm[key])
                        // 时间+1天
                        endTime = new Date(startTime.setDate(startTime.getDate() + 1))
                        obj[key] = {
                            '$gte': new Date(searchForm[key]),
                            '$lt': new Date(endTime)
                        }
                    } else {
                        obj[key] = searchForm[key]
                    }
                }
                else {
                    obj[key] = {
                        $regex: searchForm[key]
                    }
                }
                searchArr.push(obj)
            }
        }
        // // console.log('searchArr', searchArr)

        // 执行查询
        const pageSize = parseInt(req.query.pageSize) || 1000
        const currentPage = parseInt(req.query.currentPage) || 1
        const start = (currentPage - 1) * pageSize
        let total = 0
        let list = []
        if (searchArr.length !== 0) {
            total = await req.Model.count({ $and: searchArr })
            list = await req.Model.find({$and: searchArr})
                .setOptions(queryOptions)
                .setOptions(queryOptions2)
                .setOptions(queryOptions3)
                .setOptions(queryOptions4)
                .skip(start)
                .limit(pageSize)
                .sort({
                    'updatedAt': -1
                })
        } else {
            total = await req.Model.estimatedDocumentCount()
            list = await req.Model.find()
                .setOptions(queryOptions)
                .setOptions(queryOptions2)
                .setOptions(queryOptions3)
                .setOptions(queryOptions4)
                .skip(start)
                .limit(pageSize)
                .sort({
                    // 'status': -1,
                    'updatedAt': -1
                })
        }
        
        res.send({
            list,
            total
        })
    })

    // 详情查询
    router.get('/list/:id', async (req, res) => {
        const queryOptions = {}
        if (req.Model.modelName === 'Role') {
            queryOptions.populate = {
                'name': 1
            }
        }
        const model = await req.Model.findById(req.params.id).setOptions(queryOptions)
        res.send(model)
    })

    // 登录校验中间件
    const authMiddleware = require('../../middleware/auth')
    const resourceMiddleware = require('../../middleware/resource')
    app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)
    // app.use('/admin/api/rest/:resource', resourceMiddleware(), router)

    // 登录
    app.post('/admin/api/login', async (req, res) => {
        const {
            username,
            password
        } = req.body
        // 1.根据用户名找用户

        const user = await User.findOne({
            username
        }).select('+password')
        assert(user, 422, '用户不存在')
        // 2.校验密码
        const isValid = require('bcrypt').compareSync(password, user.password)
        assert(isValid, 422, '密码错误')
        // 3.返回token
        const token = jwt.sign({
            id: user._id
        }, app.get('secret'))
        res.send({  
            token
        })
    })

    // 退出
    app.post('/admin/api/logout', authMiddleware(), async (req, res) => {
        res.send({
            success: true
        })
    })

    // 获取用户信息
    app.get('/admin/api/user/info', authMiddleware(), async (req, res) => {
        // console.log('req', req.body.token)
        const token = String(req.headers.authorization || '').split(' ').pop()
        assert(token, 401, '请先登录')
        const {
            id
        } = jwt.verify(token, req.app.get('secret'))
        assert(id, 401, '请先登录')

        const model = await User.findById(id)
        .populate({
            path: 'role',
            populate: {
                path: 'authorities',
                select: {'code': 1, '_id': 0}
            }
        })
        assert(model, 401, '请先登录')
        const roles = []
        model.role.authorities.map(item => {
            roles.push(item.code)
        })
        const data = {
            // roles: ['admin'],
            roles,
            ...model._doc
        }
        delete data.role
        res.send(data)
    })

    // 上传图片
    const multer = require('multer')
    const upload = multer({
        dest: __dirname + '/../../uploads'
    })
    app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })

    // 错误处理函数
    app.use(async (err, req, res, next) => {
        // console.log(err)
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })

}