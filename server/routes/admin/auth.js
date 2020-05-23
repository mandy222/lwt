module.exports = app => {
  const express = require('express')
  const assert = require('http-assert')
  const Auth = require('../../models/Authority')
  const authMiddleware = require('../../middleware/auth')


  app.get('/admin/api/authorities/list', authMiddleware(), async (req, res) => {
    const pageSize = parseInt(req.query.pageSize)
    const currentPage = parseInt(req.query.currentPage)
    const start = (currentPage - 1) * pageSize
    let total = 0
    let items = []
    let searchArr = []
    const searchForm = req.query.searchForm && JSON.parse(req.query.searchForm) || {}
    if (searchForm) {
      for (let key in searchForm) {
        let obj = {}
        if (key === 'parent') {
          obj[key] = {
            $in: searchForm[key]
          }
        } else {
          obj[key] = {
            $regex: searchForm[key]
          }
        }
        searchArr.push(obj)
      }
    }

    if (searchArr.length !== 0) {
      total = await Auth.count({ $and: searchArr })
      items = await Auth.find({ $and: searchArr })
        .populate('parent', {
          name: 1,
          code: 1
        })
        .skip(start)
        .limit(pageSize)
        .sort({
          'updatedAt': -1
        })
    } else {
      total = await Auth.estimatedDocumentCount()
      items = await Auth.find()
        .populate('parent', {
          name: 1,
          code: 1
        })
        .skip(start)
        .limit(pageSize)
        .sort({
          'updatedAt': -1
        })
    }
    
    res.send({
      list: items,
      total
    })
  })

  app.get('/admin/api/authorities/menu', authMiddleware(), async (req, res) => {
    const items = await Auth.find({parent: [null]}, {createdAt: 0, updatedAt: 0 })
      .populate({
        path: 'children',
        select: {name: 1},
        populate: {
          path: 'children',
          select: {name: 1}
        }
      }).lean()
    res.send(items)
  })

  // 错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })

}