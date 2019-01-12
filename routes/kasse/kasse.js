var router = require('express').Router();
var TYPES = require('tedious').TYPES;

/* GET task listing. */
router.get('/', function (req, res) {

    req.sql("SELECT        [Mitglieder.Mitglieder].Vorname, [Mitglieder.Mitglieder].Nachname, [Mitglieder.Mitglieder].Spitzname, [Mitglieder.Sex].SexType, [Mitglieder.Mitglieder].Studienrichtung, \n" +
        "                         [Mitglieder.Mitglieder].Hochschule, [Mitglieder.Mitglieder].Geburtstag, [Mitglieder.Mitglieder].Straße, [Mitglieder.Mitglieder].Nummer, [Mitglieder.Mitglieder].Zusatz, [Mitglieder.Mitglieder].PLZ, \n" +
        "                         [Mitglieder.Mitglieder].Wohnort, [Mitglieder.Mitglieder].Land, [Mitglieder.Mitglieder].Telefon, [Mitglieder.Mitglieder].Mobil, [Mitglieder.Mitglieder].Mobil2, [Mitglieder.Mitglieder].[E-Mail], \n" +
        "                         [Mitglieder.Mitglieder].Aufgenomen, [Mitglieder.Status].Status\n" +
        "FROM            [Mitglieder.Mitglieder] INNER JOIN\n" +
        "                         [Mitglieder.Status] ON [Mitglieder.Mitglieder].Status = [Mitglieder.Status].ID INNER JOIN\n" +
        "                         [Mitglieder.Sex] ON [Mitglieder.Mitglieder].Sex = [Mitglieder.Sex].ID for json path")
        .into(res, '[]');

});

/* GET single task. */
router.get('/:id', function (req, res) {

    req.sql("SELECT        [Mitglieder.Mitglieder].Vorname, [Mitglieder.Mitglieder].Nachname, [Mitglieder.Mitglieder].Spitzname, [Mitglieder.Sex].SexType, [Mitglieder.Mitglieder].Studienrichtung, \n" +
        "                         [Mitglieder.Mitglieder].Hochschule, [Mitglieder.Mitglieder].Geburtstag, [Mitglieder.Mitglieder].Straße, [Mitglieder.Mitglieder].Nummer, [Mitglieder.Mitglieder].Zusatz, [Mitglieder.Mitglieder].PLZ, \n" +
        "                         [Mitglieder.Mitglieder].Wohnort, [Mitglieder.Mitglieder].Land, [Mitglieder.Mitglieder].Telefon, [Mitglieder.Mitglieder].Mobil, [Mitglieder.Mitglieder].Mobil2, [Mitglieder.Mitglieder].[E-Mail], \n" +
        "                         [Mitglieder.Mitglieder].Aufgenomen, [Mitglieder.Status].Status\n" +
        "FROM            [Mitglieder.Mitglieder] INNER JOIN\n" +
        "                         [Mitglieder.Status] ON [Mitglieder.Mitglieder].Status = [Mitglieder.Status].ID INNER JOIN\n" +
        "                         [Mitglieder.Sex] ON [Mitglieder.Mitglieder].Sex = [Mitglieder.Sex].ID Where [Mitglieder.Mitglieder].ID = @id for json path, without_array_wrapper")
        .param('id', req.params.id, TYPES.Int)
        .into(res, '{}');

});

/* POST create task. */
router.post('/', function (req, res) {

    req.sql("exec createTodo @todo")
        .param('todo', req.body, TYPES.NVarChar)
        .exec(res);

});

/* PUT update task. */
router.put('/:id', function (req, res) {

    req.sql("exec updateTodo @id, @todo")
        .param('id', req.params.id, TYPES.Int)
        .param('todo', req.body, TYPES.NVarChar)
        .exec(res);

});

/* DELETE single task. */
router.delete('/:id', function (req, res) {

    req.sql("delete from todo where id = @id")
        .param('id', req.params.id, TYPES.Int)
        .exec(res);

});

module.exports = router;