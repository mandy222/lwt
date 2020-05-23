module.exports = app => {
  const Role = require('../../models/Role')
  const authMiddleware = require('../../middleware/auth')

  app.get('/admin/api/roles/list', authMiddleware(), async (req, res) => {

    const items = await Role.find()
      .populate('authorities').lean()
    res.send(items)
  })

  app.get('/admin/api/roles/authorities', authMiddleware(), async (req, res) => {
    const { id } = req.query
    let items = await Role.findById(id)
    .populate('authorities')
    const authorities = []
    for (let index = 0; index < items.authorities.length; index++) {
      authorities.push(items.authorities[index]._id)
    }
    res.send(authorities)
  })

  // 错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })

}