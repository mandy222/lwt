module.exports = app => {
  const Category = require('../../models/Category')
  const authMiddleware = require('../../middleware/auth')

  // 子分类
  app.get('/admin/api/categories/children', authMiddleware(), async (req, res) => {
    const parentName = req.query.name
    const parent = await Category.findOne({
      name: parentName
    })
    const items = await Category.aggregate([{
      $match: {
        parent: parent._id
      }
    }])
    res.send(items)
  })

  // 错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })

}