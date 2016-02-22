function astToCSS(options) {
    var tree, hasInfo, syntax;
    if (!options) throw new Error('We need tree to translate');
    tree = typeof options === 'string' ? options : options.ast;
    hasInfo = typeof tree[0] === 'object';
    syntax = options.syntax || 'css';
    var _m_simple = {
            'attrselector': 1, 'combinator': 1, 'ident': 1, 'nth': 1, 'number': 1,
            'operator': 1, 'raw': 1, 's': 1, 'string': 1, 'unary': 1, 'unknown': 1
        },
        _m_composite = {
            'atruleb': 1, 'atrulerq': 1, 'atrulers': 1, 'atrules': 1,'condition': 1,
            'declaration': 1, 'dimension': 1, 'filterv': 1, 'include': 1,
            'loop': 1, 'mixin': 1, 'selector': 1, 'progid': 1, 'property': 1,
            'ruleset': 1, 'simpleselector': 1, 'stylesheet': 1, 'value': 1
        },
        _m_primitive = {
            'cdc': 'cdc', 'cdo': 'cdo',
            'declDelim': syntax === 'sass' ? '\n' : ';',
            'delim': ',',
            'namespace': '|', 'parentselector': '&', 'propertyDelim' : ':'
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
        'arguments': function(t) {
            return '(' + _composite(t) + ')';
        },
        'atkeyword': function(t) {
            return '@' + _t(t[hasInfo? 2 : 1]);
        },
        'atruler': function(t) {
            return _t(t[hasInfo? 2 : 1]) + _t(t[hasInfo? 3 : 2]) + '{' + _t(t[hasInfo? 4 : 3]) + '}';
        },
        'attrib': function(t) {
            return '[' + _composite(t) + ']';
        },
        'block': function(t) {
            return syntax === 'sass' ? _composite(t) : '{' + _composite(t) + '}';
        },
        'braces': function(t) {
            return t[hasInfo? 2 : 1] + _composite(t, hasInfo? 4 : 3) + t[hasInfo? 3 : 2];
        },
        'class': function(t) {
            return '.' + _t(t[hasInfo? 2 : 1]);
        },
        'commentML': function (t) {
            return '/*' + t[hasInfo? 2 : 1] + (syntax === 'sass' ? '' : '*/');
        },
        'commentSL': function (t) {
            return '/' + '/' + t[hasInfo? 2 : 1];
        },
        'default': function(t) {
            return '!' + _composite(t) + 'default';
        },
        'escapedString': function(t) {
            return '~' + t[hasInfo? 2 : 1];
        },
        'filter': function(t) {
            return _t(t[hasInfo? 2 : 1]) + ':' + _t(t[hasInfo? 3 : 2]);
        },
        'functionExpression': function(t) {
            return 'expression(' + t[hasInfo? 2 : 1] + ')';
        },
        'function': function(t) {
            return _simple(t[hasInfo? 2 : 1]) + '(' + _composite(t[hasInfo? 3: 2]) + ')';
        },
        'important': function(t) {
            return '!' + _composite(t) + 'important';
        },
        'interpolatedVariable': function(t) {
            return (syntax === 'less' ? '@{' : '#\{$') + _t(t[hasInfo? 2 : 1]) + '}';
        },
        'nthselector': function(t) {
            return ':' + _simple(t[hasInfo? 2 : 1]) + '(' + _composite(t, hasInfo? 3 : 2) + ')';
        },
        'percentage': function(t) {
            return _t(t[hasInfo? 2 : 1]) + '%';
        },
        'placeholder': function(t) {
            return '%' + _t(t[hasInfo? 2 : 1]);
        },
        'pseudoc': function(t) {
            return ':' + _t(t[hasInfo? 2 : 1]);
        },
        'pseudoe': function(t) {
            return '::' + _t(t[hasInfo? 2 : 1]);
        },
        'shash': function (t) {
            return '#' + t[hasInfo? 2 : 1];
        },
        'uri': function(t) {
            return 'url(' + _composite(t) + ')';
        },
        'variable': function(t) {
            return (syntax === 'less' ? '@' : '$') + _t(t[hasInfo? 2 : 1]);
        },
        'variableslist': function(t) {
            return _t(t[hasInfo? 2 : 1]) + '...';
        },
        'vhash': function(t) {
            return '#' + t[hasInfo? 2 : 1];
        }
    };
    return _t(tree);
}
exports.astToCSS = astToCSS;
