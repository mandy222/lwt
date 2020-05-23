module.exports = app => {
  const express = require('express')
  const assert = require('http-assert')
  const Info = require('../../models/Information')
  const Activity = require('../../models/Activity')
  const News = require('../../models/News')
  const authMiddleware = require('../../middleware/auth')


  app.get('/web/api/info/category/count/:id', authMiddleware(), async (req, res) => {
    const follow = await Info.count({
      category: '5e8f0858fc93c137e4135380',
      read: false,
      recipient: req.params.id
    })

    const comments = await Info.count({
      category: '5e8f0845fc93c137e413537e',
      read: false,
      recipient: req.params.id
    })

    const likes = await Info.count({
      category: '5e8f0851fc93c137e413537f',
      read: false,
      recipient: req.params.id
    })
     
    res.send([
      follow,
      comments,
      likes
    ])
  })

  app.get('/web/api/info/follower/:id', authMiddleware(), async (req, res) => {
    const queryOptions = {}
    queryOptions.populate = {
      path: 'sender',
      select: {
        username: 1
      }
    }
    queryOptions.select = {
      createdAt: 1,
      sender: 1,
      read: 1,
      category: 1
    }
    const follower = await Info.find({
      category: '5e8f0858fc93c137e4135380',
      recipient: req.params.id
    }).setOptions(queryOptions)

    // 修改关注消息为已读
    await Info.updateMany ({
      read: false,
      category: '5e8f0858fc93c137e4135380',
      recipient: req.params.id
    }, {
      $set: {read: true}
    })
    res.send(follower)
  })

  app.get('/web/api/info/likes/:id', authMiddleware(), async (req, res) => {
    const queryOptions = {}
    queryOptions.populate = {
      path: 'sender',
      select: {
        username: 1
      }
    }
    queryOptions.select = {
      createdAt: 1,
      sender: 1,
      read: 1,
      category: 1,
      content: 1
    }

    const likes = await Info.find({
      category: '5e8f0851fc93c137e413537f',
      recipient: req.params.id
    }).setOptions(queryOptions)

    // 修改关注消息为已读
    await Info.updateMany({
      read: false,
      category: '5e8f0851fc93c137e413537f',
      recipient: req.params.id
    }, {
      $set: {
        read: true
      }
    })
    res.send(likes)
  })

  app.get('/web/api/info/comments/:id', authMiddleware(), async (req, res) => {
    const queryOptions = {}
    queryOptions.populate = {
      path: 'sender',
      select: {
        username: 1
      }
    }
    queryOptions.select = {
      createdAt: 1,
      sender: 1,
      read: 1,
      comment: 1,
      content: 1,
      category: 1
    }
    const comments = await Info.find({
      category: '5e8f0845fc93c137e413537e',
      recipient: req.params.id
    }).setOptions(queryOptions)

    await Info.updateMany({
      read: false,
      category: '5e8f0845fc93c137e413537e',
      recipient: req.params.id
    }, {
      $set: {
        read: true
      }
    })
    res.send(comments)
  })

  app.delete('/web/api/info/deleteAll/:id', authMiddleware(), async (req, res) => {
    const category = req.body.category
    console.log('category', category)
    await Info.remove({
      category: category,
      recipient: req.params.id
    })
    res.send({
      success: true
    })
  })

  app.get('/web/api/search', authMiddleware(), async (req, res) => {
    const searchKey = req.query.searchKey
    const queryOptions = {}
     _filter1 = {
       $and: [{
         title: {
           $regex: searchKey
         }
       }]
     }
     _filter2 = {
       $and: [{
         name: {
           $regex: searchKey
         }
       }]
     }
    const newsList = await News.find(_filter1)
      .setOptions(queryOptions).sort({
        'updatedAt': -1
      })

    const activityList = await Activity.find(_filter2)
      .setOptions(queryOptions).sort({
        'updatedAt': -1
      })

    let model = newsList.concat(activityList)
     const pageSize = parseInt(req.query.pageSize) || 1000
     const currentPage = parseInt(req.query.currentPage) || 1
     const start = (currentPage - 1) * pageSize

     const item = model.slice(start, start + 10)

     let total = model.length

    res.send({
      item,
      total
    })
  })


  // 错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })

}