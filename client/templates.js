Session.set('example', false);

Template.nav.tables = function () {
    // Read the collections specified in qr
    Tables.qr.find({}, {}).forEach(function(table) {
        var coll = table.collection;
        if (!Tables[coll]) Tables[coll] = new Meteor.Collection(coll);
    });

    return Tables.qr.find({}, { sort : { pos : 1 } });
};

Template.sections.selected = function() {
    if ( !Session.get('selected_table') ) {
        Session.set('selected_table', this.collection);
    }
    return Session.equals("selected_table", this.collection) ? "active" : '';
};

Template.sections.table = function() {
    return this.collection;
};

Template.sections.events({
    'click' : function() {
        if ( !Session.equals("selected_table", this.collection) ) {
            Session.set("selected_table", this.collection);
            Session.set("selected_label", null);
            Session.set("labels", null);
        }
    }
});

Template.sidebar.labels = function(a) {
    var collection = Session.get('selected_table');
    if ( !Tables || !collection )
        return;

    var data = Tables.qr.find( { collection : collection } );
    data.forEach(function(d) { data = d });
    return data.sections;
};

Template.label.table = function(a) {
    return Session.get('selected_table');
};

Template.label.selected = function() {
    if ( !Session.get('selected_label') ) {
        Session.set('selected_label', this.name);
    }
    return Session.equals("selected_label", this.name) ? "active" : '';
};

Template.label.events({
    'click' : function() {
        if ( !Session.equals("selected_label", this.name) )
            Session.set("selected_label", this.name);
    }
});

Template.data.events({
    'click caption li a' : function() {
        Session.set('label_group', this instanceof Window ? false : this + '');
    }
});

Template.data.data_heads = function() {
    Session.set('labels', null);
    if ( !Tables || !Session.get('selected_table') || !Tables[Session.get('selected_table')])
        return;

    var found = Tables.qr.findOne({ collection : Session.get('selected_table') });

    if (found) {
        found = _.find(
            found.sections,
            function(section) {
                return Session.equals('selected_label', section.name)
            }
        );
        if (!found) return;

        var sort = Session.get('label_sort');
        Session.set('label_sort', found.labels[sort] ? sort : 0);
        Session.set('labels', found.labels);
        return found.labels;
    }
};

Template.data.groups = function() {
    var groups = Session.get('groups');
    return groups ? groups : null;
};

Template.data.values = function() {
    var selected_table = Session.get('selected_table');
    var selected_label = Session.get('selected_label');
    var labels     = Session.get('labels');
    var label_sort = Session.get('label_sort');

    if ( !Tables || !selected_table || !Tables[selected_table])
        return;

    var sort = {};
    sort[ labels[ label_sort ].name ] = 1;
    var group = Session.get('label_group');
    var name = labels[label_sort].name;
    var find = { type : selected_label };
    if ( typeof group === 'string' && name ) {
        find[ name ] = { $regex : '^[' + group + group.toUpperCase() + ']' };
    }
    console.log('find = ', find, group, typeof group);
    try {
    var found = Tables[selected_table]
        .find(
            find,
            { sort : sort }
        );
    }
    catch(e) { console.log('find error', e) }

    if (found && typeof group !== 'string') {
        try {
            if ( found.count() > 20 ) {
                var rows   = {};
                var groups = [];
                found.forEach(function(row) {
                    var group = row[ labels[ label_sort ].name ].substr(0,1).toLowerCase();

                    if ( !rows[ group ] ) groups.push(group);

                    rows[ group ] = true;
                });

                Session.set('groups', groups.sort());
            }
            else
                Session.set('groups', []);
        }
        catch(e) {
            console.error('error calc groups', e);
        }
    }
    return found;

    if (0) {

        var group = Session.get('label_group');
            console.log(group);
        if (group) {
            var group_re = new RegExp('^' + group, 'i');
            console.log(group_re);
            try {
                var name = labels[label_sort].name;
                console.log(label_sort, labels[label_sort], name);
                var filter = [];
                console.log('count = ', found.count());
                filter = found.map( function(row) {
                    console.log(row);
                    console.log(found);
                    if ( row[ name ].match(group_re) ) return row;
                    return;
                } );
                return filter;
            } catch(e) { console.error('filter ', e); }
        }
        return found;
        return group ? _.filter(found, function(a) {}) : found;
    }
};

Template.data_head.events({
    'click th' : function() {
        var labels     = Session.get('labels');
        var label_sort = Session.get('label_sort');
        for ( var i in labels ) {
            if ( labels[i].name == this.name ) {
                Session.set("label_sort", i);
                return;
            }
        }
    }
});

Template.value.events({
    'mouseenter tr' : function() {
        Session.set('example', this.examples);
    }
});

Template.value.value_cols = function() {
    if ( !Session.get('selected_table') ) return;

    var columns = Session.get('labels');
    var values = [];
    for ( var i in columns ) {
        values.push( this[ columns[i].name ] );
    }
    return values;
};

Template.col.attribute = function() {
    console.log('attribute ', this);
};

Template.sidebar.hover = function() {
    return Session.get('example');
};

Template.example.examples = function() {
    return Session.get('example');
};

Template.group.active = function() {
    return Session.equals('label_group', this+'') ? ' active' : '';
};

var initial_top   = false;
var initial_width = false;
var offset        = 50;
$(document).scroll( function(a,b,c) {
    if ( $('#example').size() ) {
        var eg = $('#example');
        if ( !initial_top ) {
            initial_top   = eg.offset().top;
            initial_width = eg.width();
        }

        if ( $(document).scrollTop() > initial_top - offset ) {
            // fixed
            eg.css({ position : 'fixed', width: initial_width + 'px', top : offset + 'px' });
        }
        else {
            // normal
            eg.css({ position : 'inherit', width : 'auto', top : 'auto' });
        }
    }
});

