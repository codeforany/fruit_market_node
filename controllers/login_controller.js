var db = require('./../helpers/db_helpers')
var helper = require('./../helpers/helpers')
var multiparty = require('multiparty')
var fs = require('fs');
const { isError } = require('util');

var imagePath = "./public/img/"

const msg_success = "Success"
const msg_fail = "Fail"

module.exports.controller = (app, io, socket_list) => {

    app.post('/api/test', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;
        res.json({
            'status': '1',
            'message': msg_success,
            'payload': {
                'data': 'code for any'
            }
        })
    })

    app.post('/api/app/login', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;

        helper.CheckParameterValid(res, reqObj, ['mobile_code', 'mobile', 'os_type', 'push_token', 'socket_id'], () => {

            db.query('SELECT `user_id`,  `user_type`, `status` FROM `user_detail` WHERE `mobile_code` = ? AND `mobile` = ? ', [reqObj.mobile_code, reqObj.mobile], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                var otp_code = helper.createNumber(6);
                if (result.length > 0) {
                    // Login

                    db.query('UPDATE `user_detail` SET `otp_code`=? WHERE `mobile_code` = ? AND `mobile` = ?', [otp_code, reqObj.mobile_code, reqObj.mobile], (err, resultUpdate) => {

                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        if (resultUpdate.affectedRows > 0) {
                            res.json({ 'status': '1', 'message': 'otp send successfully' });
                        } else {
                            res.json({ 'status': '0', 'message': msg_fail });
                        }
                    })


                } else {
                    // New Register
                    db.query('INSERT INTO `user_detail`( `mobile_code`, `mobile`, `os_type`, `push_token`,`otp_code`, `user_type`) VALUES (?,?,?, ?,?,?)', [reqObj.mobile_code, reqObj.mobile, reqObj.os_type, reqObj.push_token, otp_code, 1], (err, resultUpdate) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        if (resultUpdate) {
                            res.json({ 'status': '1', 'message': 'otp send successfully' });
                        } else {
                            res.json({ 'status': '0', 'message': msg_fail });
                        }

                    })
                }

            })

        })

    })

    app.post('/api/app/address_add', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['name', 'address', 'city', 'zip_code', 'lati', 'longi'], () => {

                db.query('INSERT INTO `address_detail`(`user_id`, `name`, `address`, `city`, `zip_code`, `lati`, `longi`) VALUES (?,?,?, ?,?,?, ?)', [uObj.user_id, reqObj.name, reqObj.address, reqObj.city, reqObj.zip_code, reqObj.lati, reqObj.longi], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result) {

                        getUserAllAddress(uObj.user_id, (isError, result) => {

                            if (isError) {
                                res.json({
                                    'status': '0',
                                    'message': msg_fail
                                })
                            } else {
                                res.json({
                                    'status': '1',
                                    'payload': result,
                                    'message': 'address added successfully'
                                })
                            }

                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }
                })

            })

        }, '1')

    })

    app.post('/api/app/address_update', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['address_id', 'name', 'address', 'city', 'zip_code', 'lati', 'longi'], () => {

                db.query('UPDATE `address_detail` SET `name`=?,`address`=?,`city`=?,`zip_code`=?,`lati`=?,`longi`=?,`modify_date`= NOW() WHERE `address_id`=? AND `user_id` = ? AND `status` != 2', [reqObj.name, reqObj.address, reqObj.city, reqObj.zip_code, reqObj.lati, reqObj.longi, reqObj.address_id, uObj.user_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',

                            'message': 'address updated successfully'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }
                })

            })

        }, '1')

    })

    app.post('/api/app/address_delete', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['address_id'], () => {

                db.query('UPDATE `address_detail` SET `status`=?,`modify_date`= NOW() WHERE `address_id`=? AND `user_id` = ? AND `status` != 2', [2, reqObj.address_id, uObj.user_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',

                            'message': 'address deleted successfully'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }
                })

            })

        }, '1')

    })

    app.post('/api/app/address_list', (req, res) => {

        checkAccessToken(req.headers, res, (uObj) => {

            getUserAllAddress(uObj.user_id, (isError, result) => {

                if (isError) {
                    res.json({
                        'status': '0',
                        'message': msg_fail
                    })
                } else {
                    res.json({
                        'status': '1',
                        'payload': result
                    })
                }
            })

        })

    })

    app.post('/api/app/main_category_list', (req, res) => {
        checkAccessToken(req.headers, res, (uObj) => {
            db.query('SELECT `main_cat_id`, `main_cat_name`, `status` FROM `main_category` WHERE `status` = 1 ', [], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res)
                    return
                }

                res.json({
                    'status': '1',
                    'payload': result
                })
            })
        })
    })

    app.post('/api/app/home', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['main_cat_id'], () => {
                db.query('SELECT `cat_id`, `cat_name`, `main_cat_id`, `subtitle`, `status` FROM `category_detail` WHERE `status` = 1 AND `main_cat_id` = ?', [reqObj.main_cat_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    if (result.length > 0) {

                        var sqlItem = 'SELECT `fid`.`item_id`, `fid`.`main_cat_id`, `fid`.`cat_id`, `fid`.`item_name`, `fid`.`description`, (CASE WHEN `fid`.`image` != ""  THEN CONCAT( "' + helper.ImagePath() + '" , `fid`.`image`  ) ELSE "" END) AS `image`, `pd`.`price_id` ,`pd`.`amount`, `pd`.`unit_id`, `ud`.`unit_name`, IFNULL(`rd`.`rate`, 5.0) AS `rate` FROM `item_detail` AS `fid` ' +
                            'INNER JOIN `price_detail` AS `pd` ON `pd`.`item_id` = `fid`.`item_id` AND `pd`.`status` = 1 ' +
                            'INNER JOIN `unit_detail` AS `ud` ON `ud`.`unit_id` = `pd`.`unit_id` ' +
                            'LEFT JOIN  ( SELECT `rate_id`, `item_id`, AVG(`rate`) AS `rate` FROM `review_detail`  WHERE `status` = 1 GROUP BY `item_id` ) AS `rd` ON `rd`.`item_id` = `fid`.`item_id`' +
                            'WHERE `fid`.`status` = 1 AND `fid`.`cat_id` = ? GROUP BY `pd`.`price_id` LIMIT 5 ;'

                        var sql = ""
                        var valArr = []

                        result.forEach((cObj) => {

                            sql += sqlItem;
                            valArr.push(cObj.cat_id)

                        });

                        db.query(sql, valArr, (err, resultItem) => {

                            if (err) {
                                helper.ThrowHtmlError(err, res)
                                return
                            }

                            var i = 0;

                            helper.Dlog(resultItem);

                            if (result.length > 1) {
                                resultItem.forEach((itemsArr) => {

                                    result[i].items = itemsArr;
                                    i += 1
                                })
                            } else {
                                result[0].items = resultItem
                            }



                            res.json({
                                'status': '1',
                                'payload': result
                            })


                        })


                    } else {
                        res.json({
                            'status': '1',
                            'payload': []
                        });
                    }

                });
            })
        })
    })

    app.post('/api/app/item_details', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["item_id", "price_id"], () => {

                db.query('SELECT `fid`.`item_id`, `fid`.`main_cat_id`, `fid`.`cat_id`, `fid`.`item_name`, `fid`.`description`, (CASE WHEN `fid`.`image` != ""  THEN CONCAT( "' + helper.ImagePath() + '" , `fid`.`image`  ) ELSE "" END) AS `image`,`pd`.`amount`, `pd`.`unit_id`, `ud`.`unit_name`, IFNULL(`rd`.`rate`, 5.0) AS `rate` FROM `item_detail` AS `fid` ' +
                    'INNER JOIN `price_detail` AS `pd` ON `pd`.`item_id` = `fid`.`item_id` AND `pd`.`status` = 1 ' +
                    'INNER JOIN `unit_detail` AS `ud` ON `ud`.`unit_id` = `pd`.`unit_id` ' +
                    'LEFT JOIN  ( SELECT `rate_id`, `item_id`, AVG(`rate`) AS `rate` FROM `review_detail`  WHERE `status` = 1 GROUP BY `item_id` ) AS `rd` ON `rd`.`item_id` = `fid`.`item_id`' +
                    'WHERE `fid`.`status` = 1 AND `fid`.`item_id` = ? AND `pd`.`price_id` = ? GROUP BY `pd`.`price_id`;' +

                    'SELECT `rd`.`rate_id`, `rd`.`item_id`, `rd`.`user_id`, `rd`.`rate`, `rd`.`message`, `ud`.`name` FROM `review_detail` AS `rd` ' +
                    'INNER JOIN `user_detail` AS `ud` ON `ud`.`user_id` = `rd`.`user_id` ' +
                    'WHERE `rd`.`status` = 1 AND `rd`.`item_id` = ?;' +

                    'SELECT `nutrition_id`, `item_id`, `name` FROM `nutrition_detail` WHERE `item_id` = ? AND `status` = ?', [
                    reqObj.item_id, reqObj.price_id,
                    reqObj.item_id,
                    reqObj.item_id, 1
                ], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    if (result[0].length > 0) {

                        result[0][0].review_list = result[1]
                        result[0][0].nutrition_list = result[2]

                        res.json({
                            'status': '1',
                            'payload': result[0][0]
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': 'invalid item'
                        })
                    }

                })


            })

        })

    })

    app.post('/api/app/cart_to_add', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['item_id', 'price_id', 'qty'], () => {

                db.query('SELECT `item_id` FROM `item_detail` WHERE `item_id` =? AND  `status` = ?;' +
                    'SELECT `cart_id`, `item_id`, `qty` FROM `cart_detail` WHERE `item_id` = ? AND `user_id` = ? AND `price_id` = ? AND `status` = ?', [reqObj.item_id, 1, reqObj.item_id, uObj.user_id, reqObj.price_id, 1], (err, result) => {

                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        if (result[0].length > 0) {

                            if (result[1].length > 0) {
                                var newQty = parseInt(reqObj.qty) + result[1][0].qty

                                db.query('UPDATE `cart_detail` SET `qty`=?,`modify_date`=NOW() WHERE `cart_id` = ? ', [newQty, result[1][0].cart_id], (err, result) => {
                                    if (err) {
                                        helper.ThrowHtmlError(err, res);
                                        return
                                    }

                                    if (result.affectedRows > 0) {
                                        res.json({
                                            'status': '1',
                                            'message': 'cart to added & update qty successfully'
                                        })

                                    } else {
                                        res.json({
                                            'status': '0',
                                            'message': msg_fail
                                        })
                                    }

                                })


                            } else {
                                db.query('INSERT INTO `cart_detail`( `item_id`, `user_id`, `qty`, `price_id`) VALUES (?,?,?, ?)', [reqObj.item_id, uObj.user_id, reqObj.qty, reqObj.price_id], (err, result) => {

                                    if (err) {
                                        helper.ThrowHtmlError(err, res);
                                        return
                                    }

                                    if (result) {
                                        res.json({
                                            'status': '1',
                                            'message': 'cart to added successfully'
                                        })

                                    } else {
                                        res.json({
                                            'status': '0',
                                            'message': msg_fail
                                        })
                                    }
                                })
                            }


                        } else {
                            res.json({
                                'status': '0',
                                'message': 'invalid item'
                            })
                        }

                    })

            })

        }, 1)
    })

    app.post('/api/app/cart_qty_update', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['cart_id', 'item_id', 'qty'], () => {

                db.query('UPDATE `cart_detail` SET `qty`=?,`modify_date`=NOW() WHERE `cart_id` = ? AND `item_id` = ? AND `status` != ? ', [reqObj.qty, reqObj.cart_id, reqObj.item_id, 2], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': 'cart update qty successfully'
                        })

                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }
                })

            })
        }, 1)
    })

    app.post('/api/app/cart_item_delete', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['cart_id', 'item_id'], () => {

                db.query('UPDATE `cart_detail` SET `status`=?,`modify_date`=NOW() WHERE `cart_id` = ? AND `item_id` = ? ', [2, reqObj.cart_id, reqObj.item_id], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': 'cart item deleted successfully'
                        })

                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }
                })

            })
        }, 1)
    })

    app.post('/api/app/cart_list', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {

            db.query('SELECT `main_cat_id`, `main_cat_name`, `status` FROM `main_category` WHERE `status` = 1', [], (err, result) => {
                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                var sql = 'SELECT `cd`.`cart_id`, `cd`.`item_id`, `cd`.`price_id`, `cd`.`user_id`, `cd`.`qty`, `iid`.`item_name`, `iid`.`description`,  (CASE WHEN `iid`.`image` != ""  THEN CONCAT( "' + helper.ImagePath() + '" , `iid`.`image`  ) ELSE "" END) AS `image`, `pd`.`amount`, `pd`.`unit_id`, `udd`.`unit_name`, `udd`.`unit_value`, `cad`.`main_cat_id` FROM `cart_detail` AS `cd` ' +
                    'INNER JOIN `item_detail` AS`iid` ON`iid`.`item_id` = `cd`.`item_id` AND`iid`.`status` = 1 ' +
                    'INNER JOIN `price_detail` AS`pd` ON`pd`.`price_id` = `cd`.`price_id` AND`pd`.`status` = 1 ' +
                    'INNER JOIN `unit_detail` AS `udd` ON `udd`.`unit_id` = `pd`.`unit_id` ' +
                    'INNER JOIN `category_detail` AS `cad` ON `iid`.`cat_id` = `cad`.`cat_id` ' +
                    // 'INNER JOIN `user_detail` AS`ud` ON `ud`.`unit_id` = `pd`.`unit_id` ' +
                    'WHERE`cd`.`user_id` = ? AND`cd`.`status` = ? '

                db.query(sql, [
                    uObj.user_id, 1
                ], (err, resultCart) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }
                    var finalResult = []
                    result.forEach((catObj) => {

                        catObj.cart_list = resultCart.filter((iObj) => iObj.main_cat_id == catObj.main_cat_id)

                        if (catObj.cart_list.length > 0) {
                            finalResult.push(catObj)
                        }
                    })

                    res.json({
                        'status': '1',
                        'payload': finalResult
                    })
                })
            })



        }, 1)

    })

    app.post('/api/app/give_review', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['item_id', 'item_order_id', 'rate', 'message'], () => {

                db.query('INSERT INTO `review_detail` (`item_id`,`user_id`,`item_order_id`, `rate`, `message` ) VALUES (?,?,?, ?,?) ', [
                    reqObj.item_id, uObj.user_id, reqObj.item_order_id, reqObj.rate, reqObj.message
                ], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    if (result) {
                        res.json({
                            'status': '1',
                            'message': "thank you for review message & welcome back"
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }

                })

            })

        }, 1)
    })

    app.post('/api/admin/show_all_review_list', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['item_id'], () => {

                db.query('SELECT `rate_id`, `item_id`, `item_order_id`, `rate`, `message`, `user_id`, `status`, `created_date`, `modify_date` FROM `review_detail` AS `rd` '
                    + 'INNER JOIN`user_detail` AS`ud` ON`ud`.`user_id` = `rd`.`user_id`' +
                    'WHERE`rd`.`item_id` = ? AND`rd`.`status` != 2 ', [reqObj.item_id], (err, result) => {

                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        res.json({
                            'status': '1',
                            'payload': result
                        })

                    })

            })
        }, '1')

    })

    app.post('/api/app/order_place', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ["payment_type", "address", "lati", "longi", "zip_code"], () => {

                db.query('SELECT `cd`.`cart_id`, `cd`.`item_id`, `cd`.`price_id`, `cd`.`user_id`, `cd`.`qty`, `pd`.`amount` FROM `cart_detail` AS `cd`' +
                    'INNER JOIN `price_detail` AS`pd` ON`pd`.`price_id` = `cd`.`price_id` AND`pd`.`status` = 1 ' +
                    'WHERE `cd`.`user_id` = ? AND`cd`.`status` = 1', [uObj.user_id], (err, result) => {

                        if (err) {
                            helper.ThrowHtmlError(err, res)
                            return
                        }

                        if (result.length > 0) {

                            var finalTotalAmount = 0.0;
                            var payTotalAmount = 0.0;
                            var delivery_amount = 0.0;
                            var offer_order_amount = 0.0;
                            var insertItem = []


                            result.forEach((cObj, index) => {

                                var totalAmount = parseFloat(cObj.amount) * parseInt(cObj.qty)
                                finalTotalAmount = finalTotalAmount + totalAmount
                            })

                            payTotalAmount = finalTotalAmount + delivery_amount;

                            db.query('INSERT INTO `order_detail`(`user_id`, `payment_type`,  `address`, `lati`, `longi`, `zip_code`, `total_order_amount`, `user_pay_order_amount`, `delivery_amount`, `offer_order_amount` ) VALUES (?,?,?, ?,?,?, ?,?,?, ?)', [uObj.user_id, reqObj.payment_type, reqObj.address, reqObj.lati, reqObj.longi, reqObj.zip_code, finalTotalAmount, payTotalAmount, delivery_amount, offer_order_amount], (err, resultInsert) => {

                                if (err) {
                                    helper.ThrowHtmlError(err, res)
                                    return
                                }

                                if (resultInsert) {

                                    result.forEach((cObj, index) => {

                                        var totalAmount = parseFloat(cObj.amount) * parseInt(cObj.qty)
                                        finalTotalAmount = finalTotalAmount + totalAmount

                                        insertItem.push([resultInsert.insertId, cObj.cart_id, cObj.price_id, 0, totalAmount, 0, totalAmount])


                                    })

                                    db.query('INSERT INTO `order_item_detail`(`order_id`, `cart_id`, `price_id`, `offer_id`, `total_amount`, `offer_amount`, `pay_amount`) VALUES ?', [insertItem], (err, resultItem) => {

                                        if (err) {
                                            helper.ThrowHtmlError(err, res)
                                            return
                                        }

                                        if (resultItem) {

                                            db.query('UPDATE `cart_detail` SET `status` = 2, `modify_date` = NOW() WHERE `user_id` = ? AND `status` != 2;' +
                                                "INSERT INTO `order_status_detail` (`item_order_id`, `order_status`, `created_date` ) " +
                                                "SELECT  `item_order_id`, `status` AS `order_status`, NOW() FROM `order_item_detail` WHERE `order_id` = ?  ", [uObj.user_id, resultInsert.insertId], (err, result) => {

                                                    if (err) {
                                                        helper.ThrowHtmlError(err, result)
                                                        return
                                                    }

                                                    if (result[0].affectedRows > 0) {
                                                        helper.Dlog('Cart Clean');
                                                    } else {
                                                        helper.Dlog('Cart Clean fail');
                                                    }

                                                })

                                            res.json({
                                                'status': '1',
                                                'message': 'Thank you for orders'
                                            })
                                        } else {
                                            res.json({
                                                'status': '0',
                                                'message': msg_fail
                                            })
                                        }

                                    })

                                } else {
                                    res.json({
                                        'status': '0',
                                        'message': msg_fail
                                    })
                                }

                            })



                        } else {
                            res.json({
                                'status': '0',
                                'message': 'cart is empty'
                            })
                        }


                    })

            })

        }, 1)

    })

    app.post('/api/app/my_order_list', (req, res) => {

        checkAccessToken(req.headers, res, (uObj) => {

            db.query('SELECT `od`.`order_id`, `od`.`user_id`, `od`.`payment_type`, `od`.`payment_status`, `oid`.`status`, `od`.`created_date`, `oid`.`item_order_id`, `oid`.`total_amount`, `oid`.`offer_amount`, `oid`.`pay_amount`, `cd`.`qty`, `iid`.`item_name`, `iid`.`description`, (CASE WHEN `iid`.`image` != ""  THEN CONCAT( "' + helper.ImagePath() + '" , `iid`.`image`  ) ELSE "" END) AS `image`, `pd`.`amount`, `pd`.`unit_id`, `ud`.`unit_name`, IFNULL(`rd`.`rate`, 0.0) AS `rating` FROM `order_detail` AS `od` ' +
                'INNER JOIN`order_item_detail` AS`oid` ON`oid`.`order_id` = `od`.`order_id`' +
                'INNER JOIN`cart_detail` AS`cd` ON`oid`.`cart_id` = `cd`.`cart_id`' +
                'INNER JOIN`item_detail` AS`iid` ON`iid`.`item_id` = `cd`.`item_id`' +
                'INNER JOIN`price_detail` AS`pd` ON`pd`.`price_id` = `cd`.`price_id`' +
                'INNER JOIN`unit_detail` AS`ud` ON`ud`.`unit_id` = `pd`.`unit_id`' +
                'LEFT JOIN `review_detail` AS `rd` ON `oid`.`item_order_id` = `rd`.`item_order_id` ' +
                'WHERE`od`.`user_id` = ? ORDER BY`od`.`order_id` DESC', [uObj.user_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return;
                    }

                    res.json({
                        'status': '1',
                        'payload': result
                    })

                })
        })

    })

    function getUserAllAddress(user_id, callback) {

        db.query('SELECT `address_id`, `user_id`, `name`, `address`, `city`, `zip_code`, `lati`, `longi`, `is_default`, `status` FROM `address_detail` WHERE `user_id` = ? AND `status` != 2 ', [user_id], (err, result) => {
            if (err) {
                helper.ThrowHtmlError(err)
                return callback(true, 'not fetch recode')
            }

            return callback(false, result)
        })

    }

    app.post('/api/app/verify_login_otp', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body;

        helper.CheckParameterValid(res, reqObj, ['mobile_code', 'mobile', 'otp_code', 'os_type', 'push_token', 'socket_id'], () => {

            var otp_code = helper.createNumber(6);
            var authToken = helper.createRequestToken();

            db.query('UPDATE `user_detail` SET `os_type`=?,`push_token`=?,`auth_token`=?,`otp_code`=?,`modify_date`= NOW() WHERE `mobile_code`=? AND`mobile`=? AND `otp_code` = ?', [

                reqObj.os_type, reqObj.push_token, authToken, otp_code, reqObj.mobile_code, reqObj.mobile, reqObj.otp_code

            ], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                if (result.affectedRows > 0) {
                    //Socket Id Update

                    db.query('SELECT `user_id`, `name`, `mobile_code`, `mobile`, `email`, `auth_token`, `user_type`, `status` FROM `user_detail` WHERE `mobile_code` = ? AND `mobile` = ? ', [reqObj.mobile_code, reqObj.mobile], (err, result) => {


                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        if (result.length > 0) {
                            if (result[0].status == 0) {
                                res.json({
                                    'status': '0',
                                    'message': 'please contact admin your account blocked'
                                })
                            } else {
                                res.json({
                                    'status': '1',
                                    'message': 'login successfully',
                                    'payload': result[0]
                                })
                            }

                        } else {
                            res.json({
                                'status': '0',
                                'message': msg_fail
                            })
                        }
                    })

                } else {

                    res.json({
                        'status': '0',
                        'message': 'otp code invalid'
                    })

                }


            })

        })

    })

    app.post('/api/app/deliver_boy_order_list', (req, res) => {

        checkAccessToken(req.headers, res, (uObj) => {

            db.query('SELECT `od`.`order_id`, `od`.`user_id`, `od`.`delivery_boy_id`, `od`.`payment_type`, `od`.`address`, `od`.`lati`, `od`.`longi`, `od`.`zip_code`, `od`.`user_pay_order_amount`, `od`.`status`, `od`.`modify_date`, `od`.`created_date` , `ud`.`name`, `ud`.`mobile_code`, `ud`.`mobile`, `oid`.`item_order_id`, `oid`.`price_id`, `oid`.`total_amount`, `oid`.`offer_amount`, `oid`.`pay_amount`, `oid`.`status` as `order_status`, `iid`.`item_name`, (CASE WHEN `iid`.`image` != "" THEN CONCAT("'+ helper.ImagePath() +'", `iid`.`image` ) ELSE "" END) AS `image`, `iid`.`description`, `cd`.`qty`, `uud`.`unit_name` FROM `order_detail` AS `od`' +
                'INNER JOIN `order_item_detail` AS `oid` ON `oid`.`order_id` = `od`.`order_id` AND `oid`.`status` > 0 ' +
                'INNER JOIN `cart_detail` AS `cd` ON `cd`.`cart_id` = `oid`.`cart_id` ' +
                'INNER JOIN `item_detail` AS `iid` ON `iid`.`item_id` = `cd`.`item_id` '+
                'INNER JOIN `price_detail` AS `pd` ON `pd`.`price_id` = `oid`.`price_id` ' +
                'INNER JOIN `unit_detail` AS `uud` ON `uud`.`unit_id` = `pd`.`unit_id` ' +
                'INNER JOIN`user_detail` AS`ud` ON`ud`.`user_id` = `od`.`user_id` AND(`od`.`status` >= 2 AND`od`.`status` <= 4)' +
                'ORDER BY`od`.`status` = 2, `od`.`status` = 3, `od`.`status` = 4 AND `od`.`delivery_boy_id` = ?', [uObj.user_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }
                    res.json({
                        'status': '1',
                        'payload': result
                    })

                })

        }, '2')

    })

    app.post('/api/app/deliver_boy_order_out_for_deliver', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['order_id'], () => {
                db.query('UPDATE `order_detail` SET `status`=3,`modify_date`= NOW() WHERE `order_id` = ? AND `delivery_boy_id` = ? AND `status` = 2', [reqObj.order_id, uObj.user_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    if (result.affectedRows > 0) {

                        db.query('INSERT INTO `order_status_detail`(`order_id`, `order_status`) VALUES (?,?)', [reqObj.order_id, 3], (err, result) => {

                            if (err) {
                                helper.ThrowHtmlError(err)

                            }


                            res.json({
                                'status': '1',
                                'message': "order out of delivery successfully"
                            })
                        })


                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }


                })

            })



        }, '2')

    })

    app.post('/api/app/deliver_boy_order_delivered', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['order_id', 'latitude', 'longitude', ], () => {
                db.query('UPDATE `order_detail` SET `status`=4,`modify_date`= NOW() WHERE `order_id` = ? AND `delivery_boy_id` = ? AND `status` = 3', [reqObj.order_id, uObj.user_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    if (result.affectedRows > 0) {

                        db.query('INSERT INTO `order_status_detail`(`order_id`, `order_status`, `latitude`, `longitude` ) VALUES (?,?,?, ?)', [reqObj.order_id, 4, reqObj.latitude, reqObj.longitude  ], (err, result) => {

                            if (err) {
                                helper.ThrowHtmlError(err)

                            }


                            res.json({
                                'status': '1',
                                'message': "order delivered successfully"
                            })
                        })


                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }


                })

            })

        }, '2')

    })

    app.post('/api/app/delivery_boy_order_deliver_cancel', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['item_order_id', 'latitude', 'longitude', 'reason'], () => {

                db.query('UPDATE `order_item_detail` SET `status` = ?, `reason` = ?, `modify_date` = NOW() WHERE `item_order_id` = ? ', [6, reqObj.reason, reqObj.item_order_id ], (err, result) => {

                    if(err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    if(result.affectedRows > 0) {

                        db.query('INSERT INTO `order_status_detail` ( `item_order_id`, `order_status`, `latitude` , `longitude` , `created_date` ) VALUES (?,?,?, ?,NOW()) ', [reqObj.item_order_id, 6, reqObj.latitude, reqObj.longitude ], (err, result) => {


                            if (err) {
                                helper.ThrowHtmlError(err, res)
                                return
                            }

                            if(result) {
                                res.json({
                                    'status': '1',
                                    'message': 'order cancel done'
                                })
                            }else{
                                res.json({
                                    'status': '0',
                                    'message': msg_fail
                                })
                            }


                        } )

                    }else{
                        res.json({
                            'status':'0',
                            'message': msg_fail
                        })
                    }

                } )

            });


        }, '2')

    })


    app.post('/api/admin/main_category_add', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['name'], () => {

                db.query('SELECT `main_cat_id`, `main_cat_name` FROM `main_category` WHERE `main_cat_name` = ? AND `status` != ? ', [reqObj.name, 2], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.length > 0) {
                        res.json({
                            'status': '0',
                            'message': 'already added'
                        })
                    } else {
                        db.query('INSERT INTO `main_category`(`main_cat_name`) VALUES (?)', [reqObj.name], (err, result) => {

                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return
                            }

                            if (result) {
                                res.json({
                                    'status': '1',
                                    'message': 'main category added successfully',
                                    'payload': {
                                        'main_cat_id': result.insertId,
                                        'main_cat_name': reqObj.name
                                    }
                                })
                            } else {
                                res.json({
                                    'status': '0',
                                    'message': msg_fail
                                })
                            }

                        })
                    }
                })
            })
        }, '3')

    })

    app.post('/api/admin/main_category_update', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['main_cat_id', 'name'], () => {

                db.query('UPDATE `main_category` SET `main_cat_name`=?,`modify_date`= NOW() WHERE `main_cat_id` = ? AND `status` != ? ', [reqObj.name, reqObj.main_cat_id, 2], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': 'main category updated'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }
                })
            })
        }, '3')

    })

    app.post('/api/admin/main_category_delete', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['main_cat_id'], () => {

                db.query('UPDATE `main_category` SET `status`=?,`modify_date`= NOW() WHERE `main_cat_id` = ? AND `status` != ? ', [2, reqObj.main_cat_id, 2], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': 'main category deleted'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }
                })
            })
        }, '3')

    })

    app.post('/api/admin/main_category_active_inactive', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['main_cat_id', 'is_active'], () => {

                db.query('UPDATE `main_category` SET `status`=?,`modify_date`= NOW() WHERE `main_cat_id` = ? AND `status` != ? ', [reqObj.is_active, reqObj.main_cat_id, 2], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': reqObj.is_active == 1 ? 'main category active successfully' : 'main category inactive successfully'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }
                })
            })
        }, '3')

    })

    app.post('/api/admin/main_category_list', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {


            db.query('SELECT `main_cat_id`, `main_cat_name`, `status` FROM `main_category` WHERE  `status` != ? ', [2], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                res.json({
                    'status': '1',
                    'payload': result
                })
            })
        }, '3')

    })

    app.post('/api/admin/category_add', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['cat_name', 'main_cat_id', 'subtitle'], () => {

                db.query('SELECT `cat_id`, `main_cat_id`, `cat_name` FROM `category_detail` WHERE `cat_name` = ? AND `main_cat_id` = ? AND `status` != ? ', [reqObj.cat_name, reqObj.main_cat_id, 2], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.length > 0) {
                        res.json({
                            'status': '0',
                            'message': 'already added'
                        })
                    } else {
                        db.query('INSERT INTO `category_detail`(`cat_name`,`main_cat_id`, `subtitle`) VALUES (?,?,?)', [reqObj.cat_name, reqObj.main_cat_id, reqObj.subtitle], (err, result) => {

                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return
                            }

                            if (result) {
                                res.json({
                                    'status': '1',
                                    'message': 'category added successfully',
                                    'payload': {
                                        'cat_id': result.insertId,
                                        'main_cat_id': parseInt(reqObj.main_cat_id),
                                        'cat_name': reqObj.cat_name,
                                        'subtitle': reqObj.subtitle
                                    }
                                })
                            } else {
                                res.json({
                                    'status': '0',
                                    'message': msg_fail
                                })
                            }

                        })
                    }
                })
            })
        }, '3')

    })

    app.post('/api/admin/category_update', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['cat_id', 'cat_name', 'subtitle'], () => {

                db.query('UPDATE `category_detail` SET `cat_name`=?, `subtitle` = ? ,`modify_date`= NOW() WHERE `cat_id` = ? AND `status` != ? ', [reqObj.cat_name, reqObj.subtitle, reqObj.cat_id, 2], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': 'category updated'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }
                })
            })
        }, '3')

    })

    app.post('/api/admin/category_delete', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['cat_id'], () => {

                db.query('UPDATE `category_detail` SET `status`=?,`modify_date`= NOW() WHERE `cat_id` = ? AND `status` != ? ', [2, reqObj.cat_id, 2], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': 'category deleted'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }
                })
            })
        }, '3')

    })

    app.post('/api/admin/category_active_inactive', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['cat_id', 'is_active'], () => {

                db.query('UPDATE `category_detail` SET `status`=?,`modify_date`= NOW() WHERE `cat_id` = ? AND `status` != ? ', [reqObj.is_active, reqObj.cat_id, 2], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': reqObj.is_active == 1 ? 'category active successfully' : 'category inactive successfully'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }
                })
            })
        }, '3')

    })

    app.post('/api/admin/category_list', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['main_cat_id'], () => {
                db.query('SELECT `cat_id`, `cat_name`, `main_cat_id`, `subtitle`, `status` FROM `category_detail` WHERE `main_cat_id` = ? AND `status` != ? ', [reqObj.main_cat_id, 2], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    res.json({
                        'status': '1',
                        'payload': result
                    })
                })
            })


        }, '3')

    })

    app.post('/api/admin/unit_add', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['unit_name', 'unit_value'], () => {

                db.query('SELECT `unit_id`, `unit_name`, `unit_value` FROM `unit_detail` WHERE `unit_name` = ? AND `status` != ?', [
                    reqObj.unit_name, 2
                ], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.length > 0) {
                        res.json({
                            'status': '0',
                            'message': 'unit already added'
                        })
                    } else {
                        db.query('INSERT INTO `unit_detail` (`unit_name`, `unit_value`) VALUES (?,?) ', [reqObj.unit_name, reqObj.unit_value], (err, result) => {

                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return
                            }

                            if (result) {
                                res.json({
                                    'status': '1',
                                    'message': 'unit added successfully',
                                    'payload': {
                                        'unit_id': result.insertId,
                                        'unit_name': reqObj.unit_name,
                                        'unit_value': reqObj.unit_value
                                    }
                                })

                            } else {
                                res.json({
                                    'status': '0',
                                    'message': msg_fail
                                })
                            }

                        })

                    }

                })

            })

        }, '3')

    })

    app.post('/api/admin/unit_update', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['unit_id', 'unit_name', 'unit_value'], () => {

                db.query('UPDATE `unit_detail` SET `unit_name`=?,`unit_value`=?,`modify_date`= NOW() WHERE `unit_id`=? AND `status` != 2 ', [reqObj.unit_name, reqObj.unit_value, reqObj.unit_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': 'unit updated successfully',

                        })

                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }

                })
            })

        }, '3')

    })

    app.post('/api/admin/unit_delete', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['unit_id'], () => {

                db.query('UPDATE `unit_detail` SET `status`=?, `modify_date`= NOW() WHERE `unit_id`=? AND `status` != 2 ', [2, reqObj.unit_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': 'unit deleted successfully',

                        })

                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }

                })
            })

        }, '3')

    })

    app.post('/api/admin/unit_list', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {


            db.query('SELECT `unit_id`, `unit_name`, `unit_value`, `status` FROM `unit_detail` WHERE `status` != ? ', [2], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                res.json({
                    'status': '1',
                    'payload': result
                })
            })



        }, '3')

    })

    app.post('/api/admin/item_add', (req, res) => {
        helper.Dlog(req.body)
        var form = new multiparty.Form();
        form.parse(req, (err, reqObj, files) => {
            if (err) {
                helper.ThrowHtmlError(err, res);
                return
            }
            checkAccessToken(req.headers, res, (uObj) => {
                helper.CheckParameterValid(res, reqObj, ['main_cat_id', 'cat_id', 'item_name', 'description'], () => {
                    helper.CheckParameterValid(res, files, ['image'], () => {

                        var extension = files.image[0].originalFilename.substring(files.image[0].originalFilename.lastIndexOf('.') + 1);
                        var imageFileName = 'items/' + helper.fileNameGenerate(extension);

                        var newPath = imagePath + imageFileName;
                        fs.rename(files.image[0].path, newPath, (err) => {

                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return;
                            } else {
                                db.query('INSERT INTO `item_detail`( `main_cat_id`, `cat_id`, `item_name`, `description`, `image`, `status`) VALUES (?,?,?, ?,?,?)', [reqObj.main_cat_id[0], reqObj.cat_id[0], reqObj.item_name[0], reqObj.description[0], imageFileName, 0], (err, result) => {

                                    if (err) {
                                        helper.ThrowHtmlError(err, res);
                                        return;
                                    }

                                    if (result) {
                                        res.json({
                                            'status': '1',
                                            'message': 'item added successfully'
                                        })

                                    } else {
                                        res.json({
                                            'status': '0',
                                            'message': msg_fail
                                        })
                                    }

                                })
                            }

                        })


                    })
                })
            }, 3)
        })
    })

    app.post('/api/admin/item_update_image', (req, res) => {
        helper.Dlog(req.body)
        var form = new multiparty.Form();
        form.parse(req, (err, reqObj, files) => {
            if (err) {
                helper.ThrowHtmlError(err, res);
                return
            }
            checkAccessToken(req.headers, res, (uObj) => {
                helper.CheckParameterValid(res, reqObj, ['item_id'], () => {
                    helper.CheckParameterValid(res, files, ['image'], () => {

                        var extension = files.image[0].originalFilename.substring(files.image[0].originalFilename.lastIndexOf('.') + 1);
                        var imageFileName = 'items/' + helper.fileNameGenerate(extension);

                        var newPath = imagePath + imageFileName;
                        fs.rename(files.image[0].path, newPath, (err) => {

                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return;
                            } else {
                                db.query('UPDATE `item_detail` SET `image`=?,`modify_date`=NOW() WHERE `item_id` = ? AND `status` != 2', [imageFileName, reqObj.item_id[0]], (err, result) => {

                                    if (err) {
                                        helper.ThrowHtmlError(err, res);
                                        return;
                                    }

                                    if (result) {
                                        res.json({
                                            'status': '1',
                                            'payload': {
                                                'image': helper.ImagePath() + imageFileName
                                            },
                                            'message': 'item image update successfully'
                                        })

                                    } else {
                                        res.json({
                                            'status': '0',
                                            'message': msg_fail
                                        })
                                    }

                                })
                            }

                        })


                    })
                })
            }, 3)
        })
    })

    app.post('/api/admin/item_update', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['item_id', 'item_name', 'cat_id', 'description'], () => {
                db.query('UPDATE `item_detail` SET `cat_id`=?,`item_name`=?,`description`=?,`modify_date`=NOW() WHERE `item_id`=? AND `status` != 2', [
                    reqObj.cat_id, reqObj.item_name, reqObj.description, reqObj.item_id
                ], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': 'item updated successfully'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }

                })

            })

        }, '3')
    })

    app.post('/api/admin/item_delete', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['item_id',], () => {
                db.query('UPDATE `item_detail` SET `status`=2,`modify_date`=NOW() WHERE `item_id`=? AND `status` != 2', [
                    reqObj.item_id
                ], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': 'item deleted successfully'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }

                })

            })

        }, '3')
    })
    //
    app.post('/api/admin/items_list', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['main_cat_id'], () => {

                db.query('SELECT `item_id`, `main_cat_id`, `cat_id`, `item_name`, `description`, (CASE WHEN `image` != ""  THEN CONCAT( "' + helper.ImagePath() + '" , `image`  ) ELSE "" END) AS `image`, `status`, `created_date`, `modify_date` FROM `item_detail` WHERE `main_cat_id` = ? AND `status` != 2', [reqObj.main_cat_id], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    res.json({
                        'status': '1',
                        'payload': result
                    })
                })
            })

        }, 3)

    })

    app.post('/api/admin/all_items_list', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {



            db.query('SELECT `item_id`, `main_cat_id`, `cat_id`, `item_name`, `description`, (CASE WHEN `image` != ""  THEN CONCAT( "' + helper.ImagePath() + '" , `image`  ) ELSE "" END) AS `image`, `status`, `created_date`, `modify_date` FROM `item_detail` WHERE  `status` != 2', [], (err, result) => {
                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                res.json({
                    'status': '1',
                    'payload': result
                })
            })


        }, 3)

    })

    app.post('/api/admin/item_nutrition_add', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['item_id', 'nutrition_list'], () => {

                var nObj = JSON.parse(reqObj.nutrition_list);
                var addObj = []

                nObj.forEach(nutriObj => {

                    addObj.push([reqObj.item_id, nutriObj.name]);

                });

                db.query('INSERT INTO `nutrition_detail`(`item_id`, `name`) VALUES ?', [addObj], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    if (result) {
                        res.json({
                            'status': '1',
                            'message': 'nutrition added successfully'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }

                })
            })
        }, 3)
    })

    app.post('/api/admin/item_nutrition_update', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['nutrition_id', 'name'], () => {

                db.query('UPDATE `nutrition_detail` SET `name`=?, `modify_date`=NOW() WHERE `nutrition_id`=? AND `status` != 2', [reqObj.name, reqObj.nutrition_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': 'item nutrition updated successfully'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }

                })
            })

        }, 3)


    })

    app.post('/api/admin/item_nutrition_delete', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['nutrition_id'], () => {

                db.query('UPDATE `nutrition_detail` SET `status`=2, `modify_date`=NOW() WHERE `nutrition_id`=? AND `status` != 2', [reqObj.nutrition_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': 'item nutrition deleted successfully'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }

                })
            })

        }, 3)


    })

    app.post('/api/admin/item_nutrition_list', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['item_id'], () => {

                db.query('SELECT `nutrition_id`, `item_id`, `name` FROM `nutrition_detail` WHERE `item_id`=? AND `status` != 2', [reqObj.item_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    res.json({
                        'status': '1',
                        'payload': result
                    })

                })
            })

        }, 3)


    })

    app.post('/api/admin/item_price_add_update', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['item_id', 'unit_id', 'amount'], () => {

                db.query('UPDATE `price_detail` SET `status`=0,`modify_date`=NOW() WHERE `item_id` = ? AND `unit_id` =? AND `status` != 2', [reqObj.item_id, reqObj.unit_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    db.query('INSERT INTO `price_detail`( `item_id`, `unit_id`, `amount`) VALUES (?,?,?)', [reqObj.item_id, reqObj.unit_id, reqObj.amount], (err, result) => {

                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        if (result) {
                            res.json({
                                'status': '1',
                                'payload': {

                                    'price_id': result.insertId,
                                    'item_id': parseInt(reqObj.item_id),
                                    'unit_id': parseInt(reqObj.unit_id),
                                    'amount': reqObj.amount
                                },
                                'message': 'items price added successfully'
                            })
                        } else {
                            res.json({
                                'status': '0',
                                'message': msg_fail
                            })
                        }

                    })

                })

            })

        }, 3)

    })

    app.post('/api/admin/item_price_delete', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['price_id', 'item_id'], () => {

                db.query('UPDATE `price_detail` SET `status`=2,`modify_date`=NOW() WHERE `item_id` = ? AND `price_id` =? AND `status` != 2', [reqObj.item_id, reqObj.price_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',

                            'message': 'items price deleted successfully'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }

                })

            })

        }, 3)

    })

    app.post('/api/admin/item_price_list', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['item_id'], () => {
                db.query('SELECT `pd`.`price_id`, `pd`.`item_id`, `pd`.`unit_id`, `pd`.`amount`, `pd`.`status`, `pd`.`created_date`, `ud`.`unit_name`, `ud`.`unit_value` FROM `price_detail` AS `pd` INNER JOIN `unit_detail` AS `ud` ON `pd`.`unit_id` = `ud`.`unit_id` WHERE `pd`.`item_id` = ? AND `pd`.`status` != 2 ', [reqObj.item_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    res.json({
                        'status': '1',
                        'payload': result
                    })
                })
            })
        }, 3)


    })

    app.post('/api/admin/item_detail', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['item_id'], () => {

                db.query('SELECT `item_id`, `main_cat_id`, `cat_id`, `item_name`, `description`, `image`, `status`, `created_date`, `modify_date` FROM `item_detail` WHERE `item_id` = ? AND `status` != 2;' +
                    'SELECT `nutrition_id`, `item_id`, `name`, `status`, `created_date`, `modify_date` FROM `nutrition_detail` WHERE `item_id` = ? AND `status` != 2;' +
                    'SELECT `pd`.`price_id`, `pd`.`item_id`, `pd`.`unit_id`, `pd`.`amount`, `pd`.`status`, `pd`.`created_date`, `pd`.`modify_date`, `ud`.`unit_name`, `ud`.`unit_value` FROM `price_detail` AS `pd` INNER JOIN `unit_detail` AS `ud` ON `ud`.`unit_id`= `pd`.`unit_id` AND `ud`.`status` != 2 WHERE `pd`.`item_id` =? AND `pd`.`status` != 2 ', [reqObj.item_id], (err, result) => {

                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        if (result[0].length > 0) {
                            result[0][0].nutrition_list = result[1]
                            result[0][0].price_list = result[2]

                            res.json({
                                'status': '1',
                                'payload': result[0][0]
                            })

                        } else {
                            res.json({
                                'status': '0',
                                'message': 'item not found'
                            })
                        }
                    })

            })

        }, 3)

    })

    app.post('/api/admin/new_orders_list', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {

            db.query('SELECT `oid`.`item_order_id`, `iid`.`item_id`, `oid`.`price_id`, `oid`.`total_amount`, `oid`.`offer_amount`, `oid`.`pay_amount`, `oid`.`reason`, `oid`.`status` AS `order_status`, `iid`.`item_name`, (CASE WHEN `iid`.`image` != ""  THEN CONCAT( "' + helper.ImagePath() + '" , `iid`.`image`  ) ELSE "" END) AS `image`, `iid`.`description`, `cd`.`qty` , `od`.`order_id`, `od`.`user_id`, `od`.`status`, `od`.`payment_type`, `od`.`payment_status`, `od`.`address`, `od`.`lati`, `od`.`longi`, `od`.`zip_code`, `od`.`total_order_amount`, `od`.`offer_order_amount`, `od`.`delivery_amount`, `od`.`user_pay_order_amount`, `ud`.`unit_name`, `uud`.`name`, `uud`.`mobile`, `uud`.`mobile_code`, `pd`.`amount` AS `item_amount`, `od`.`created_date` FROM `order_detail` AS `od` ' +
                'INNER JOIN `order_item_detail` AS `oid` ON `oid`.`order_id` = `od`.`order_id` ' +
                
                'INNER JOIN `cart_detail` AS `cd` ON `oid`.`cart_id` = `cd`.`cart_id` ' +
                'INNER JOIN `item_detail` AS `iid` ON `iid`.`item_id` = `cd`.`item_id` ' +
                'INNER JOIN `price_detail` AS `pd` ON `pd`.`price_id` = `oid`.`price_id` ' +
                'INNER JOIN `unit_detail` AS `ud` ON `ud`.`unit_id` = `pd`.`unit_id` ' +
                'INNER JOIN `user_detail` AS `uud` ON `od`.`user_id` = `uud`.`user_id` ' +
                'WHERE `od`.`status` <= 2 AND ((`od`.`payment_type` = 1 ) OR (`od`.`payment_status` = 1 && `od`.`payment_type` = 2 ) ) ORDER BY `od`.`order_id` ', [

            ], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res)
                    return
                }

                res.json({
                    'status': '1',
                    'payload': result
                })

            })
        }, 3)

    })

    app.post('/api/admin/order_item_accept_reject', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['item_order_id', 'is_accept', 'reason'], () => {

                db.query('UPDATE `order_item_detail` SET `reason`=?,`status`=?,`modify_date`=NOW() WHERE `item_order_id` = ? AND `status` = 0', [reqObj.is_accept == 1 ? "" : reqObj.reason, reqObj.is_accept == 1 ? 1 : 7, reqObj.item_order_id], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {

                        db.query('INSERT INTO `order_status_detail` (`item_order_id`, `order_status`, `created_date`) VALUES (?,?,NOW()) ', [reqObj.item_order_id, reqObj.is_accept == 1 ? 1 : 7], (err, result) => {
                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return
                            }

                            if (result) {
                                helper.Dlog("Status DateTime Update");
                            }
                        })

                        res.json({
                            'status': '1',
                            'message': reqObj.is_accept == 1 ? "order item accepted successfully" : "order item rejected successfully"
                        })
                    } else {
                        res.json({
                            'status': "0",
                            'message': msg_fail
                        })
                    }

                })

            })

        }, 3)

    })

    app.post('/api/admin/offer_create', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            //1 = Category Wise, 2 = Items Wise
            //1 = Per, 2 = BuyGet
            helper.CheckParameterValid(res, reqObj, ['offer_name', 'offer_description', 'type', 'offer_type', 'buy_unit_id', 'buy_qty', 'get_qty', 'get_unit_id', 'cat_id', 'item_id', 'offer_value', 'start_date', 'end_date'], () => {

                db.query('INSERT INTO `offer_detail`( `offer_name`, `offer_description`, `type`, `offer_type`, `buy_unit_id`, `buy_qty`, `get_qty`, `get_unit_id`, `cat_id`, `item_id`, `offer_value`, `start_date`, `end_date`) VALUES (?,?,?, ?,?,?, ?,?,?, ?,?,?, ?)', [
                    reqObj.offer_name, reqObj.offer_description, reqObj.type, reqObj.offer_type, reqObj.buy_unit_id, reqObj.buy_qty, reqObj.get_qty, reqObj.get_unit_id, reqObj.cat_id, reqObj.item_id, reqObj.offer_value, reqObj.start_date, reqObj.end_date
                ], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result) {
                        res.json({
                            'status': '1',
                            'message': 'offer created successfully'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }

                })

            })


        }, 3)

    })

    app.post('/api/admin/offer_list', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            db.query('SELECT `offer_id`, `offer_name`, `offer_description`, `type`, `offer_type`, `buy_unit_id`, `buy_qty`, `get_qty`, `get_unit_id`, `cat_id`, `item_id`, `offer_value`, `start_date`, `end_date`, `status`, `created_date`, `modify_date` FROM `offer_detail` WHERE `status` != ?', [
                2
            ], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                res.json({
                    'status': '1',
                    'payload': result
                })

            })

        }, 3)

    })

    app.post('/api/admin/offer_update', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['offer_id', 'offer_name', 'offer_description', 'type', 'offer_type', 'buy_unit_id', 'buy_qty', 'get_qty', 'get_unit_id', 'cat_id', 'item_id', 'offer_value', 'start_date', 'end_date'], () => {

                db.query('UPDATE `offer_detail` SET `offer_name`=?,`offer_description`=?,`type`=?,`offer_type`=?,`buy_unit_id`=?,`buy_qty`=?,`get_qty`=?,`get_unit_id`=?,`cat_id`=?,`item_id`=?,`offer_value`=?,`start_date`=?,`end_date`=?,`modify_date`= NOW() WHERE `offer_id` = ? AND `status` != ?', [
                    reqObj.offer_name, reqObj.offer_description, reqObj.type, reqObj.offer_type, reqObj.buy_unit_id, reqObj.buy_qty, reqObj.get_qty, reqObj.get_unit_id, reqObj.cat_id, reqObj.item_id, reqObj.offer_value, reqObj.start_date, reqObj.end_date, reqObj.offer_id, 2
                ], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': "1",
                            'message': 'offer updated successfully'
                        })

                    } else {
                        res.json({
                            'status': "0",
                            'message': msg_fail
                        })
                    }

                })


            })
        }, 3)

    })

    app.post('/api/admin/offer_delete', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['offer_id'], () => {

                db.query('UPDATE `offer_detail` SET `status` = ?,`modify_date`= NOW() WHERE `offer_id` = ? AND `status` != ?', [
                    2, reqObj.offer_id, 2
                ], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': "1",
                            'message': 'offer deleted successfully'
                        })

                    } else {
                        res.json({
                            'status': "0",
                            'message': msg_fail
                        })
                    }

                })


            })
        }, 3)

    })

    app.post('/api/admin/delivery_boy_create', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['name', 'mobile_code', 'mobile', 'email'], () => {

                db.query('SELECT `user_id` FROM `user_detail` WHERE `mobile` = ? AND `mobile_code` = ? AND `status` != 2', [reqObj.mobile, reqObj.mobile_code], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.length > 0) {
                        res.json({
                            'status': '0',
                            'message': 'user mobile number already register'
                        })
                    } else {
                        db.query('INSERT INTO `user_detail`( `name`, `mobile_code`, `mobile`, `email`,  `user_type`) VALUES (?,?,?, ?,?)', [
                            reqObj.name, reqObj.mobile_code, reqObj.mobile, reqObj.email, 2
                        ], (err, result) => {

                            if (err) {
                                helper.ThrowHtmlError(err, res)
                                return
                            }

                            if (result) {
                                res.json({
                                    'status': '1',
                                    'message': 'delivery boy user created successfully',
                                    'payload': {
                                        'user_id': result.insertId,
                                        'name': reqObj.name,
                                        'mobile_code': reqObj.mobile_code,
                                        'mobile': reqObj.mobile,
                                        'email': reqObj.email,
                                        'status': 1
                                    }
                                })
                            } else {
                                res.json({
                                    'status': '0',
                                    'message': msg_fail
                                })
                            }

                        })
                    }

                })

            })

        }, 3)
    })

    app.post('/api/admin/delivery_boy_update', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['user_id', 'name', 'mobile_code', 'mobile', 'email'], () => {

                db.query('SELECT `user_id` FROM `user_detail` WHERE `user_id` != ? AND `mobile` = ? AND `mobile_code` = ? AND `status` != 2', [reqObj.user_id, reqObj.mobile, reqObj.mobile_code], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.length > 0) {
                        res.json({
                            'status': '0',
                            'message': 'user mobile number already register'
                        })
                    } else {
                        db.query('UPDATE `user_detail` SET `name`=?,`mobile_code`=?,`mobile`=?,`email`=?,`modify_date` = NOW() WHERE `user_id` = ?', [
                            reqObj.name, reqObj.mobile_code, reqObj.mobile, reqObj.email, reqObj.user_id
                        ], (err, result) => {

                            if (err) {
                                helper.ThrowHtmlError(err, res)
                                return
                            }

                            if (result.affectedRows > 0) {
                                res.json({
                                    'status': '1',
                                    'message': 'delivery boy user updated successfully',

                                })
                            } else {
                                res.json({
                                    'status': '0',
                                    'message': msg_fail
                                })
                            }

                        })
                    }

                })

            })

        }, 3)
    })
    app.post('/api/admin/delivery_boy_delete', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['user_id'], () => {


                db.query('UPDATE `user_detail` SET `status`=2,`modify_date` = NOW() WHERE `user_id` = ?', [
                    reqObj.user_id
                ], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    if (result.affectedRows > 0) {
                        res.json({
                            'status': '1',
                            'message': 'delivery boy user deleted successfully',

                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }

                })


            })

        }, 3)
    })

    app.post('/api/admin/delivery_boy_user_list', (req, res) => {
        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {


            db.query('SELECT `user_id`, `name`, `mobile_code`, `mobile`, `email`, `os_type`,  `status`, `created_date`, `modify_date` FROM `user_detail` WHERE `status` != 2 AND `user_type` = 2', [], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                res.json({
                    'status': '1',
                    'payload': result
                })

            })

        }, 3)
    })

    app.post('/api/admin/delivery_boy_list', (req, res) => {

        helper.Dlog(req.body)
        checkAccessToken(req.headers, res, (uObj) => {

            db.query('SELECT `user_id`, `name`, `mobile_code`, `mobile`, `email`, `os_type`, `push_token`, `auth_token`, `otp_code`, `user_type`, `status`, `created_date`, `modify_date` FROM `user_detail` WHERE `user_type` = 2 AND `status` = 1 AND `user_id` NOT IN (SELECT `delivery_boy_id` AS `user_id` FROM `order_detail` WHERE `od`.`delivery_body_id` != 0 AND (`od`.`status` = 2 OR `od`.`status` = 3 )', [], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }

                res.json({
                    'status': '1',
                    'payload': result
                })

            })

        }, 3)

    })

    app.post('/api/admin/delivery_assign_order_for_delivery', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body
        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['delivery_boy_id', 'order_id'], () => {

                db.query('UPDATE `order_detail` SET `delivery_boy_id`=?,`status`=?,`modify_date`=NOW() WHERE `order_id` = ? AND `status` <?', [reqObj.delivery_boy_id, 2, reqObj.order_id, 2], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    if (result.affectedRows > 0) {
                        db.query('INSERT INTO `order_status_detail`(`order_id`, `order_status`) VALUES (?,?)', [reqObj.order_id, 2], (err, result) => {

                            if (err) {
                                helper.ThrowHtmlError(err)

                            }


                            res.json({
                                'status': '1',
                                'message': 'delivery boy assigned successfully'
                            })
                        })

                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }

                })

            })


        }, 3)

    })

    app.post('/api/admin/review_list', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['item_id'], () => {

                db.query('SELECT `rate_id`, `item_id`, `item_order_id`, `rate`, `message`, `user_id`, `status`, `created_date`, `modify_date` FROM `review_detail` AS `rd` '
                    + 'INNER JOIN`user_detail` AS`ud` ON`ud`.`user_id` = `rd`.`user_id`' +
                    'WHERE`rd`.`item_id` = ? AND`rd`.`status` != 2 ', [reqObj.item_id], (err, result) => {

                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        res.json({
                            'status': '1',
                            'payload': result
                        })

                    })

            })
        }, '3')

    })

}


function checkAccessToken(headersObj, res, callback, requireType = "") {
    helper.Dlog(headersObj.access_token);
    helper.CheckParameterValid(res, headersObj, ["access_token"], () => {

        db.query('SELECT `user_id`, `name`, `mobile_code`, `mobile`, `email`, `user_type`, `status` FROM `user_detail` WHERE `auth_token` = ? AND `status` = ?', [headersObj.access_token, 1], (err, result) => {


            if (err) {
                helper.ThrowHtmlError(err, res);
                return
            }

            if (result.length > 0) {

                if (requireType != "") {
                    if (requireType == result[0].user_type) {
                        return callback(result[0])
                    } else {
                        res.json({
                            'status': '0',
                            'code': '404',
                            'message': 'Access Denied. Unauthorized user access.'
                        })
                    }

                } else {
                    return callback(result[0])
                }

            } else {
                res.json({
                    'status': '0',
                    'code': '404',
                    'message': 'Access Denied. Unauthorized user access.'
                })
            }
        })

    })
}