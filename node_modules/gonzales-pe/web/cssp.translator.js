function csspToSrc(tree, hasInfo) {
    var _m_simple = {
            'unary': 1, 'nth': 1, 'combinator': 1, 'ident': 1, 'number': 1, 's': 1,
            'string': 1, 'attrselector': 1, 'operator': 1, 'raw': 1, 'unknown': 1
        },
        _m_composite = {
            'simpleselector': 1, 'dimension': 1, 'selector': 1, 'property': 1, 'value': 1,
            'filterv': 1, 'progid': 1, 'ruleset': 1, 'atruleb': 1, 'atrulerq': 1, 'atrulers': 1,
            'stylesheet': 1
        },
        _m_primitive = {
            'cdo': 'cdo', 'cdc': 'cdc', 'decldelim': ';', 'namespace': '|', 'delim': ',',
            'parentselector': '&'
        };
    function _t(tree) {
        var t = tree[hasInfo? 1 : 0];
        if (t in _m_primitive) return _m_primitive[t];
        else if (t in _m_simple) return _simple(tree);
        else if (t in _m_composite) return _composite(tree);
        return _unique[t](tree);
    }
    function _composite(t, i) {
        var s = '';
        i = i === undefined ? (hasInfo? 2 : 1) : i;
        for (; i < t.length; i++) s += _t(t[i]);
        return s;
    }
    function _simple(t) {
        return t[hasInfo? 2 : 1];
    }
    var _unique = {
        'percentage': function(t) {
            return _t(t[hasInfo? 2 : 1]) + '%';
        },
        'comment': function (t) {
            return '/*' + t[hasInfo? 2 : 1] + '*/';
        },
        'clazz': function(t) {
            return '.' + _t(t[hasInfo? 2 : 1]);
        },
        'atkeyword': function(t) {
            return '@' + _t(t[hasInfo? 2 : 1]);
        },
        'shash': function (t) {
            return '#' + t[hasInfo? 2 : 1];
        },
        'vhash': function(t) {
            return '#' + t[hasInfo? 2 : 1];
        },
        'attrib': function(t) {
            return '[' + _composite(t) + ']';
        },
        'important': function(t) {
            return '!' + _composite(t) + 'important';
        },
        'nthselector': function(t) {
            return ':' + _simple(t[hasInfo? 2 : 1]) + '(' + _composite(t, hasInfo? 3 : 2) + ')';
        },
        'funktion': function(t) {
            return _simple(t[hasInfo? 2 : 1]) + '(' + _composite(t[hasInfo? 3: 2]) + ')';
        },
        'declaration': function(t) {
            return _t(t[hasInfo? 2 : 1]) + ':' + _t(t[hasInfo? 3 : 2]);
        },
        'filter': function(t) {
            return _t(t[hasInfo? 2 : 1]) + ':' + _t(t[hasInfo? 3 : 2]);
        },
        'block': function(t) {
            return '{' + _composite(t) + '}';
        },
        'braces': function(t) {
            return t[hasInfo? 2 : 1] + _composite(t, hasInfo? 4 : 3) + t[hasInfo? 3 : 2];
        },
        'atrules': function(t) {
            return _composite(t);
        },
        'atruler': function(t) {
            return _t(t[hasInfo? 2 : 1]) + _t(t[hasInfo? 3 : 2]) + '{' + _t(t[hasInfo? 4 : 3]) + '}';
        },
        'pseudoe': function(t) {
            return '::' + _t(t[hasInfo? 2 : 1]);
        },
        'pseudoc': function(t) {
            return ':' + _t(t[hasInfo? 2 : 1]);
        },
        'uri': function(t) {
            return 'url(' + _composite(t) + ')';
        },
        'functionExpression': function(t) {
            return 'expression(' + t[hasInfo? 2 : 1] + ')';
        },
        'variable': function(t) {
            return '$' + _t(t[hasInfo? 2 : 1]);
        },
        'variableslist': function(t) {
            return _t(t[hasInfo? 2 : 1]) + '...';
        },
        'placeholder': function(t) {
            return '%' + _t(t[hasInfo? 2 : 1]);
        },
        'interpolation': function(t) {
            return '#{' + _t(t[hasInfo? 2 : 1]) + '}';
        },
        'default': function(t) {
            return '!' + _composite(t) + 'default';
        }
    };
    return _t(tree);
}
