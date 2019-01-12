var router = require('express').Router();
var TYPES = require('tedious').TYPES;

/* GET task listing. */
router.get('/', function (req, res) {

    req.sql("SELECT TOP (1500) [Admin.Log].ID, [Admin.Log].LogText, [Admin.Log].ErrorMessage, [Admin.Log].Zeit, [Admin.Log].UserID, OnlyAVs.Name\n" +
        "FROM [Admin.Log] INNER JOIN OnlyAVs ON [Admin.Log].UserID = OnlyAVs.AVID\n" +
        "ORDER BY [Admin.Log].Zeit DESC\n" +
        "FOR JSON PATH")
        .into(res.type('json'), '[]');

});
router.get('/M', function (req, res) {
    req.sql("SELECT * FROM [Mitglieder.Mitglieder] for json path")
        .into(res.type('json'), '{}');
});
router.get('/M/:id', function (req, res) {
    req.sql("SELECT * FROM [Mitglieder.Mitglieder] Where [Mitglieder.Mitglieder].ID = @id for json path")
        .param('id', req.params.id, TYPES.Int)
        .into(res.type('json'), '{}');
});
module.exports = router;