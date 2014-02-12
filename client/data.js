Session.set('example', false);

Template.data.events({
    'click caption li a' : function() {
        Session.set('label_group', this instanceof Window ? false : this + '');
    }
});

Template.data.data_heads = function() {
    Session.set('labels', null);
    console.log('heads');
    if ( ! Session.get('selected_table') || !Tables )
        return;
    console.log('table');
    var table = Tables[ Session.get('selected_table') ];
    if (!table)
        return;
    console.log('all good');

    var found = Tables.qr.findOne({ collection : Session.get('selected_data') });

    if (found) {
        found = _.find(
            found.sections,
            function(section) {
                return Session.equals('selected_data', section.name)
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
    var data_table = Session.get('selected_data');
    var labels     = Session.get('labels');
    var label_sort = Session.get('label_sort');

    if ( !Session.get(data_table) || !Tables[data_table]) {
        console.warn('not loaded ', data_table, ' yet', Session.get('labels'));
        console.log(Session.get(data_table), Tables[data_table]);
        return;
    }
    console.log(data_table, ' has ', Tables[data_table].find().count(), ' records');

    var sort = {};
    sort[ labels[ label_sort ].name ] = 1;
    var group = Session.get('label_group');
    var name = labels[label_sort].name;
    var find = {};
    if ( typeof group === 'string' && name ) {
        find[ name ] = { $regex : '^\\W*[' + group + group.toUpperCase() + ']' };
    }

    var found = Tables[data_table]
        .find(
            find,
            { sort : sort }
        );

    if (found && typeof group !== 'string') {
        try {
            if ( found.count() > 20 ) {
                var rows   = {};
                var groups = [];
                found.forEach(function(row) {
                    var group = row[ labels[ label_sort ].name ].match(/^\W*(\w)/)[1].toLowerCase();

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
    if ( !Session.get('selected_data') ) return;

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

Template.example.examples = function() {
    return Session.get('example');
};

Template.group.active = function() {
    return Session.equals('label_group', this+'') ? ' active' : '';
};

Template.col.value = function() {
    return values(this);
};

function values(value) {
    if ( value instanceof String ) return value;

    var out = '';
    if ( value instanceof Array ) {
        if ( value.length == 0 ) return '';
        for ( var i in value ) {
            if (out) out = out + ', ';
            out = out + value[i];
        }
        return out;
    }
    else if ( this instanceof Window ) return '';

    return value;
}

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


