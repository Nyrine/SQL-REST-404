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
        .into(res.type('json'), '[]');

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
        .into(res.type('json'), '{}');

});
router.get('/:id/stats', function (req, res) {
    req.sql("SET LANGUAGE GERMAN\n" +
        "SELECT DATENAME(DW, ADatum) AS Tag, SUM(multiplikator) AS Anzahl\n" +
        "FROM    Web_View_Dienste\n" +
        "WHERE   (MitgliederID = @id) AND (ADatum BETWEEN '06/01/2018' AND GETDATE())\n" +
        "GROUP BY DATEPART(WEEKDAY, ADatum), DATENAME(DW, ADatum)\n" +
        "ORDER BY DATEPART(WEEKDAY, ADatum)\n" +
        "for json path")
        .param('id', req.params.id, TYPES.Int)
        .into(res.type('json'), '{}');
});
router.get('/:id/dstats', function (req,res) {
    req.sql("SELECT        TOP (100) PERCENT MitgliederID, COUNT(NameLong) AS Anzahl, NameLong\n" +
        "FROM            dbo.Web_View_Dienste\n" +
        "WHERE   (MitgliederID = @id) AND (ADatum BETWEEN '06/01/2018' AND GETDATE())\n" +
        "GROUP BY MitgliederID, NameLong\n" +
        "ORDER BY MitgliederID\n" +
        "for json path")
        .param('id', req.params.id, TYPES.Int)
        .into(res.type('json'), '{}');
})
router.get('/search/:vname?/:nname?/:sname?', function (req, res) {
    var vorname = req.params.vname;
    var nachname = req.params.nname;
    var spitzname = req.params.sname;
    if(vorname == null && nachname == null && spitzname == null){
        console.log(vorname);
        console.log(nachname);
        console.log(spitzname);
        console.log((vorname == null && nachname == null && spitzname == null));
       /* res.render('error');*/
    } else {
        req.sql("Select * From [Mitglieder.Mitglieder]" +
            " Where (Vorname like '%' + @vorname + '%') or (Nachname like @nachname) or (Spitzname like @spitzname)" +
            " for json path")
            .param('vorname',vorname,TYPES.NVarChar)
            .param('nachname',nachname,TYPES.NVarChar)
            .param('spitzname',spitzname,TYPES.NVarChar)
            .into(res.type('json'), '{}');
    }
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
//was geht
module.exports = router;