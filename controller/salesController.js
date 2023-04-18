const orders = require("../schema/orders")


const getMonthlyOrder = async(date) => await orders.aggregate([
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

  const getDailyOrder = async(startDate, endDate) => await orders.aggregate([
    {
      '$match': {
        'createdAt': {
          '$gte': new Date(startDate), //2023-04-11T07:51:23.854+00:00
          '$lte': new Date(endDate)
        }
      }
    }, {
      '$unwind': {
        'path': '$itemList'
      }
    }, {
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
          'category': '$items.category'
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
        '_id': '$_id.category', 
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
module.exports = { getMonthlyOrder, getDailyOrder}
