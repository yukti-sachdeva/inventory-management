const Order = require("../schema/orders")
const moment = require('moment')

const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);


yearNow = new Date()
yearNow = yearNow.getFullYear()



const findOrder = async() => await Order.find({
    createdAt: { $gte: oneYearAgo }
  }).then(result => {
    console.log(result);
  }).catch(err => {
    console.log(err);
  });

const getMonthlyOrder = async() => await Order.aggregate([
    {
      '$unwind': {
        'path': '$itemList'
      }
    }, {
      '$lookup': {
        'from': 'items', 
        'localField': 'itemList.itemName', 
        'foreignField': 'itemName', 
        'as': 'items'
      }
    }, {
      '$unwind': {
        'path': '$items', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$group': {
        '_id': {
          'month': {
            '$month': '$createdAt'
          }
         // 'category': '$items.category'
        }, 
        'totalItems': {
          '$sum': '$itemList.quantity'
        }, 
        'totalPrice': {
          '$sum': {
            '$multiply': [
              '$itemList.quantity', '$items.MRP'
            ]
          }
        }
      }
    }, {
      '$group': {
        '_id': '$_id.month', 
        'categories': {
          '$push': {
            'category': '$_id.category', 
            'totalItems': '$totalItems', 
            'totalPrice': '$totalPrice'
          }
        }
      }
    }
  ]).then(result => {
    return result;
  }).catch(err => {
    console.log(err);
  });

  const getDailyOrder = async() => await Order.aggregate([
    {
        '$unwind': {
          'path': '$itemList'
        }
      },
    {
      '$lookup': {
        'from': 'items', 
        'localField': 'itemList.itemId', 
        'foreignField': '_id', 
        'as': 'items'
      }
    }, {
      '$unwind': {
        'path': '$items'
      }
    }, {
      '$group': {
        '_id': {
          'category': '$items.category', 
          'day': {
            '$dateToString': {
              'format': '%Y-%m-%d', 
              'date': '$createdAt'
            }
          }
        }, 
        'totalItems': {
            '$sum': '$itemList.quantity'
          },
          'totalPrice': {
            '$sum': {
              '$multiply': [
                '$itemList.quantity', '$items.MRP'
              ]
            }
          },
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$group': {
        '_id': '$_id.day', 
        'categories': {
          '$push': {
            'category': '$_id.category', 
            'totalSales': '$totalPrice',
            'totalItems': '$totalItems'
          }
        }
      }
    }
  ]). then(result => {
    return result;
  }).catch(err => {
    console.log(err);
  });
module.exports = {findOrder, getMonthlyOrder, getDailyOrder}

// ([
//     {
//       '$unwind': {
//         'path': '$itemList'
//       }
//     }, {
//       '$lookup': {
//         'from': 'items', 
//         'localField': 'itemList.itemName', 
//         'foreignField': 'itemName', 
//         'as': 'items'
//       }
//     }, {
//       '$unwind': {
//         'path': '$items', 
//         'preserveNullAndEmptyArrays': true
//       }
//     }, {
//       '$group': {
//         '_id': {
//           'month': {
//             '$month': '$createdAt'
//           }, 
//           'category': '$items.category'
//         }, 
//         'totalItems': {
//           '$sum': '$itemList.quantity'
//         }, 
//         'totalPrice': {
//           '$sum': {
//             '$multiply': [
//               '$itemList.quantity', '$items.MRP'
//             ]
//           }
//         }
//       }
//     }, {
//       '$group': {
//         '_id': '$_id.month', 
//         'categories': {
//           '$push': {
//             'category': '$_id.category', 
//             'totalItems': '$totalItems', 
//             'totalPrice': '$totalPrice'
//           }
//         }
//       }
//     }
//   ])
