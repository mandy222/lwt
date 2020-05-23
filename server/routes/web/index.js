module.exports = app => {
  require('./info')(app)
  // require('./role')(app)
  // require('./category')(app)
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
    // 注册
    if (req.Model.modelName === 'User') {
      req.body.role = '5e7c8b5592c942045439b0c6'
      const {
        username
      } = req.body
      const user = await req.Model.findOne({
        username
      })
      JSON.stringify(user) !== 'null' && assert(undefined, 422, '用户名重复')

      console.log('req.body', req.body)
      await req.Model.create(req.body)

      const user2 = await req.Model.findOne({
        username
      })
      console.log('user2', user2)
      const token = jwt.sign({
        id: user2._id
      }, app.get('secret'))
      res.send({
        token
      })
    } else {
      await req.Model.create(req.body)
      res.send({
        success: true
      })
    }
  })

  // 更新
  router.put('/update/:id', async (req, res) => {
    if (req.Model.modelName === 'User' || req.Model.modelName === 'Trend') {
      const {
        follower,
        sender,
        recipient,
        likeType,
        comments,
        commentsDel,
        password,
        oldPassword,
        detail
      } = req.body

      console.log('req.body', req.body)

      // 更改密码
      if (password) {
        // 1.根据用户名找用户
        const user = await User.findById(req.params.id).select('+password')
        assert(user, 422, '用户不存在')
        // 2.校验密码
        const isValid = require('bcrypt').compareSync(oldPassword, user.password)
        assert(isValid, 422, '原密码错误')
      }

      let info = {
        recipient: recipient,
        sender: sender,
        category: '5e8f0858fc93c137e4135380', // 默认为关注
      }

      // 1、处理关注时消息发送
      // 是否关注 对比原来的用户关注人 follower
      if (follower) {
        const oldRes = await req.Model.findById(req.params.id)
        const oldFollower = oldRes.follower
        if (follower.length > oldFollower.length) {
          await Info.create(info)
        }
      }

      // 自己的点赞和关注不发送消息
      if (info.recipient !== info.sender) {
        // 2、处理点赞时消息发送
        if (likeType) {
          info.category = '5e8f0851fc93c137e413537f'
          info.content = req.params.id
          await Info.create(info)
        }

        // 3、处理评论时消息发送
        // 是否评论 评论内容
        console.log('comments', comments)
        if (comments && !commentsDel) {
          info.comment = detail
          info.content = req.params.id
          info.category = '5e8f0845fc93c137e413537e'
          console.log('info', info)
          await Info.create(info)
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
    const pageSize = parseInt(req.query.pageSize) || 1000
    let _filter = {}

    // 首页推荐活动
    if (req.Model.modelName === 'Activity') {
      queryOptions.select = {
        'content': 0
      }
      _filter = {
        status: true
      }
    }

    // 子分类查询 传入上级权限名称
    if (req.Model.modelName === 'Category') {
      const parent = req.query.parent
      const {
        _id
      } = await req.Model.findOne({
        name: parent
      })
      _filter = {
        parent: _id
      }
      queryOptions.select = {
        'name': 1
      }
    }

    // 首页资讯查询
    if (req.Model.modelName === 'News') {
      const categories = req.query.categories
      _filter = {
        $and: [{
            categories: {
              $in: categories
            }
          },
          {
            cover: {
               $not: {
                 $size: 0
               }
            }
          }
        ]
      }
      queryOptions.select = {
        'title': 1,
        'cover': 1,
        'publisher': 1,
        'updatedAt': 1
      }
    }

    // 关注列表查询
    if (req.Model.modelName === 'User') {
      let follower = req.query.follower === 'null' ? [] : req.query.follower
      let fans = req.query.fans === 'null' ? [] : req.query.fans
      if (follower) {
        _filter = {
          $and: [{
              _id: {
                $in: follower
              }
            }]
        }
        queryOptions.select = {
          'username': 1,
          'avatar': 1,
          'fans': 1
        }
      }
      if (fans) {
        _filter = {
          $and: [{
            _id: {
              $in: fans
            }
          }]
        }
        queryOptions.select = {
          'username': 1,
          'avatar': 1,
          'follower': 1,
          'fans': 1
        }
      }
      
      
    }

    const items = await req.Model.find(_filter)
      .setOptions(queryOptions).sort({
        'updatedAt': -1
      }).limit(pageSize).lean()
    
    res.send(items)
  })

  // 列表分页查询
  router.get('/page/list', async (req, res) => {
    const queryOptions = {}
    const queryOptions2 = {}
    const queryOptions3 = {}
    const queryOptions4 = {}
    let _filter = {}
    if (req.Model.modelName === 'Activity' || req.Model.modelName === 'News') {
      const categories = req.query.categories
      const participants = req.query.participants
      const collectedUsers = req.query.collectedUsers
      if (categories) {
        _filter = {
          $and: [{
            categories: {
              $in: categories
            }
          }]
        }
      }

      if (collectedUsers) {
         _filter = {
           $and: [{
             collectedUsers: {
               $in: [collectedUsers]
             }
           }]
         }
      }

      if (participants) {
        _filter = {
          $and: [{
            participants: {
              $in: [participants]
            }
          }]
        }
      }
      
      queryOptions.select = {
        content: 0,
        address: 0,
        createdAt: 0,
        collectedUsers: 0
      }
    }

    if (req.Model.modelName === 'Trend') {
      const follow = req.query.follow || false
      const user = req.query.user || ''
      console.log('follow', follow)
      if (follow==='true') {
        const follower = req.query.follower || []
         _filter = {
           $and: [{
             user: {
               $in: follower
             }
           }]
         }
      }

      if (user) {
        _filter = {
          $and: [{
            user: user
          }]
        }
      }

      queryOptions.populate = {
        path: 'user',
        select: {
          username: 1,
          avatar: 1,
          fans: 1
        }
      }
      queryOptions.select = {
        updatedAt: 0
      }
      queryOptions2.populate = {
        path: 'comments.user',
        select: {
          username: 1
        }
      }
    }

    // 执行查询
    const pageSize = parseInt(req.query.pageSize) || 1000
    const currentPage = parseInt(req.query.currentPage) || 1
    const start = (currentPage - 1) * pageSize
    let total = 0
    let list = []
    total = await req.Model.count(_filter)
    list = await req.Model.find(_filter)
      .setOptions(queryOptions)
      .setOptions(queryOptions2)
      .setOptions(queryOptions3)
      .setOptions(queryOptions4)
      .skip(start)
      .limit(pageSize)
      .sort({
        'status': -1,
        'updatedAt': -1,
      })
    res.send({
      list,
      total
    })
  })

  // 详情查询
  router.get('/list/:id', async (req, res) => {
    const queryOptions = {}
    const queryOptions2 = {}
    if (req.Model.modelName === 'Trend') {
      queryOptions.populate = {
        path: 'user',
        select: {
          username: 1,
          avatar: 1,
          fans: 1
        }
      }
      queryOptions2.populate = {
        path: 'comments.user',
        select: {
          avatar: 1,
          username: 1,
          updatedAt: 1
        }
      }
    }
    const model = await req.Model.findById(req.params.id).setOptions(queryOptions).setOptions(queryOptions2)
    res.send(model)
  })

  // 登录校验中间件
  const authMiddleware = require('../../middleware/auth')
  const resourceMiddleware = require('../../middleware/resource')
  // app.use('/web/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)
  app.use('/web/api/rest/:resource', resourceMiddleware(), router)

  // 登录
  app.post('/web/api/user/login', async (req, res) => {
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
  app.post('/web/api/logout', authMiddleware(), async (req, res) => {
    res.send({
      success: true
    })
  })

  // 获取用户信息
  app.get('/web/api/user/info', authMiddleware(), async (req, res) => {
    const token = String(req.headers.authorization || '').split(' ').pop()
    assert(token, 401, '请先登录')
    const {
      id
    } = jwt.verify(token, req.app.get('secret'))
    assert(id, 401, '请先登录')

    const model = await User.findById(id)
      .select({
        'username': 1,
        'avatar': 1,
        'fans': 1,
        'follower': 1
      })
    const { _id } = model
    // 未读消息
    const message = await Info.count({
      'recipient': _id,
      read: false
    })
    res.send({
      message,
      list: model
    })
  })

  // 上传图片
  const multer = require('multer')
  const upload = multer({
    dest: __dirname + '/../../uploads'
  })
  app.post('/web/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
    console.log('req', req)
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })

  // 错误处理函数
  app.use(async (err, req, res, next) => {
    console.log(err)
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })

}