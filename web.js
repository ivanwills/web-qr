
Tables = {
    qr : new Meteor.Collection("qr")
};
Tables.qr.find({}, {sort:{"pos": 1}}).forEach(function(table) {
    // only executed on server initally
    Tables[table.collection] = new Meteor.Collection(table.collection);
});

if (Meteor.isClient) {

    Template.nav.tables = function () {
        // Read the collections specified in qr
        Tables.qr.find({}, {}).forEach(function(table) {
            var coll = table.collection;
            if (!Tables[coll]) Tables[coll] = new Meteor.Collection(coll);
        });

        return Tables.qr.find({}, {}); //sort: {"details.pos": -1, name: 1}});
    };

    Template.table.selected = function() {
        if ( !Session.get('selected_table') ) {
            console.log('selecting: ', this);
            Session.set('selected_table', this.collection);
        }
        return Session.equals("selected_table", this.collection) ? "active" : '';
    };

    Template.table.table = function() {
        return this.collection;
    };

    Template.table.events({
        'click' : function() {
            Session.set("selected_table", this.collection);
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
    });
}
