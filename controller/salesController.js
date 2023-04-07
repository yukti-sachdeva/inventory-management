const Order = require("../schema/orders")
const moment = require('moment')

const yearOneAgo = new Date()

yearOneAgo.setFullYear(yearOneAgo.getFullYear()-1)

yearNow = new Date()
yearNow = yearNow.getFullYear()

//Order.aggregate([{$group: {_id: {}}}])

const findOrder = async() => await Order.find({createdAt: {$gt: moment(yearOneAgo).format()}})
module.exports = {findOrder}