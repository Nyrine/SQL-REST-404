var router = require('express').Router();
var TYPES = require('tedious').TYPES;

/* GET task listing. */
router.get('/', function (req, res) {

    req.sql("SELECT * From [WebViewDienste] for json path")
        .into(res.type('json'), '[]');

});

/* GET single task. */
router.get('/:date', function (req, res) {

    req.sql("SELECT * From [WebViewDienste] Where AM = @date for json path, without_array_wrapper")
        .param('id', req.params.id, TYPES.Int)
        .into(res.type('json'), '{}');

});
/*

/!* POST create task. *!/
router.post('/', function (req, res) {

    req.sql("exec createTodo @todo")
        .param('todo', req.body, TYPES.NVarChar)
        .exec(res);

});

/!* PUT update task. *!/
router.put('/:id', function (req, res) {

    req.sql("exec updateTodo @id, @todo")
        .param('id', req.params.id, TYPES.Int)
        .param('todo', req.body, TYPES.NVarChar)
        .exec(res);

});

/!* DELETE single task. *!/
router.delete('/:id', function (req, res) {

    req.sql("delete from todo where id = @id")
        .param('id', req.params.id, TYPES.Int)
        .exec(res);

});
*/

module.exports = router;