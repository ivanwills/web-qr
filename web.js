
Tables = {
    qr : new Meteor.Collection("qr")
};
Tables.qr.find({}, {}).forEach(function(table) {
    Tables[table.details.table] = new Meteor.Collection(table.details.table);
    console.log('creating ', table.details.table, Tables[table.details.table].find().count()  );
});
console.log('connected');

if (Meteor.isClient) {
for (var key in Tables) console.log(key);
    for ( var coll in {'css':1, 'js':1, 'html':1} ) {
        console.log(coll);
        if ( coll === 'qr' ) continue;
        if (!Tables[coll]) Tables[coll] = new Meteor.Collection(coll);
        var table = Tables[coll];

        if ( table.find().count() <= 1 ) {
            console.log('trying to get ' + coll);
            $.getJSON(coll + '.json', function(data) {
                table.remove();
                console.log(table.insert(data));
            });
        }
        else {
            console.log('Happy with ', table.find().count(), ' for ', coll);
        }
    }

    Template.nav.tables = function () {
        return Tables.qr.find({}, {}); //sort: {"details.pos": -1, name: 1}});
    };

    Template.table.selected = function() {
        if ( !Session.get('selected_table') ) {
            console.log('selecting: ', this.details.table);
            Session.set('selected_table', this.details.table);
        }
        return Session.equals("selected_table", this.details.table) ? "active" : '';
    };

    Template.table.table = function() {
        return this.details.table;
    };

    Template.table.events({
        'click' : function() {
            Session.set("selected_table", this.details.table);
            Session.set("selected_label", null);
        }
    });

    Template.header.labels = function() {
        if ( !Tables || !Session.get('selected_table') || !Tables[Session.get('selected_table')]) 
            return;

        return Tables[Session.get('selected_table')].find();
    };

    Template.label.selected = function() {
        if ( !Session.get('selected_label') ) {
            Session.set('selected_label', this._id);
        }
        return Session.equals("selected_label", this._id) ? "active" : '';
    };

    Template.label.events({
        'click' : function() {
            Session.set("selected_label", this._id);
        }
    });

    Template.data.data_heads = function() {
        if ( !Tables || !Session.get('selected_table') || !Tables[Session.get('selected_table')])
            return;

        var found = Tables[Session.get('selected_table')]
            .findOne(Session.get('selected_label'));

        if (found)
            return found.labels;
    };

    Template.data.values = function() {
        if ( !Tables || !Session.get('selected_table') || !Tables[Session.get('selected_table')])
            return;

        var found = Tables[Session.get('selected_table')]
            .findOne(Session.get('selected_label'));

        if (found) {
            console.log(Session.get('selected_table') + ' found values : ', found.values);
            return found.values;
        }
        console.log('nothing found for ', Session.get('selected_table'));
    };

    Template.value.selected = function() {
        if ( !Session.get('selected_label') ) {
            Session.set('selected_label', this.label);
        }
        return Session.equals("selected_label", this.label) ? "active" : '';
    };

    Template.value.value_cols = function() {
        var found = Tables[Session.get('selected_table')]
            .findOne(Session.get('selected_label'));

        var cols = [];
        for ( var lable in found.labels ) {
            cols.push(this[ found.labels[lable].name ]);
        }
        console.log(found.labels);
        return cols;
    };

    Template.col.attribute = function() {
        console.log('attribute ', this);
    };

}

if (Meteor.isServer) {
for (var key in Tables) console.log(key);
    Meteor.startup(function () {
        if (Tables.qr.find().count() === 0) {
            var names = {
                "CSS" : {
                    "table" : "css",
                    "pos"   : 1,
                },
                "JS" : {
                    "table" : "js",
                    "pos"   : 2,
                },
                "HTML" : {
                    "table" : "html",
                    "pos"   : 3,
                },
            };

            var require = __meteor_bootstrap__.require;
            console.log('Require ', __meteor_bootstrap__);
            console.log('Require ', require);
            var fs = require('fs');
            var file = __dirname + '/test.json';

            for ( var i in names ) {
                Tables.qr.insert({name: i, details: names[i]});
                if ( !Tables[names[i].table] ) {
                    console.log('creating collection ', names[i].table);
                    Tables[names[i].table] = new Meteor.Collection(names[i].table);
                }
                Tables[names[i].table].insert({
                    name: i,
                    label: i.toUpper,
                    labels:[],
                    sort: {},
                    values: []
                });
            }
        }
    });
}
