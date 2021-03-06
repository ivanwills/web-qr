/*global Template,Session,Tables,Deps,Meteor,Window */
Session.set('example', false);

Template.data.data_heads = function() {
    Session.set('labels', null);
    var table_name = Session.get('selected_table');
    var data_name  = Session.get('selected_data');

    if ( !table_name || !data_name || !Tables[table_name] ) {
        //console.warn('not loaded "', table_name, '" or "', data_name, '" yet');
        return;
    }

    var table = Tables[table_name];

    var found = table.findOne({ collection : data_name });
    var sort = Session.get('label_sort');
    Session.set('label_sort', found.labels[sort] ? sort : 0);
    Session.set('labels', found.labels);

    return found.labels;
};

Template.data.groups = function() {
    var groups = Session.get('groups');
    return groups ? groups : null;
};

Template.data.values = function() {
    var data_table = Session.get('selected_data');
    var label_sort = Session.get('label_sort');

    if ( !Session.get(data_table) || !Tables[data_table]) {
        //console.warn('not loaded ', data_table, ' yet', Session.get('labels'));
        return;
    }

    var labels = Session.get('labels');
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
};

Template.data_head.events({
    'click th' : function() {
        var labels     = Session.get('labels');
        var label_sort = Session.get('label_sort');
        for ( var i in labels ) {
            if ( labels[i].name === this.name ) {
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
        if (columns.hasOwnProperty(i)) {
            values.push( this[ columns[i].name ] );
        }
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

Template.group.events({
    'click li a' : function(e) {
        console.log('click', this + '', this, this.data[sort]);
        Session.set('label_group', this instanceof Window ? false : this + '');
        e.stopPropagation();
        return false;
    }
});

function values(value) {
    if ( value instanceof String ) return value;

    var out = '';
    if ( value instanceof Array ) {
        if ( value.length === 0 ) return '';
        for ( var i in value ) {
            if ( value.hasOwnProperty(i) ) {
                if (out) out = out + ', ';
                out = out + value[i];
            }
        }
        return out;
    }
    else if ( this instanceof Window ) return '';

    return value;
}

Template.col.value = function() {
    return values(this);
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


