var cssToAST = (function() {
    var syntaxes = {},
        s,
        needInfo,
        tokens,
        tokensLength,
        tn = 0,
        ln = 1,
        pos = 0;
    function pushToken(type, value) {
        tokens.push({ tn: tn++, ln: ln, type: type, value: value });
    }
    function throwError(i) {
        var ln = i ? tokens[i].ln : tokens[pos].ln;
        throw new Error('Please check the validity of the CSS block starting from the line #' + ln);
    }
    function getInfo(i) {
        return { ln: tokens[i].ln, tn: tokens[i].tn };
    }
    function checkExcluding(exclude, i) {
        var start = i;
        while(i < tokensLength) {
            if (exclude[tokens[i++].type]) break;
        }
        return i - start - 2;
    }
    function joinValues(start, finish) {
        var s = '';
        for (var i = start; i < finish + 1; i++) {
            s += tokens[i].value;
        }
        return s;
    }
    function joinValues2(start, num) {
        if (start + num - 1 >= tokensLength) return;
        var s = '';
        for (var i = 0; i < num; i++) {
            s += tokens[start + i].value;
        }
        return s;
    }
var TokenType = {
    StringSQ: 'StringSQ',
    StringDQ: 'StringDQ',
    CommentML: 'CommentML',
    CommentSL: 'CommentSL',
    Newline: 'Newline',
    Space: 'Space',
    Tab: 'Tab',
    ExclamationMark: 'ExclamationMark',
    QuotationMark: 'QuotationMark',
    NumberSign: 'NumberSign',
    DollarSign: 'DollarSign',
    PercentSign: 'PercentSign',
    Ampersand: 'Ampersand',
    Apostrophe: 'Apostrophe',
    LeftParenthesis: 'LeftParenthesis',
    RightParenthesis: 'RightParenthesis',
    Asterisk: 'Asterisk',
    PlusSign: 'PlusSign',
    Comma: 'Comma',
    HyphenMinus: 'HyphenMinus',
    FullStop: 'FullStop',
    Solidus: 'Solidus',
    Colon: 'Colon',
    Semicolon: 'Semicolon',
    LessThanSign: 'LessThanSign',
    EqualsSign: 'EqualsSign',
    GreaterThanSign: 'GreaterThanSign',
    QuestionMark: 'QuestionMark',
    CommercialAt: 'CommercialAt',
    LeftSquareBracket: 'LeftSquareBracket',
    ReverseSolidus: 'ReverseSolidus',
    RightSquareBracket: 'RightSquareBracket',
    CircumflexAccent: 'CircumflexAccent',
    LowLine: 'LowLine',
    LeftCurlyBracket: 'LeftCurlyBracket',
    VerticalLine: 'VerticalLine',
    RightCurlyBracket: 'RightCurlyBracket',
    Tilde: 'Tilde',
    Identifier: 'Identifier',
    DecimalNumber: 'DecimalNumber'
};
var NodeType = {
    ArgumentsType: 'arguments',
    AtkeywordType: 'atkeyword',
    AtrulebType: 'atruleb',
    AtrulerType: 'atruler',
    AtrulerqType: 'atrulerq',
    AtrulersType: 'atrulers',
    AtrulesType: 'atrules',
    AttribType: 'attrib',
    AttrselectorType: 'attrselector',
    BlockType: 'block',
    BracesType: 'braces',
    CdcType: 'cdc',
    CdoType: 'cdo',
    ClassType: 'class',
    CombinatorType: 'combinator',
    CommentMLType: 'commentML',
    CommentSLType: 'commentSL',
    ConditionType: 'condition',
    DeclarationType: 'declaration',
    DeclDelimType: 'declDelim',
    DefaultType: 'default',
    DelimType: 'delim',
    DimensionType: 'dimension',
    EscapedStringType: 'escapedString',
    FilterType: 'filter',
    FiltervType: 'filterv',
    FunctionType: 'function',
    FunctionBodyType: 'functionBody',
    FunctionExpressionType: 'functionExpression',
    IdentType: 'ident',
    ImportantType: 'important',
    IncludeType :'include',
    InterpolatedVariableType: 'interpolatedVariable',
    LoopType: 'loop',
    MixinType: 'mixin',
    NamespaceType: 'namespace',
    NthType: 'nth',
    NthselectorType: 'nthselector',
    NumberType: 'number',
    OperatorType: 'operator',
    ParentSelectorType: 'parentselector',
    PercentageType: 'percentage',
    PlaceholderType: 'placeholder',
    ProgidType: 'progid',
    PropertyType: 'property',
    PropertyDelimType: 'propertyDelim',
    PseudocType: 'pseudoc',
    PseudoeType: 'pseudoe',
    RawType: 'raw',
    RulesetType: 'ruleset',
    SType: 's',
    SelectorType: 'selector',
    ShashType: 'shash',
    SimpleselectorType: 'simpleselector',
    StringType: 'string',
    StylesheetType: 'stylesheet',
    UnaryType: 'unary',
    UnknownType: 'unknown',
    UriType: 'uri',
    ValueType: 'value',
    VariableType: 'variable',
    VariablesListType: 'variableslist',
    VhashType: 'vhash'
};
var getTokens = (function() {
    var Punctuation,
        urlMode = false,
        blockMode = 0;
    Punctuation = {
        ' ': TokenType.Space,
        '\n': TokenType.Newline,
        '\r': TokenType.Newline,
        '\t': TokenType.Tab,
        '!': TokenType.ExclamationMark,
        '"': TokenType.QuotationMark,
        '#': TokenType.NumberSign,
        '$': TokenType.DollarSign,
        '%': TokenType.PercentSign,
        '&': TokenType.Ampersand,
        '\'': TokenType.Apostrophe,
        '(': TokenType.LeftParenthesis,
        ')': TokenType.RightParenthesis,
        '*': TokenType.Asterisk,
        '+': TokenType.PlusSign,
        ',': TokenType.Comma,
        '-': TokenType.HyphenMinus,
        '.': TokenType.FullStop,
        '/': TokenType.Solidus,
        ':': TokenType.Colon,
        ';': TokenType.Semicolon,
        '<': TokenType.LessThanSign,
        '=': TokenType.EqualsSign,
        '>': TokenType.GreaterThanSign,
        '?': TokenType.QuestionMark,
        '@': TokenType.CommercialAt,
        '[': TokenType.LeftSquareBracket,
        ']': TokenType.RightSquareBracket,
        '^': TokenType.CircumflexAccent,
        '_': TokenType.LowLine,
        '{': TokenType.LeftCurlyBracket,
        '|': TokenType.VerticalLine,
        '}': TokenType.RightCurlyBracket,
        '~': TokenType.Tilde
    };
    function isDecimalDigit(c) {
        return '0123456789'.indexOf(c) >= 0;
    }
    function parseSpaces(css) {
        var start = pos;
        for (; pos < css.length; pos++) {
            if (css.charAt(pos) !== ' ') break;
        }
        pushToken(TokenType.Space, css.substring(start, pos));
        pos--;
    }
    function parseString(css, q) {
        var start = pos;
        for (pos = pos + 1; pos < css.length; pos++) {
            if (css.charAt(pos) === '\\') pos++;
            else if (css.charAt(pos) === q) break;
        }
        pushToken(q === '"' ? TokenType.StringDQ : TokenType.StringSQ, css.substring(start, pos + 1));
    }
    function parseDecimalNumber(css) {
        var start = pos;
        for (; pos < css.length; pos++) {
            if (!isDecimalDigit(css.charAt(pos))) break;
        }
        pushToken(TokenType.DecimalNumber, css.substring(start, pos));
        pos--;
    }
    function parseIdentifier(css) {
        var start = pos;
        while (css.charAt(pos) === '/') pos++;
        for (; pos < css.length; pos++) {
            if (css.charAt(pos) === '\\') pos++;
            else if (css.charAt(pos) in Punctuation) break;
        }
        var ident = css.substring(start, pos);
        urlMode = urlMode || ident === 'url';
        pushToken(TokenType.Identifier, ident);
        pos--;
    }
    function _getTokens(css, syntax) {
        var c,
            cn;
        tokens = [];
        pos = 0;
        tn = 0;
        ln = 1;
        for (pos = 0; pos < css.length; pos++) {
            c = css.charAt(pos);
            cn = css.charAt(pos + 1);
            if (c === '/' && cn === '*') {
                s.parseMLComment(css);
            }
            else if (!urlMode && c === '/' && cn === '/') {
                if (syntax === 'css' && blockMode > 0) parseIdentifier(css);
                else s.parseSLComment && s.parseSLComment(css);
            }
            else if (c === '"' || c === "'") {
                parseString(css, c);
            }
            else if (c === ' ') {
                parseSpaces(css)
            }
            else if (c in Punctuation) {
                pushToken(Punctuation[c], c);
                if (c === '\n' || c === '\r') ln++;
                if (c === ')') urlMode = false;
                if (c === '{') blockMode++;
                if (c === '}') blockMode--;
            }
            else if (isDecimalDigit(c)) {
                parseDecimalNumber(css);
            }
            else {
                parseIdentifier(css);
            }
        }
    }
    return function(s, syntax) {
        return _getTokens(s, syntax);
    };
}());
var rules = {
    'arguments': function() { if (s.checkArguments(pos)) return s.getArguments() },
    'atkeyword': function() { if (s.checkAtkeyword(pos)) return s.getAtkeyword() },
    'atruleb': function() { if (s.checkAtruleb(pos)) return s.getAtruleb() },
    'atruler': function() { if (s.checkAtruler(pos)) return s.getAtruler() },
    'atrulerq': function() { if (s.checkAtrulerq(pos)) return s.getAtrulerq() },
    'atrulers': function() { if (s.checkAtrulers(pos)) return s.getAtrulers() },
    'atrules': function() { if (s.checkAtrules(pos)) return s.getAtrules() },
    'attrib': function() { if (s.checkAttrib(pos)) return s.getAttrib() },
    'attrselector': function() { if (s.checkAttrselector(pos)) return s.getAttrselector() },
    'block': function() { if (s.checkBlock(pos)) return s.getBlock() },
    'braces': function() { if (s.checkBraces(pos)) return s.getBraces() },
    'class': function() { if (s.checkClass(pos)) return s.getClass() },
    'combinator': function() { if (s.checkCombinator(pos)) return s.getCombinator() },
    'commentML': function() { if (s.checkCommentML(pos)) return s.getCommentML() },
    'commentSL': function() { if (s.checkCommentSL(pos)) return s.getCommentSL() },
    'condition': function() { if (s.checkCondition(pos)) return s.getCondition() },
    'declaration': function() { if (s.checkDeclaration(pos)) return s.getDeclaration() },
    'declDelim': function() { if (s.checkDeclDelim(pos)) return s.getDeclDelim() },
    'default': function () { if (s.checkDefault(pos)) return s.getDefault() },
    'delim': function() { if (s.checkDelim(pos)) return s.getDelim() },
    'dimension': function() { if (s.checkDimension(pos)) return s.getDimension() },
    'escapedString': function() { if (s.checkEscapedString(pos)) return s.getEscapedString() },
    'filter': function() { if (s.checkFilter(pos)) return s.getFilter() },
    'filterv': function() { if (s.checkFilterv(pos)) return s.getFilterv() },
    'functionExpression': function() { if (s.checkFunctionExpression(pos)) return s.getFunctionExpression() },
    'function': function() { if (s.checkFunction(pos)) return s.getFunction() },
    'ident': function() { if (s.checkIdent(pos)) return s.getIdent() },
    'important': function() { if (s.checkImportant(pos)) return s.getImportant() },
    'include': function () { if (s.checkInclude(pos)) return s.getInclude() },
    'interpolatedVariable': function () { if (s.checkInterpolatedVariable(pos)) return s.getInterpolatedVariable() },
    'loop': function() { if (s.checkLoop(pos)) return s.getLoop() },
    'mixin': function () { if (s.checkMixin(pos)) return s.getMixin() },
    'namespace': function() { if (s.checkNamespace(pos)) return s.getNamespace() },
    'nth': function() { if (s.checkNth(pos)) return s.getNth() },
    'nthselector': function() { if (s.checkNthselector(pos)) return s.getNthselector() },
    'number': function() { if (s.checkNumber(pos)) return s.getNumber() },
    'operator': function() { if (s.checkOperator(pos)) return s.getOperator() },
    'parentselector': function () { if (s.checkParentSelector(pos)) return s.getParentSelector() },
    'percentage': function() { if (s.checkPercentage(pos)) return s.getPercentage() },
    'placeholder': function() { if (s.checkPlaceholder(pos)) return s.getPlaceholder() },
    'progid': function() { if (s.checkProgid(pos)) return s.getProgid() },
    'property': function() { if (s.checkProperty(pos)) return s.getProperty() },
    'propertyDelim': function() { if (s.checkPropertyDelim(pos)) return s.getPropertyDelim() },
    'pseudoc': function() { if (s.checkPseudoc(pos)) return s.getPseudoc() },
    'pseudoe': function() { if (s.checkPseudoe(pos)) return s.getPseudoe() },
    'ruleset': function() { if (s.checkRuleset(pos)) return s.getRuleset() },
    's': function() { if (s.checkS(pos)) return s.getS() },
    'selector': function() { if (s.checkSelector(pos)) return s.getSelector() },
    'shash': function() { if (s.checkShash(pos)) return s.getShash() },
    'simpleselector': function() { if (s.checkSimpleSelector(pos)) return s.getSimpleSelector() },
    'string': function() { if (s.checkString(pos)) return s.getString() },
    'stylesheet': function() { if (s.checkStylesheet(pos)) return s.getStylesheet() },
    'unary': function() { if (s.checkUnary(pos)) return s.getUnary() },
    'unknown': function() { if (s.checkUnknown(pos)) return s.getUnknown() },
    'uri': function() { if (s.checkUri(pos)) return s.getUri() },
    'value': function() { if (s.checkValue(pos)) return s.getValue() },
    'variable': function () { if (s.checkVariable(pos)) return s.getVariable() },
    'variableslist': function () { if (s.checkVariablesList(pos)) return s.getVariablesList() },
    'vhash': function() { if (s.checkVhash(pos)) return s.getVhash() }
};
syntaxes.css = {
    checkAny: function(i) {
        return this.checkBraces(i) ||
            this.checkString(i) ||
            this.checkPercentage(i) ||
            this.checkDimension(i) ||
            this.checkNumber(i) ||
            this.checkUri(i) ||
            this.checkFunctionExpression(i) ||
            this.checkFunction(i) ||
            this.checkIdent(i) ||
            this.checkClass(i) ||
            this.checkUnary(i);
    },
    getAny: function() {
        if (this.checkBraces(pos)) return this.getBraces();
        else if (this.checkString(pos)) return this.getString();
        else if (this.checkPercentage(pos)) return this.getPercentage();
        else if (this.checkDimension(pos)) return this.getDimension();
        else if (this.checkNumber(pos)) return this.getNumber();
        else if (this.checkUri(pos)) return this.getUri();
        else if (this.checkFunctionExpression(pos)) return this.getFunctionExpression();
        else if (this.checkFunction(pos)) return this.getFunction();
        else if (this.checkIdent(pos)) return this.getIdent();
        else if (this.checkClass(pos)) return this.getClass();
        else if (this.checkUnary(pos)) return this.getUnary();
    },
    checkAtkeyword: function(i) {
        var l;
        if (i >= tokensLength ||
            tokens[i++].type !== TokenType.CommercialAt) return 0;
        return (l = this.checkIdent(i)) ? l + 1 : 0;
    },
    getAtkeyword: function() {
        var startPos = pos,
            x;
        pos++;
        x = [NodeType.AtkeywordType, this.getIdent()];
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkAttrib: function(i) {
        if (i >= tokensLength ||
            tokens[i].type !== TokenType.LeftSquareBracket ||
            !tokens[i].right) return 0;
        return tokens[i].right - i + 1;
    },
    getAttrib: function() {
        if (this.checkAttrib1(pos)) return this.getAttrib1();
        if (this.checkAttrib2(pos)) return this.getAttrib2();
    },
    checkAttrib1: function(i) {
        var start = i,
            l;
        if (i++ >= tokensLength) return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkIdent(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkAttrselector(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkIdent(i) || this.checkString(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        return tokens[i].type === TokenType.RightSquareBracket ? i - start : 0;
    },
    getAttrib1: function() {
        var startPos = pos,
            x;
        pos++;
        x = [NodeType.AttribType]
            .concat(this.getSC())
            .concat([this.getIdent()])
            .concat(this.getSC())
            .concat([this.getAttrselector()])
            .concat(this.getSC())
            .concat([this.checkString(pos)? this.getString() : this.getIdent()])
            .concat(this.getSC());
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkAttrib2: function(i) {
        var start = i,
            l;
        if (i++ >= tokensLength) return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkIdent(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        return tokens[i].type === TokenType.RightSquareBracket ? i - start : 0;
    },
    getAttrib2: function() {
        var startPos = pos,
            x;
        pos++;
        x = [NodeType.AttribType]
            .concat(this.getSC())
            .concat([this.getIdent()])
            .concat(this.getSC());
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkAttrselector: function(i) {
        if (i >= tokensLength) return 0;
        if (tokens[i].type === TokenType.EqualsSign) return 1;
        if (tokens[i].type === TokenType.VerticalLine &&
            (!tokens[i + 1] || tokens[i + 1].type !== TokenType.EqualsSign))
            return 1;
        if (!tokens[i + 1] || tokens[i + 1].type !== TokenType.EqualsSign) return 0;
        switch(tokens[i].type) {
            case TokenType.Tilde:
            case TokenType.CircumflexAccent:
            case TokenType.DollarSign:
            case TokenType.Asterisk:
            case TokenType.VerticalLine:
                return 2;
        }
        return 0;
    },
    getAttrselector: function() {
        var startPos = pos,
            s = tokens[pos++].value,
            x;
        if (tokens[pos] && tokens[pos].type === TokenType.EqualsSign) s += tokens[pos++].value;
        x = [NodeType.AttrselectorType, s];
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkAtrule: function(i) {
        var l;
        if (i >= tokensLength) return 0;
        if (tokens[i].atrule_l !== undefined) return tokens[i].atrule_l;
        if (l = this.checkAtruler(i)) tokens[i].atrule_type = 1;
        else if (l = this.checkAtruleb(i)) tokens[i].atrule_type = 2;
        else if (l = this.checkAtrules(i)) tokens[i].atrule_type = 3;
        else return 0;
        tokens[i].atrule_l = l;
        return l;
    },
    getAtrule: function() {
        switch (tokens[pos].atrule_type) {
            case 1: return this.getAtruler();
            case 2: return this.getAtruleb();
            case 3: return this.getAtrules();
        }
    },
    checkAtruleb: function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkAtkeyword(i)) i += l;
        else return 0;
        if (l = this.checkTsets(i)) i += l;
        if (l = this.checkBlock(i)) i += l;
        else return 0;
        return i - start;
    },
    getAtruleb: function() {
        var startPos = pos,
            x;
        x = [NodeType.AtrulebType, this.getAtkeyword()]
            .concat(this.getTsets())
            .concat([this.getBlock()]);
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkAtruler: function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkAtkeyword(i)) i += l;
        else return 0;
        if (l = this.checkAtrulerq(i)) i += l;
        if (i < tokensLength && tokens[i].type === TokenType.LeftCurlyBracket) i++;
        else return 0;
        if (l = this.checkAtrulers(i)) i += l;
        if (i < tokensLength && tokens[i].type === TokenType.RightCurlyBracket) i++;
        else return 0;
        return i - start;
    },
    getAtruler: function() {
        var startPos = pos,
            x;
        x = [NodeType.AtrulerType, this.getAtkeyword(), this.getAtrulerq()];
        pos++;
        x.push(this.getAtrulers());
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkAtrulerq: function(i) {
        return this.checkTsets(i);
    },
    getAtrulerq: function() {
        var startPos = pos,
            x;
        x = [NodeType.AtrulerqType].concat(this.getTsets());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkAtrulers: function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkSC(i)) i += l;
        while (l = this.checkRuleset(i) || this.checkAtrule(i) || this.checkSC(i)) {
            i += l;
        }
        tokens[i].atrulers_end = 1;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    },
    getAtrulers: function() {
        var startPos = pos,
            x;
        x = [NodeType.AtrulersType].concat(this.getSC());
        while (!tokens[pos].atrulers_end) {
            if (this.checkSC(pos)) x = x.concat(this.getSC());
            else if (this.checkRuleset(pos)) x.push(this.getRuleset());
            else x.push(this.getAtrule());
        }
        x = x.concat(this.getSC());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkAtrules: function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkAtkeyword(i)) i += l;
        else return 0;
        if (l = this.checkTsets(i)) i += l;
        return i - start;
    },
    getAtrules: function() {
        var startPos = pos,
            x;
        x = [NodeType.AtrulesType, this.getAtkeyword()].concat(this.getTsets());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkBlock: function(i) {
        return i < tokensLength && tokens[i].type === TokenType.LeftCurlyBracket ?
            tokens[i].right - i + 1 : 0;
    },
    getBlock: function() {
        var startPos = pos,
            end = tokens[pos].right,
            x = [NodeType.BlockType];
        pos++;
        while (pos < end) {
            if (this.checkBlockdecl(pos)) x = x.concat(this.getBlockdecl());
            else throwError();
        }
        pos = end + 1;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkBlockdecl: function(i) {
        var l;
        if (i >= tokensLength) return 0;
        if (l = this.checkBlockdecl1(i)) tokens[i].bd_type = 1;
        else if (l = this.checkBlockdecl2(i)) tokens[i].bd_type = 2;
        else if (l = this.checkBlockdecl3(i)) tokens[i].bd_type = 3;
        else if (l = this.checkBlockdecl4(i)) tokens[i].bd_type = 4;
        else return 0;
        return l;
    },
    getBlockdecl: function() {
        switch (tokens[pos].bd_type) {
            case 1: return this.getBlockdecl1();
            case 2: return this.getBlockdecl2();
            case 3: return this.getBlockdecl3();
            case 4: return this.getBlockdecl4();
        }
    },
    checkBlockdecl1: function(i) {
        var start = i,
            l;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkFilter(i)) tokens[i].bd_kind = 1;
        else if (l = this.checkDeclaration(i)) tokens[i].bd_kind = 2;
        else if (l = this.checkAtrule(i)) tokens[i].bd_kind = 3;
        else return 0;
        i += l;
        if (i < tokensLength && (l = this.checkDeclDelim(i))) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        else return 0;
        return i - start;
    },
    getBlockdecl1: function() {
        var sc = this.getSC(),
            x;
        switch (tokens[pos].bd_kind) {
            case 1:
                x = this.getFilter();
                break;
            case 2:
                x = this.getDeclaration();
                break;
            case 3:
                x = this.getAtrule();
                break;
        }
        return sc
            .concat([x])
            .concat([this.getDeclDelim()])
            .concat(this.getSC());
    },
    checkBlockdecl2: function(i) {
        var start = i,
            l;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkFilter(i)) tokens[i].bd_kind = 1;
        else if (l = this.checkDeclaration(i)) tokens[i].bd_kind = 2;
        else if (l = this.checkAtrule(i)) tokens[i].bd_kind = 3;
        else return 0;
        i += l;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    },
    getBlockdecl2: function() {
        var sc = this.getSC(),
            x;
        switch (tokens[pos].bd_kind) {
            case 1:
                x = this.getFilter();
                break;
            case 2:
                x = this.getDeclaration();
                break;
            case 3:
                x = this.getAtrule();
                break;
        }
        return sc
            .concat([x])
            .concat(this.getSC());
    },
    checkBlockdecl3: function(i) {
        var start = i,
            l;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkDeclDelim(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    },
    getBlockdecl3: function() {
        return this.getSC()
            .concat([this.getDeclDelim()])
            .concat(this.getSC());
    },
    checkBlockdecl4: function(i) {
        return this.checkSC(i);
    },
    getBlockdecl4: function() {
        return this.getSC();
    },
    checkBraces: function(i) {
        if (i >= tokensLength ||
            (tokens[i].type !== TokenType.LeftParenthesis &&
            tokens[i].type !== TokenType.LeftSquareBracket)) return 0;
        return tokens[i].right - i + 1;
    },
    getBraces: function() {
        var startPos = pos,
            left = pos,
            right = tokens[pos].right,
            x;
        pos++;
        var tsets = this.getTsets();
        pos++;
        x = [NodeType.BracesType, tokens[left].value, tokens[right].value]
            .concat(tsets);
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkClass: function(i) {
        var l;
        if (i >= tokensLength) return 0;
        if (tokens[i].class_l) return tokens[i].class_l;
        if (tokens[i++].type === TokenType.FullStop && (l = this.checkIdent(i))) {
            tokens[i].class_l = l + 1;
            return l + 1;
        }
        return 0;
    },
    getClass: function() {
        var startPos = pos,
            x = [NodeType.ClassType];
        pos++;
        x.push(this.getIdent());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkCombinator: function(i) {
        if (i >= tokensLength) return 0;
        switch (tokens[i].type) {
            case TokenType.PlusSign:
            case TokenType.GreaterThanSign:
            case TokenType.Tilde:
                return 1;
        }
        return 0;
    },
    getCombinator: function() {
        var startPos = pos,
            x;
        x = [NodeType.CombinatorType, tokens[pos++].value];
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkCommentML: function(i) {
        return i < tokensLength && tokens[i].type === TokenType.CommentML ? 1 : 0;
    },
    getCommentML: function() {
        var startPos = pos,
            s = tokens[pos].value.substring(2),
            l = s.length,
            x;
        if (s.charAt(l - 2) === '*' && s.charAt(l - 1) === '/') s = s.substring(0, l - 2);
        pos++;
        x = [NodeType.CommentMLType, s];
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkDeclaration: function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkProperty(i)) i += l;
        else return 0;
        if (l = this.checkPropertyDelim(i)) i++;
        else return 0;
        if (l = this.checkValue(i)) i += l;
        else return 0;
        return i - start;
    },
    getDeclaration: function() {
        var startPos = pos,
            x = [NodeType.DeclarationType];
        x.push(this.getProperty());
        x.push(this.getPropertyDelim());
        x.push(this.getValue());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkDeclDelim: function(i) {
        return i < tokensLength && tokens[i].type === TokenType.Semicolon ? 1 : 0;
    },
    getDeclDelim: function() {
        var startPos = pos,
            x = [NodeType.DeclDelimType];
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkDelim: function(i) {
        return i < tokensLength && tokens[i].type === TokenType.Comma ? 1 : 0;
    },
    getDelim: function() {
        var startPos = pos,
            x = [NodeType.DelimType];
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkDimension: function(i) {
        var ln = this.checkNumber(i),
            li;
        if (i >= tokensLength ||
            !ln ||
            i + ln >= tokensLength) return 0;
        return (li = this.checkNmName2(i + ln)) ? ln + li : 0;
    },
    getDimension: function() {
        var startPos = pos,
            x = [NodeType.DimensionType, this.getNumber()],
            ident = [NodeType.IdentType, this.getNmName2()];
        if (needInfo) ident.unshift(getInfo(startPos));
        x.push(ident);
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkFilter: function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkFilterp(i)) i += l;
        else return 0;
        if (tokens[i].type === TokenType.Colon) i++;
        else return 0;
        if (l = this.checkFilterv(i)) i += l;
        else return 0;
        return i - start;
    },
    getFilter: function() {
        var startPos = pos,
            x = [NodeType.FilterType, this.getFilterp()];
        pos++;
        x.push(this.getFilterv());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkFilterp: function(i) {
        var start = i,
            l,
            x;
        if (i >= tokensLength) return 0;
        if (tokens[i].value === 'filter') l = 1;
        else {
            x = joinValues2(i, 2);
            if (x === '-filter' || x === '_filter' || x === '*filter') l = 2;
            else {
                x = joinValues2(i, 4);
                if (x === '-ms-filter') l = 4;
                else return 0;
            }
        }
        tokens[start].filterp_l = l;
        i += l;
        if (this.checkSC(i)) i += l;
        return i - start;
    },
    getFilterp: function() {
        var startPos = pos,
            ident = [NodeType.IdentType, joinValues2(pos, tokens[pos].filterp_l)],
            x;
        if (needInfo) ident.unshift(getInfo(startPos));
        pos += tokens[pos].filterp_l;
        x = [NodeType.PropertyType, ident].concat(this.getSC());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkFilterv: function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkProgid(i)) i += l;
        else return 0;
        while (l = this.checkProgid(i)) {
            i += l;
        }
        tokens[start].last_progid = i;
        if (i < tokensLength && (l = this.checkSC(i))) i += l;
        if (i < tokensLength && (l = this.checkImportant(i))) i += l;
        return i - start;
    },
    getFilterv: function() {
        var startPos = pos,
            x = [NodeType.FiltervType],
            last_progid = tokens[pos].last_progid;
        x = x.concat(this.getSC());
        while (pos < last_progid) {
            x.push(this.getProgid());
        }
        if (this.checkSC(pos)) x = x.concat(this.getSC());
        if (pos < tokensLength && this.checkImportant(pos)) x.push(this.getImportant());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkFunctionExpression: function(i) {
        var start = i;
        if (i >= tokensLength || tokens[i++].value !== 'expression' ||
            i >= tokensLength || tokens[i].type !== TokenType.LeftParenthesis) return 0;
        return tokens[i].right - start + 1;
    },
    getFunctionExpression: function() {
        var startPos = pos,
            x, e;
        pos++;
        e = joinValues(pos + 1, tokens[pos].right - 1);
        pos = tokens[pos].right + 1;
        x = [NodeType.FunctionExpressionType, e];
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkFunction: function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkIdent(i)) i +=l;
        else return 0;
        return i < tokensLength && tokens[i].type === TokenType.LeftParenthesis ?
            tokens[i].right - start + 1 : 0;
    },
    getFunction: function() {
        var startPos = pos,
            ident = this.getIdent(),
            x = [NodeType.FunctionType, ident],
            body;
        pos++;
        body = ident[needInfo ? 2 : 1] === 'not' ? this.getNotFunctionBody() : this.getFunctionBody();
        x.push(body);
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    getFunctionBody: function() {
        var startPos = pos,
            x = [NodeType.FunctionBodyType],
            body;
        while (tokens[pos].type !== TokenType.RightParenthesis) {
            if (this.checkDeclaration(pos)) x.push(this.getDeclaration());
            else if (this.checkTset(pos)) {
                body = this.getTset();
                if ((needInfo && typeof body[1] === 'string') || typeof body[0] === 'string') x.push(body);
                else x = x.concat(body);
            } else if (this.checkClass(pos)) x.push(this.getClass());
            else throwError();
        }
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    getNotFunctionBody: function() {
        var startPos = pos,
            x = [NodeType.FunctionBodyType];
        while (tokens[pos].type !== TokenType.RightParenthesis) {
            if (this.checkSimpleSelector(pos)) x.push(this.getSimpleSelector());
            else throwError();
        }
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkIdent: function(i) {
        var start = i,
            wasIdent,
            l;
        if (i >= tokensLength) return 0;
        if (tokens[i].type === TokenType.LowLine) return this.checkIdentLowLine(i);
        if (tokens[i].type === TokenType.HyphenMinus ||
            tokens[i].type === TokenType.Identifier ||
            tokens[i].type === TokenType.DollarSign ||
            tokens[i].type === TokenType.Asterisk) i++;
        else return 0;
        wasIdent = tokens[i - 1].type === TokenType.Identifier;
        for (; i < tokensLength; i++) {
            if (i >= tokensLength) break;
            if (tokens[i].type !== TokenType.HyphenMinus &&
                tokens[i].type !== TokenType.LowLine) {
                if (tokens[i].type !== TokenType.Identifier &&
                    (tokens[i].type !== TokenType.DecimalNumber || !wasIdent)) break;
                else wasIdent = true;
            }
        }
        if (!wasIdent && tokens[start].type !== TokenType.Asterisk) return 0;
        tokens[start].ident_last = i - 1;
        return i - start;
    },
    checkIdentLowLine: function(i) {
        var start = i;
        if (i++ >= tokensLength) return 0;
        for (; i < tokensLength; i++) {
            if (tokens[i].type !== TokenType.HyphenMinus &&
                tokens[i].type !== TokenType.DecimalNumber &&
                tokens[i].type !== TokenType.LowLine &&
                tokens[i].type !== TokenType.Identifier) break;
        }
        tokens[start].ident_last = i - 1;
        return i - start;
    },
    getIdent: function() {
        var startPos = pos,
            x = [NodeType.IdentType, joinValues(pos, tokens[pos].ident_last)];
        pos = tokens[pos].ident_last + 1;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkImportant: function(i) {
        var start = i,
            l;
        if (i >= tokensLength ||
            tokens[i++].type !== TokenType.ExclamationMark) return 0;
        if (l = this.checkSC(i)) i += l;
        return tokens[i].value === 'important' ? i - start + 1 : 0;
    },
    getImportant: function() {
        var startPos = pos,
            x = [NodeType.ImportantType];
        pos++;
        x = x.concat(this.getSC());
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkNamespace: function(i) {
        return i < tokensLength && tokens[i].type === TokenType.VerticalLine ? 1 : 0;
    },
    getNamespace: function() {
        var startPos = pos,
            x = [NodeType.NamespaceType];
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkNmName: function(i) {
        var start = i;
        if (i >= tokensLength) return 0;
        if (tokens[i].type === TokenType.HyphenMinus ||
            tokens[i].type === TokenType.LowLine ||
            tokens[i].type === TokenType.Identifier ||
            tokens[i].type === TokenType.DecimalNumber) i++;
        else return 0;
        for (; i < tokensLength; i++) {
            if (tokens[i].type !== TokenType.HyphenMinus &&
                tokens[i].type !== TokenType.LowLine &&
                tokens[i].type !== TokenType.Identifier &&
                tokens[i].type !== TokenType.DecimalNumber) break;
        }
        tokens[start].nm_name_last = i - 1;
        return i - start;
    },
    getNmName: function() {
        var s = joinValues(pos, tokens[pos].nm_name_last);
        pos = tokens[pos].nm_name_last + 1;
        return s;
    },
    checkNmName2: function(i) {
        if (tokens[i].type === TokenType.Identifier) return 1;
        else if (tokens[i].type !== TokenType.DecimalNumber) return 0;
        i++;
        return i < tokensLength && tokens[i].type === TokenType.Identifier ? 2 : 1;
    },
    getNmName2: function() {
        var s = tokens[pos].value;
        if (tokens[pos++].type === TokenType.DecimalNumber &&
            pos < tokensLength &&
            tokens[pos].type === TokenType.Identifier) s += tokens[pos++].value;
        return s;
    },
    checkNth: function(i) {
        if (i >= tokensLength) return 0;
        return this.checkNth1(i) || this.checkNth2(i);
    },
    checkNth1: function(i) {
        var start = i;
        for (; i < tokensLength; i++) {
            if (tokens[i].type !== TokenType.DecimalNumber &&
                tokens[i].value !== 'n') break;
        }
        if (i !== start) tokens[start].nth_last = i - 1;
        return i - start;
    },
    getNth: function() {
        var startPos = pos,
            x = [NodeType.NthType];
        if (tokens[pos].nth_last) {
            x.push(joinValues(pos, tokens[pos].nth_last));
            pos = tokens[pos].nth_last + 1;
        } else {
            x.push(tokens[pos++].value);
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkNth2: function(i) {
        return tokens[i].value === 'even' || tokens[i].value === 'odd' ? 1 : 0;
    },
    checkNthf: function(i) {
        var start = i,
            l = 0;
        if (tokens[i++].type !== TokenType.Colon) return 0;
        l++;
        if (tokens[i++].value !== 'nth' || tokens[i++].value !== '-') return 0;
        l += 2;
        if ('child' === tokens[i].value) {
            l += 1;
        } else if ('last-child' === tokens[i].value +
            tokens[i + 1].value +
            tokens[i + 2].value) {
            l += 3;
        } else if ('of-type' === tokens[i].value +
            tokens[i + 1].value +
            tokens[i + 2].value) {
            l += 3;
        } else if ('last-of-type' === tokens[i].value +
            tokens[i + 1].value +
            tokens[i + 2].value +
            tokens[i + 3].value +
            tokens[i + 4].value) {
            l += 5;
        } else return 0;
        tokens[start + 1].nthf_last = start + l - 1;
        return l;
    },
    getNthf: function() {
        pos++;
        var s = joinValues(pos, tokens[pos].nthf_last);
        pos = tokens[pos].nthf_last + 1;
        return s;
    },
    checkNthselector: function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkNthf(i)) i += l;
        else return 0;
        if (tokens[i].type !== TokenType.LeftParenthesis || !tokens[i].right) return 0;
        l++;
        var rp = tokens[i++].right;
        while (i < rp) {
            if (l = this.checkSC(i) ||
                this.checkUnary(i) ||
                this.checkNth(i)) i += l;
            else return 0;
        }
        return rp - start + 1;
    },
    getNthselector: function() {
        var startPos = pos,
            nthf = [NodeType.IdentType, this.getNthf()],
            x = [NodeType.NthselectorType];
        if (needInfo) nthf.unshift(getInfo(startPos));
        x.push(nthf);
        pos++;
        while (tokens[pos].type !== TokenType.RightParenthesis) {
            if (this.checkSC(pos)) x = x.concat(this.getSC());
            else if (this.checkUnary(pos)) x.push(this.getUnary());
            else if (this.checkNth(pos)) x.push(this.getNth());
        }
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkNumber: function(i) {
        if (i >= tokensLength) return 0;
        if (tokens[i].number_l) return tokens[i].number_l;
        if (i < tokensLength && tokens[i].type === TokenType.DecimalNumber &&
            (!tokens[i + 1] ||
            (tokens[i + 1] && tokens[i + 1].type !== TokenType.FullStop)))
            return (tokens[i].number_l = 1, tokens[i].number_l);
        if (i < tokensLength &&
            tokens[i].type === TokenType.DecimalNumber &&
            tokens[i + 1] && tokens[i + 1].type === TokenType.FullStop &&
            (!tokens[i + 2] || (tokens[i + 2].type !== TokenType.DecimalNumber)))
            return (tokens[i].number_l = 2, tokens[i].number_l);
        if (i < tokensLength &&
            tokens[i].type === TokenType.FullStop &&
            tokens[i + 1].type === TokenType.DecimalNumber)
            return (tokens[i].number_l = 2, tokens[i].number_l);
        if (i < tokensLength &&
            tokens[i].type === TokenType.DecimalNumber &&
            tokens[i + 1] && tokens[i + 1].type === TokenType.FullStop &&
            tokens[i + 2] && tokens[i + 2].type === TokenType.DecimalNumber)
            return (tokens[i].number_l = 3, tokens[i].number_l);
        return 0;
    },
    getNumber: function() {
        var s = '',
            startPos = pos,
            l = tokens[pos].number_l,
            x = [NodeType.NumberType];
        for (var j = 0; j < l; j++) {
            s += tokens[pos + j].value;
        }
        pos += l;
        x.push(s);
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkOperator: function(i) {
        if (i >= tokensLength) return 0;
        switch(tokens[i].type) {
            case TokenType.Solidus:
            case TokenType.Comma:
            case TokenType.Colon:
            case TokenType.EqualsSign:
                return 1;
        }
        return 0;
    },
    getOperator: function() {
        var startPos = pos,
            x = [NodeType.OperatorType, tokens[pos++].value];
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkPercentage: function(i) {
        var x;
        if (i >= tokensLength) return 0;
        x = this.checkNumber(i);
        if (!x || i + x >= tokensLength) return 0;
        return tokens[i + x].type === TokenType.PercentSign ? x + 1 : 0;
    },
    getPercentage: function() {
        var startPos = pos,
            x = [NodeType.PercentageType, this.getNumber()];
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkProgid: function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkSC(i)) i += l;
        if (joinValues2(i, 6) === 'progid:DXImageTransform.Microsoft.') i += 6;
        else return 0;
        if (l = this.checkIdent(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (tokens[i].type === TokenType.LeftParenthesis) {
            tokens[start].progid_end = tokens[i].right;
            i = tokens[i].right + 1;
        } else return 0;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    },
    getProgid: function() {
        var startPos = pos,
            progid_end = tokens[pos].progid_end,
            x;
        x = [NodeType.ProgidType]
            .concat(this.getSC())
            .concat([this._getProgid(progid_end)])
            .concat(this.getSC());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    _getProgid: function(progid_end) {
        var startPos = pos,
            x = [NodeType.RawType, joinValues(pos, progid_end)];
        pos = progid_end + 1;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkProperty: function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkIdent(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    },
    getProperty: function() {
        var startPos = pos,
            x = [NodeType.PropertyType];
        x.push(this.getIdent());
        x = x.concat(this.getSC());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkPropertyDelim: function(i) {
        return i < tokensLength && tokens[i].type === TokenType.Colon ? 1 : 0;
    },
    getPropertyDelim: function() {
        var startPos = pos,
            x = [NodeType.PropertyDelimType];
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkPseudo: function(i) {
        return this.checkPseudoe(i) ||
            this.checkPseudoc(i);
    },
    getPseudo: function() {
        if (this.checkPseudoe(pos)) return this.getPseudoe();
        if (this.checkPseudoc(pos)) return this.getPseudoc();
    },
    checkPseudoe: function(i) {
        var l;
        if (i >= tokensLength || tokens[i++].type !== TokenType.Colon ||
            i >= tokensLength || tokens[i++].type !== TokenType.Colon) return 0;
        return (l = this.checkIdent(i)) ? l + 2 : 0;
    },
    getPseudoe: function() {
        var startPos = pos,
            x = [NodeType.PseudoeType];
        pos += 2;
        x.push(this.getIdent());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkPseudoc: function(i) {
        var l;
        if (i >= tokensLength || tokens[i++].type !== TokenType.Colon) return 0;
        return (l = this.checkFunction(i) || this.checkIdent(i)) ? l + 1 : 0;
    },
    getPseudoc: function() {
        var startPos = pos,
            x = [NodeType.PseudocType];
        pos ++;
        x.push(this.checkFunction(pos) ? this.getFunction() : this.getIdent());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkRuleset: function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (tokens[start].ruleset_l) return tokens[start].ruleset_l;
        while (i < tokensLength) {
            if (l = this.checkBlock(i)) {i += l; break;}
            else if (l = this.checkSelector(i)) i += l;
            else return 0;
        }
        tokens[start].ruleset_l = i - start;
        return i - start;
    },
    getRuleset: function() {
        var startPos = pos,
            x = [NodeType.RulesetType];
        while (pos < tokensLength) {
            if (this.checkBlock(pos)) {x.push(this.getBlock()); break;}
            else if (this.checkSelector(pos)) x.push(this.getSelector());
            else break;
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkS: function(i) {
        return i < tokensLength && tokens[i].ws ? tokens[i].ws_last - i + 1 : 0;
    },
    getS: function() {
        var startPos = pos,
            x = [NodeType.SType, joinValues(pos, tokens[pos].ws_last)];
        pos = tokens[pos].ws_last + 1;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkSC: function(i) {
        var l,
            lsc = 0;
        while (i < tokensLength) {
            if (!(l = this.checkS(i)) &&
                !(l = this.checkCommentML(i))) break;
            i += l;
            lsc += l;
        }
        return lsc || 0;
    },
    getSC: function() {
        var sc = [];
        if (pos >= tokensLength) return sc;
        while (pos < tokensLength) {
            if (this.checkS(pos)) sc.push(this.getS());
            else if (this.checkCommentML(pos)) sc.push(this.getCommentML());
            else break;
        }
        return sc;
    },
    checkSelector: function(i) {
        var start = i,
            l;
        while (i < tokensLength) {
            if (l = this.checkSimpleSelector(i) || this.checkDelim(i))  i += l;
            else break;
        }
        if (i !== start) tokens[start].selector_end = i - 1;
        return i - start;
    },
    getSelector: function() {
        var startPos = pos,
            x = [NodeType.SelectorType],
            selector_end = tokens[pos].selector_end;
        while (pos <= selector_end) {
            x.push(this.checkDelim(pos) ? this.getDelim() : this.getSimpleSelector());
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkShash: function(i) {
        var l;
        if (i >= tokensLength || tokens[i].type !== TokenType.NumberSign) return 0;
        return (l = this.checkNmName(i + 1)) ? l + 1 : 0;
    },
    getShash: function() {
        var startPos = pos,
            x = [NodeType.ShashType];
        pos++;
        x.push(this.getNmName());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkSimpleSelector: function(i) {
        var start = i,
            l;
        while (i < tokensLength) {
            if (l = this.checkSimpleSelector1(i)) i += l;
            else break;
        }
        return i - start;
    },
    getSimpleSelector: function() {
        var startPos = pos,
            x = [NodeType.SimpleselectorType],
            t;
        while (pos < tokensLength) {
            if (!this.checkSimpleSelector1(pos)) break;
            t = this.getSimpleSelector1();
            if ((needInfo && typeof t[1] === 'string') || typeof t[0] === 'string') x.push(t);
            else x = x.concat(t);
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkSimpleSelector1: function(i) {
        return this.checkNthselector(i) ||
            this.checkCombinator(i) ||
            this.checkAttrib(i) ||
            this.checkPseudo(i) ||
            this.checkShash(i) ||
            this.checkAny(i) ||
            this.checkSC(i) ||
            this.checkNamespace(i);
    },
    getSimpleSelector1: function() {
        if (this.checkNthselector(pos)) return this.getNthselector();
        else if (this.checkCombinator(pos)) return this.getCombinator();
        else if (this.checkAttrib(pos)) return this.getAttrib();
        else if (this.checkPseudo(pos)) return this.getPseudo();
        else if (this.checkShash(pos)) return this.getShash();
        else if (this.checkAny(pos)) return this.getAny();
        else if (this.checkSC(pos)) return this.getSC();
        else if (this.checkNamespace(pos)) return this.getNamespace();
    },
    checkString: function(i) {
        return i < tokensLength && (tokens[i].type === TokenType.StringSQ || tokens[i].type === TokenType.StringDQ) ? 1 : 0;
    },
    getString: function() {
        var startPos = pos,
            x = [NodeType.StringType, tokens[pos++].value];
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkStylesheet: function(i) {
        var start = i,
            l;
        while (i < tokensLength) {
            if (l = this.checkSC(i) ||
                this.checkDeclDelim(i) ||
                this.checkAtrule(i) ||
                this.checkRuleset(i) ||
                this.checkUnknown(i)) i += l;
            else throwError(i);
        }
        return i - start;
    },
    getStylesheet: function() {
        var startPos = pos,
            x = [NodeType.StylesheetType];
        while (pos < tokensLength) {
            if (this.checkSC(pos)) x = x.concat(this.getSC());
            else if (this.checkRuleset(pos)) x.push(this.getRuleset());
            else if (this.checkAtrule(pos)) x.push(this.getAtrule());
            else if (this.checkDeclDelim(pos)) x.push(this.getDeclDelim());
            else if (this.checkUnknown(pos)) x.push(this.getUnknown());
            else throwError();
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkTset: function(i) {
        return this.checkVhash(i) ||
            this.checkAny(i) ||
            this.checkSC(i) ||
            this.checkOperator(i);
    },
    getTset: function() {
        if (this.checkVhash(pos)) return this.getVhash();
        else if (this.checkAny(pos)) return this.getAny();
        else if (this.checkSC(pos)) return this.getSC();
        else if (this.checkOperator(pos)) return this.getOperator();
    },
    checkTsets: function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        while (l = this.checkTset(i)) {
            i += l;
        }
        return i - start;
    },
    getTsets: function() {
        var x = [],
            t;
        while (t = this.getTset()) {
            if ((needInfo && typeof t[1] === 'string') || typeof t[0] === 'string') x.push(t);
            else x = x.concat(t);
        }
        return x;
    },
    checkUnary: function(i) {
        return i < tokensLength && (tokens[i].type === TokenType.HyphenMinus || tokens[i].type === TokenType.PlusSign) ? 1 : 0;
    },
    getUnary: function() {
        var startPos = pos,
            x = [NodeType.UnaryType, tokens[pos++].value];
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkUnknown: function(i) {
        return i < tokensLength && tokens[i].type === TokenType.CommentSL ? 1 : 0;
    },
    getUnknown: function() {
        var startPos = pos,
            x = [NodeType.UnknownType, tokens[pos++].value];
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    checkUri: function(i) {
        var start = i;
        if (i >= tokensLength || tokens[i++].value !== 'url' ||
            i >= tokensLength || tokens[i].type !== TokenType.LeftParenthesis)
            return 0;
        return tokens[i].right - start + 1;
    },
    getUri: function() {
        var startPos = pos,
            uriExcluding = {},
            uri,
            l,
            raw;
        pos += 2;
        uriExcluding[TokenType.Space] = 1;
        uriExcluding[TokenType.Tab] = 1;
        uriExcluding[TokenType.Newline] = 1;
        uriExcluding[TokenType.LeftParenthesis] = 1;
        uriExcluding[TokenType.RightParenthesis] = 1;
        if (this.checkUri1(pos)) {
            uri = [NodeType.UriType]
                .concat(this.getSC())
                .concat([this.getString()])
                .concat(this.getSC());
            pos++;
        } else {
            uri = [NodeType.UriType].concat(this.getSC()),
            l = checkExcluding(uriExcluding, pos),
            raw = [NodeType.RawType, joinValues(pos, pos + l)];
            if (needInfo) raw.unshift(getInfo(startPos));
            uri.push(raw);
            pos += l + 1;
            uri = uri.concat(this.getSC());
            pos++;
        }
        return needInfo ? (uri.unshift(getInfo(startPos)), uri) : uri;
    },
    checkUri1: function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkSC(i)) i += l;
        if (tokens[i].type !== TokenType.StringDQ && tokens[i].type !== TokenType.StringSQ) return 0;
        i++;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    },
    checkValue: function(i) {
        var start = i,
            l;
        while (i < tokensLength) {
            if (l = this._checkValue(i)) i += l;
            else break;
        }
        return i - start;
    },
    _checkValue: function(i) {
        return this.checkSC(i) ||
            this.checkVhash(i) ||
            this.checkAny(i) ||
            this.checkOperator(i) ||
            this.checkImportant(i);
    },
    getValue: function() {
        var startPos = pos,
            x = [NodeType.ValueType],
            t,
            _pos;
        while (pos < tokensLength) {
            _pos = pos;
            if (!this._checkValue(pos)) break;
            t = this._getValue();
            if ((needInfo && typeof t[1] === 'string') || typeof t[0] === 'string') x.push(t);
            else x = x.concat(t);
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    _getValue: function() {
        if (this.checkSC(pos)) return this.getSC();
        else if (this.checkVhash(pos)) return this.getVhash();
        else if (this.checkAny(pos)) return this.getAny();
        else if (this.checkOperator(pos)) return this.getOperator();
        else if (this.checkImportant(pos)) return this.getImportant();
    },
    checkVhash: function(i) {
        var l;
        if (i >= tokensLength || tokens[i].type !== TokenType.NumberSign) return 0;
        return (l = this.checkNmName2(i + 1)) ? l + 1 : 0;
    },
    getVhash: function() {
        var startPos = pos,
            x = [NodeType.VhashType];
        pos++;
        x.push(this.getNmName2());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    markSC: function() {
        var ws = -1,
            sc = -1,
            t;
        for (var i = 0; i < tokensLength; i++) {
            t = tokens[i];
            switch (t.type) {
                case TokenType.Space:
                case TokenType.Tab:
                case TokenType.Newline:
                    t.ws = true;
                    t.sc = true;
                    if (ws === -1) ws = i;
                    if (sc === -1) sc = i;
                    break;
                case TokenType.CommentML:
                    if (ws !== -1) {
                        tokens[ws].ws_last = i - 1;
                        ws = -1;
                    }
                    t.sc = true;
                    break;
                default:
                    if (ws !== -1) {
                        tokens[ws].ws_last = i - 1;
                        ws = -1;
                    }
                    if (sc !== -1) {
                        tokens[sc].sc_last = i - 1;
                        sc = -1;
                    }
            }
        }
        if (ws !== -1) tokens[ws].ws_last = i - 1;
        if (sc !== -1) tokens[sc].sc_last = i - 1;
    },
    markBrackets: function() {
        var ps = [],
            sbs = [],
            cbs = [],
            t;
        for (var i = 0; i < tokens.length; i++) {
            t = tokens[i];
            switch(t.type) {
                case TokenType.LeftParenthesis:
                    ps.push(i);
                    break;
                case TokenType.RightParenthesis:
                    if (ps.length) {
                        t.left = ps.pop();
                        tokens[t.left].right = i;
                    }
                    break;
                case TokenType.LeftSquareBracket:
                    sbs.push(i);
                    break;
                case TokenType.RightSquareBracket:
                    if (sbs.length) {
                        t.left = sbs.pop();
                        tokens[t.left].right = i;
                    }
                    break;
                case TokenType.LeftCurlyBracket:
                    cbs.push(i);
                    break;
                case TokenType.RightCurlyBracket:
                    if (cbs.length) {
                        t.left = cbs.pop();
                        tokens[t.left].right = i;
                    }
                    break;
            }
        }
    },
    parseMLComment: function(css) {
        var start = pos;
        for (pos = pos + 2; pos < css.length; pos++) {
            if (css.charAt(pos) === '*' && css.charAt(pos + 1) === '/') {
                pos++;
                break;
            }
        }
        pushToken(TokenType.CommentML, css.substring(start, pos + 1));
    },
    parseSLComment: function(css) {
        var start = pos;
        for (pos = pos + 2; pos < css.length; pos++) {
            if (css.charAt(pos) === '\n' || css.charAt(pos) === '\r') {
                break;
            }
        }
        pushToken(TokenType.CommentSL, css.substring(start, pos));
        pos--;
    }
};
(function() {
    var scss = Object.create(syntaxes.css);
    scss.checkAny = function(i) {
        return this.checkBraces(i) ||
            this.checkString(i) ||
            this.checkVariablesList(i) ||
            this.checkVariable(i) ||
            this.checkPlaceholder(i) ||
            this.checkPercentage(i) ||
            this.checkDimension(i) ||
            this.checkNumber(i) ||
            this.checkUri(i) ||
            this.checkFunctionExpression(i) ||
            this.checkFunction(i) ||
            this.checkIdent(i) ||
            this.checkClass(i) ||
            this.checkUnary(i);
    };
    scss.getAny = function() {
        if (this.checkBraces(pos)) return this.getBraces();
        else if (this.checkString(pos)) return this.getString();
        else if (this.checkVariablesList(pos)) return this.getVariablesList();
        else if (this.checkVariable(pos)) return this.getVariable();
        else if (this.checkPlaceholder(pos)) return this.getPlaceholder();
        else if (this.checkPercentage(pos)) return this.getPercentage();
        else if (this.checkDimension(pos)) return this.getDimension();
        else if (this.checkNumber(pos)) return this.getNumber();
        else if (this.checkUri(pos)) return this.getUri();
        else if (this.checkFunctionExpression(pos)) return this.getFunctionExpression();
        else if (this.checkFunction(pos)) return this.getFunction();
        else if (this.checkIdent(pos)) return this.getIdent();
        else if (this.checkClass(pos)) return this.getClass();
        else if (this.checkUnary(pos)) return this.getUnary();
    };
    scss.checkArguments = function (i) {
        var start = i,
            l;
        if (i >= tokensLength ||
            tokens[i].type !== TokenType.LeftParenthesis) return 0;
        i++;
        while (i < tokens[start].right) {
            if (l = this.checkArgument(i)) i +=l;
            else return 0;
        }
        return tokens[start].right - start + 1;
    };
    scss.getArguments = function() {
        var startPos = pos,
            arguments = [],
            x;
        pos++;
        while (x = this.getArgument()) {
            if ((needInfo && typeof x[1] === 'string') || typeof x[0] === 'string') arguments.push(x);
            else arguments = arguments.concat(x);
        }
        pos++;
        x = [NodeType.ArgumentsType].concat(arguments);
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkArgument = function(i) {
        return this.checkDeclaration(i) ||
            this.checkVariablesList(i) ||
            this.checkVariable(i) ||
            this.checkSC(i) ||
            this.checkDelim(i) ||
            this.checkDeclDelim(i) ||
            this.checkString(i) ||
            this.checkPercentage(i) ||
            this.checkDimension(i) ||
            this.checkNumber(i) ||
            this.checkUri(i) ||
            this.checkIdent(i) ||
            this.checkVhash(i);
    };
    scss.getArgument = function() {
        if (this.checkDeclaration(pos)) return this.getDeclaration();
        else if (this.checkVariablesList(pos)) return this.getVariablesList();
        else if (this.checkVariable(pos)) return this.getVariable();
        else if (this.checkSC(pos)) return this.getSC();
        else if (this.checkDelim(pos)) return this.getDelim();
        else if (this.checkDeclDelim(pos)) return this.getDeclDelim();
        else if (this.checkString(pos)) return this.getString();
        else if (this.checkPercentage(pos)) return this.getPercentage();
        else if (this.checkDimension(pos)) return this.getDimension();
        else if (this.checkNumber(pos)) return this.getNumber();
        else if (this.checkUri(pos)) return this.getUri();
        else if (this.checkIdent(pos)) return this.getIdent();
        else if (this.checkVhash(pos)) return this.getVhash();
    };
    scss.checkBlockdecl1 = function(i) {
        var start = i,
            l;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkCondition(i)) tokens[i].bd_kind = 1;
        else if (l = this.checkInclude(i)) tokens[i].bd_kind = 2;
        else if (l = this.checkLoop(i)) tokens[i].bd_kind = 3;
        else if (l = this.checkFilter(i)) tokens[i].bd_kind = 4;
        else if (l = this.checkDeclaration(i)) tokens[i].bd_kind = 5;
        else if (l = this.checkAtrule(i)) tokens[i].bd_kind = 6;
        else if (l = this.checkRuleset(i)) tokens[i].bd_kind = 7;
        else return 0;
        i += l;
        if (i < tokensLength && (l = this.checkDeclDelim(i))) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        else return 0;
        return i - start;
    };
    scss.getBlockdecl1 = function() {
        var sc = this.getSC(),
            x;
        switch (tokens[pos].bd_kind) {
            case 1:
                x = this.getCondition();
                break;
            case 2:
                x = this.getInclude();
                break;
            case 3:
                x = this.getLoop();
                break;
            case 4:
                x = this.getFilter();
                break;
            case 5:
                x = this.getDeclaration();
                break;
            case 6:
                x = this.getAtrule();
                break;
            case 7:
                x = this.getRuleset();
                break;
        }
        return sc
            .concat([x])
            .concat([this.getDeclDelim()])
            .concat(this.getSC());
    };
    scss.checkBlockdecl2 = function(i) {
        var start = i,
            l;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkCondition(i)) tokens[i].bd_kind = 1;
        else if (l = this.checkInclude(i)) tokens[i].bd_kind = 2;
        else if (l = this.checkLoop(i)) tokens[i].bd_kind = 3;
        else if (l = this.checkFilter(i)) tokens[i].bd_kind = 4;
        else if (l = this.checkDeclaration(i)) tokens[i].bd_kind = 5;
        else if (l = this.checkAtrule(i)) tokens[i].bd_kind = 6;
        else if (l = this.checkRuleset(i)) tokens[i].bd_kind = 7;
        else return 0;
        i += l;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    };
    scss.getBlockdecl2 = function() {
        var sc = this.getSC(),
            x;
        switch (tokens[pos].bd_kind) {
            case 1:
                x = this.getCondition();
                break;
            case 2:
                x = this.getInclude();
                break;
            case 3:
                x = this.getLoop();
                break;
            case 4:
                x = this.getFilter();
                break;
            case 5:
                x = this.getDeclaration();
                break;
            case 6:
                x = this.getAtrule();
                break;
            case 7:
                x = this.getRuleset();
                break;
        }
        return sc
            .concat([x])
            .concat(this.getSC());
    };
    scss.checkClass = function(i) {
        var l;
        if (i >= tokensLength) return 0;
        if (tokens[i].class_l) return tokens[i].class_l;
        if (tokens[i++].type === TokenType.FullStop &&
            (l = this.checkInterpolatedVariable(i) || this.checkIdent(i))) {
            tokens[i].class_l = l + 1;
            return l + 1;
        }
        return 0;
    };
    scss.getClass = function() {
        var startPos = pos,
            x = [NodeType.ClassType];
        pos++;
        x.push(this.checkInterpolatedVariable(pos) ? this.getInterpolatedVariable() : this.getIdent());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkCommentSL = function(i) {
        return i < tokensLength && tokens[i].type === TokenType.CommentSL ? 1 : 0;
    };
    scss.getCommentSL = function() {
        var startPos = pos,
            x;
        x = [NodeType.CommentSLType, tokens[pos++].value.substring(2)];
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkCondition = function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkAtkeyword(i)) i += l;
        else return 0;
        if (['if', 'else'].indexOf(tokens[start + 1].value) < 0) return 0;
        while (i < tokensLength) {
            if (l = this.checkBlock(i)) break;
            else if (l = this.checkVariable(i) ||
                     this.checkIdent(i) ||
                     this.checkSC(i) ||
                     this.checkNumber(i) ||
                     this.checkOperator(i) ||
                     this.checkCombinator(i) ||
                     this.checkString(i)) i += l;
            else return 0;
        }
        return i - start;
    };
    scss.getCondition = function() {
        var startPos = pos,
            x = [NodeType.ConditionType];
        x.push(this.getAtkeyword());
        while (pos < tokensLength) {
            if (this.checkBlock(pos)) break;
            else if (this.checkVariable(pos)) x.push(this.getVariable());
            else if (this.checkIdent(pos)) x.push(this.getIdent());
            else if (this.checkNumber(pos)) x.push(this.getNumber());
            else if (this.checkOperator(pos)) x.push(this.getOperator());
            else if (this.checkCombinator(pos)) x.push(this.getCombinator());
            else if (this.checkSC(pos)) x = x.concat(this.getSC());
            else if (this.checkString(pos)) x.push(this.getString());
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkDefault = function(i) {
        var start = i,
            l;
        if (i >= tokensLength ||
            tokens[i++].type !== TokenType.ExclamationMark) return 0;
        if (l = this.checkSC(i)) i += l;
        return tokens[i].value === 'default' ? i - start + 1 : 0;
    };
    scss.getDefault = function() {
        var startPos = pos,
            x = [NodeType.DefaultType],
            sc;
        pos++;
        sc = this.getSC();
        pos++;
        x = x.concat(sc);
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkIdent = function(i) {
        var start = i,
            wasIdent,
            l;
        if (i >= tokensLength) return 0;
        if (tokens[i].type === TokenType.LowLine) return this.checkIdentLowLine(i);
        if (tokens[i].type === TokenType.HyphenMinus ||
            tokens[i].type === TokenType.Identifier ||
            tokens[i].type === TokenType.DollarSign ||
            tokens[i].type === TokenType.Asterisk) i++;
        else return 0;
        wasIdent = tokens[i - 1].type === TokenType.Identifier;
        for (; i < tokensLength; i++) {
            if (l = this.checkInterpolatedVariable(i)) i += l;
            if (i >= tokensLength) break;
            if (tokens[i].type !== TokenType.HyphenMinus &&
                tokens[i].type !== TokenType.LowLine) {
                if (tokens[i].type !== TokenType.Identifier &&
                    (tokens[i].type !== TokenType.DecimalNumber || !wasIdent)) break;
                else wasIdent = true;
            }
        }
        if (!wasIdent && tokens[start].type !== TokenType.Asterisk) return 0;
        tokens[start].ident_last = i - 1;
        return i - start;
    };
    scss.checkInclude = function(i) {
        var l;
        if (i >= tokensLength) return 0;
        if (l = this.checkInclude1(i)) tokens[i].include_type = 1;
        else if (l = this.checkInclude2(i)) tokens[i].include_type = 2;
        else if (l = this.checkInclude3(i)) tokens[i].include_type = 3;
        else if (l = this.checkInclude4(i)) tokens[i].include_type = 4;
        return l;
    };
    scss.getInclude = function() {
        switch (tokens[pos].include_type) {
            case 1: return this.getInclude1();
            case 2: return this.getInclude2();
            case 3: return this.getInclude3();
            case 4: return this.getInclude4();
        }
    };
    scss.checkInclude1 = function(i) {
        var start = i,
        l;
        if (l = this.checkAtkeyword(i)) i += l;
        else return 0;
        if (['include', 'extend'].indexOf(tokens[start + 1].value) < 0) return 0;
        if (l = this.checkSC(i)) i += l;
        else return 0;
        if (l = this.checkIncludeSelector(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkArguments(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkBlock(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    };
    scss.getInclude1 = function() {
        var startPos = pos,
            x = [NodeType.IncludeType];
        x.push(this.getAtkeyword());
        x = x.concat(this.getSC());
        x.push(this.getIncludeSelector());
        x = x.concat(this.getSC());
        x.push(this.getArguments());
        x = x.concat(this.getSC());
        x.push(this.getBlock());
        x = x.concat(this.getSC());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkInclude2 = function(i) {
        var start = i,
        l;
        if (l = this.checkAtkeyword(i)) i += l;
        else return 0;
        if (['include', 'extend'].indexOf(tokens[start + 1].value) < 0) return 0;
        if (l = this.checkSC(i)) i += l;
        else return 0;
        if (l = this.checkIncludeSelector(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkArguments(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    };
    scss.getInclude2 = function() {
        var startPos = pos,
            x = [NodeType.IncludeType];
        x.push(this.getAtkeyword());
        x = x.concat(this.getSC());
        x.push(this.getIncludeSelector());
        x = x.concat(this.getSC());
        x.push(this.getArguments());
        x = x.concat(this.getSC());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkInclude3 = function(i) {
        var start = i,
            l;
        if (l = this.checkAtkeyword(i)) i += l;
        else return 0;
        if (['include', 'extend'].indexOf(tokens[start + 1].value) < 0) return 0;
        if (l = this.checkSC(i)) i += l;
        else return 0;
        if (l = this.checkIncludeSelector(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkBlock(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    };
    scss.getInclude3 = function() {
        var startPos = pos,
            x = [NodeType.IncludeType];
        x.push(this.getAtkeyword());
        x = x.concat(this.getSC());
        x.push(this.getIncludeSelector());
        x = x.concat(this.getSC());
        x.push(this.getBlock());
        x = x.concat(this.getSC());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkInclude4 = function(i) {
        var start = i,
            l;
        if (l = this.checkAtkeyword(i)) i += l;
        else return 0;
        if (['include', 'extend'].indexOf(tokens[start + 1].value) < 0) return 0;
        if (l = this.checkSC(i)) i += l;
        else return 0;
        if (l = this.checkIncludeSelector(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    };
    scss.getInclude4 = function() {
        var startPos = pos,
            x = [NodeType.IncludeType];
        x.push(this.getAtkeyword());
        x = x.concat(this.getSC());
        x.push(this.getIncludeSelector());
        x = x.concat(this.getSC());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkIncludeSelector = function(i) {
        var start = i,
            l;
        while (i < tokensLength) {
            if (l = this.checkSimpleSelector2(i)) i += l;
            else break;
        }
        return i - start;
    };
    scss.getIncludeSelector = function() {
        var startPos = pos,
            x = [NodeType.SimpleselectorType],
            t;
        while (pos < tokensLength && this.checkSimpleSelector2(pos)) {
            t = this.getSimpleSelector2();
            if ((needInfo && typeof t[1] === 'string') || typeof t[0] === 'string') x.push(t);
            else x = x.concat(t);
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkInterpolatedVariable = function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (tokens[i].type !== TokenType.NumberSign ||
            !tokens[i + 1] || tokens[i + 1].type !== TokenType.LeftCurlyBracket ||
            !tokens[i + 2] || tokens[i + 2].type !== TokenType.DollarSign) return 0;
        i += 3;
        if (l = this.checkIdent(i)) i += l;
        else return 0;
        return tokens[i].type === TokenType.RightCurlyBracket ? i - start + 1 : 0;
    };
    scss.getInterpolatedVariable = function() {
        var startPos = pos,
            x = [NodeType.InterpolatedVariableType];
        pos += 3;
        x.push(this.getIdent());
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkLoop = function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkAtkeyword(i)) i += l;
        else return 0;
        if (['for', 'each', 'while'].indexOf(tokens[start + 1].value) < 0) return 0;
        while (i < tokensLength) {
            if (l = this.checkBlock(i)) {
                i += l;
                break;
            } else if (l = this.checkVariable(i) ||
                       this.checkIdent(i) ||
                       this.checkSC(i) ||
                       this.checkNumber(i) ||
                       this.checkOperator(i) ||
                       this.checkCombinator(i) ||
                       this.checkString(i)) i += l;
            else return 0;
        }
        return i - start;
    };
    scss.getLoop = function() {
        var startPos = pos,
            x = [NodeType.LoopType];
        x.push(this.getAtkeyword());
        while (pos < tokensLength) {
            if (this.checkBlock(pos)) {
                x.push(this.getBlock());
                break;
            }
            else if (this.checkVariable(pos)) x.push(this.getVariable());
            else if (this.checkIdent(pos)) x.push(this.getIdent());
            else if (this.checkNumber(pos)) x.push(this.getNumber());
            else if (this.checkOperator(pos)) x.push(this.getOperator());
            else if (this.checkCombinator(pos)) x.push(this.getCombinator());
            else if (this.checkSC(pos)) x = x.concat(this.getSC());
            else if (this.checkString(pos)) x.push(this.getString());
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkMixin = function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if ((l = this.checkAtkeyword(i)) && tokens[i + 1].value === 'mixin') i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkIdent(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkArguments(i)) i += l;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkBlock(i)) i += l;
        else return 0;
        return i - start;
    };
    scss.getMixin = function() {
        var startPos = pos,
            x = [NodeType.MixinType, this.getAtkeyword()];
        x = x.concat(this.getSC());
        if (this.checkIdent(pos)) x.push(this.getIdent());
        x = x.concat(this.getSC());
        if (this.checkArguments(pos)) x.push(this.getArguments());
        x = x.concat(this.getSC());
        if (this.checkBlock(pos)) x.push(this.getBlock());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkOperator = function(i) {
        if (i >= tokensLength) return 0;
        switch(tokens[i].type) {
            case TokenType.Solidus:
            case TokenType.Comma:
            case TokenType.Colon:
            case TokenType.EqualsSign:
            case TokenType.LessThanSign:
            case TokenType.GreaterThanSign:
            case TokenType.Asterisk:
                return 1;
        }
        return 0;
    };
    scss.checkParentSelector = function(i) {
        return i < tokensLength && tokens[i].type === TokenType.Ampersand ? 1 : 0;
    };
    scss.getParentSelector = function() {
        var startPos = pos,
            x = [NodeType.ParentSelectorType, '&'];
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkPlaceholder = function(i) {
        var l;
        if (i >= tokensLength) return 0;
        if (tokens[i].placeholder_l) return tokens[i].placeholder_l;
        if (tokens[i].type === TokenType.PercentSign && (l = this.checkIdent(i + 1))) {
            tokens[i].placeholder_l = l + 1;
            return l + 1;
        } else return 0;
    };
    scss.getPlaceholder = function() {
        var startPos = pos,
            x = [NodeType.PlaceholderType];
        pos++;
        x.push(this.getIdent());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkProperty = function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkVariable(i) || this.checkIdent(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    };
    scss.getProperty = function() {
        var startPos = pos,
            x = [NodeType.PropertyType];
        x.push(this.checkVariable(pos) ? this.getVariable() : this.getIdent());
        x = x.concat(this.getSC());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkPseudoe = function(i) {
        var l;
        if (i >= tokensLength || tokens[i++].type !== TokenType.Colon ||
            i >= tokensLength || tokens[i++].type !== TokenType.Colon) return 0;
        return (l = this.checkInterpolatedVariable(i) || this.checkIdent(i)) ? l + 2 : 0;
    };
    scss.getPseudoe = function() {
        var startPos = pos,
            x = [NodeType.PseudoeType];
        pos += 2;
        x.push(this.checkInterpolatedVariable(pos) ? this.getInterpolatedVariable() : this.getIdent());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkPseudoc = function(i) {
        var l;
        if (i >= tokensLength || tokens[i++].type !== TokenType.Colon) return 0;
        return (l = this.checkInterpolatedVariable(i) || this.checkFunction(i) || this.checkIdent(i)) ? l + 1 : 0;
    };
    scss.getPseudoc = function() {
        var startPos = pos,
            x = [NodeType.PseudocType];
        pos ++;
        if (this.checkInterpolatedVariable(pos)) x.push(this.getInterpolatedVariable());
        else if (this.checkFunction(pos)) x.push(this.getFunction());
        else x.push(this.getIdent());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkSC = function(i) {
        if (i >= tokensLength) return 0;
        var l,
            lsc = 0,
            ln = tokens[i].ln;
        while (i < tokensLength) {
            if (!(l = this.checkS(i)) &&
                !(l = this.checkCommentML(i)) &&
                !(l = this.checkCommentSL(i))) break;
            i += l;
            lsc += l;
        }
        return lsc || 0;
    };
    scss.getSC = function() {
        var sc = [];
        if (pos >= tokensLength) return sc;
        while (pos < tokensLength) {
            if (this.checkS(pos)) sc.push(this.getS());
            else if (this.checkCommentML(pos)) sc.push(this.getCommentML());
            else if (this.checkCommentSL(pos)) sc.push(this.getCommentSL());
            else break;
        }
        return sc;
    };
    scss.checkSimpleSelector1 = function(i) {
        return this.checkParentSelector(i) ||
            this.checkNthselector(i) ||
            this.checkCombinator(i) ||
            this.checkAttrib(i) ||
            this.checkPseudo(i) ||
            this.checkShash(i) ||
            this.checkAny(i) ||
            this.checkSC(i) ||
            this.checkNamespace(i);
    };
    scss.getSimpleSelector1 = function() {
        if (this.checkParentSelector(pos)) return this.getParentSelector();
        else if (this.checkNthselector(pos)) return this.getNthselector();
        else if (this.checkCombinator(pos)) return this.getCombinator();
        else if (this.checkAttrib(pos)) return this.getAttrib();
        else if (this.checkPseudo(pos)) return this.getPseudo();
        else if (this.checkShash(pos)) return this.getShash();
        else if (this.checkAny(pos)) return this.getAny();
        else if (this.checkSC(pos)) return this.getSC();
        else if (this.checkNamespace(pos)) return this.getNamespace();
    };
    scss.checkSimpleSelector2 = function(i) {
        return this.checkParentSelector(i) ||
            this.checkNthselector(i) ||
            this.checkAttrib(i) ||
            this.checkPseudo(i) ||
            this.checkShash(i) ||
            this.checkPlaceholder(i) ||
            this.checkIdent(i) ||
            this.checkClass(i);
    };
    scss.getSimpleSelector2 = function() {
        if (this.checkParentSelector(pos)) return this.getParentSelector();
        else if (this.checkNthselector(pos)) return this.getNthselector();
        else if (this.checkAttrib(pos)) return this.getAttrib();
        else if (this.checkPseudo(pos)) return this.getPseudo();
        else if (this.checkShash(pos)) return this.getShash();
        else if (this.checkPlaceholder(pos)) return this.getPlaceholder();
        else if (this.checkIdent(pos)) return this.getIdent();
        else if (this.checkClass(pos)) return this.getClass();
    };
    scss.checkStylesheet = function(i) {
        var start = i,
            l;
        while (i < tokensLength) {
            if (l = this.checkSC(i) ||
                this.checkDeclaration(i) ||
                this.checkDeclDelim(i) ||
                this.checkInclude(i) ||
                this.checkMixin(i) ||
                this.checkLoop(i) ||
                this.checkAtrule(i) ||
                this.checkRuleset(i)) i += l;
            else throwError(i);
        }
        return i - start;
    };
    scss.getStylesheet = function() {
        var startPos = pos,
            x = [NodeType.StylesheetType];
        while (pos < tokensLength) {
            if (this.checkSC(pos)) x = x.concat(this.getSC());
            else if (this.checkRuleset(pos)) x.push(this.getRuleset());
            else if (this.checkInclude(pos)) x.push(this.getInclude());
            else if (this.checkMixin(pos)) x.push(this.getMixin());
            else if (this.checkLoop(pos)) x.push(this.getLoop());
            else if (this.checkAtrule(pos)) x.push(this.getAtrule());
            else if (this.checkDeclaration(pos)) x.push(this.getDeclaration());
            else if (this.checkDeclDelim(pos)) x.push(this.getDeclDelim());
            else throwError();
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkValue = function(i) {
        var start = i,
            l;
        while (i < tokensLength) {
            if (l = this._checkValue(i)) i += l;
            if (!l || this.checkBlock(i - l)) break;
        }
        return i - start;
    };
    scss._checkValue = function(i) {
        return this.checkSC(i) ||
            this.checkInterpolatedVariable(i) ||
            this.checkVariable(i) ||
            this.checkVhash(i) ||
            this.checkBlock(i) ||
            this.checkAny(i) ||
            this.checkAtkeyword(i) ||
            this.checkOperator(i) ||
            this.checkImportant(i) ||
            this.checkDefault(i);
    };
    scss.getValue = function() {
        var startPos = pos,
            x = [NodeType.ValueType],
            t, _pos;
        while (pos < tokensLength) {
            _pos = pos;
            if (!this._checkValue(pos)) break;
            t = this._getValue();
            if ((needInfo && typeof t[1] === 'string') || typeof t[0] === 'string') x.push(t);
            else x = x.concat(t);
            if (this.checkBlock(_pos)) break;
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss._getValue = function() {
        if (this.checkSC(pos)) return this.getSC();
        else if (this.checkInterpolatedVariable(pos)) return this.getInterpolatedVariable();
        else if (this.checkVariable(pos)) return this.getVariable();
        else if (this.checkVhash(pos)) return this.getVhash();
        else if (this.checkBlock(pos)) return this.getBlock();
        else if (this.checkAny(pos)) return this.getAny();
        else if (this.checkAtkeyword(pos)) return this.getAtkeyword();
        else if (this.checkOperator(pos)) return this.getOperator();
        else if (this.checkImportant(pos)) return this.getImportant();
        else if (this.checkDefault(pos)) return this.getDefault();
    };
    scss.checkVariable = function(i) {
        var l;
        if (i >= tokensLength || tokens[i].type !== TokenType.DollarSign) return 0;
        return (l = this.checkIdent(i + 1)) ? l + 1 : 0;
    };
    scss.getVariable = function() {
        var startPos = pos,
            x = [NodeType.VariableType];
        pos++;
        x.push(this.getIdent());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.checkVariablesList = function(i) {
        var d = 0,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkVariable(i)) i+= l;
        else return 0;
        while (i < tokensLength && tokens[i].type === TokenType.FullStop) {
            d++;
            i++;
        }
        return d === 3 ? l + d : 0;
    };
    scss.getVariablesList = function() {
        var startPos = pos,
            x = [NodeType.VariablesListType, this.getVariable()];
        pos += 3;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    scss.markSC = function() {
        var ws = -1,
        sc = -1,
        t;
        for (var i = 0; i < tokensLength; i++) {
            t = tokens[i];
            switch (t.type) {
                case TokenType.Space:
                case TokenType.Tab:
                case TokenType.Newline:
                    t.ws = true;
                    t.sc = true;
                    if (ws === -1) ws = i;
                    if (sc === -1) sc = i;
                    break;
                case TokenType.CommentML:
                case TokenType.CommentSL:
                    if (ws !== -1) {
                        tokens[ws].ws_last = i - 1;
                        ws = -1;
                    }
                    t.sc = true;
                    break;
                default:
                    if (ws !== -1) {
                        tokens[ws].ws_last = i - 1;
                        ws = -1;
                    }
                    if (sc !== -1) {
                        tokens[sc].sc_last = i - 1;
                        sc = -1;
                    }
            }
        }
        if (ws !== -1) tokens[ws].ws_last = i - 1;
        if (sc !== -1) tokens[sc].sc_last = i - 1;
    };
    syntaxes.scss = scss;
})();
(function() {
    var sass = Object.create(syntaxes.scss);
    sass.checkBlock = function(i) {
        return i < tokensLength && tokens[i].block_end ?
            tokens[i].block_end - i + 1 : 0;
    };
    sass.getBlock = function() {
        var startPos = pos,
            end = tokens[pos].block_end,
            x = [NodeType.BlockType];
        while (pos < end) {
            if (this.checkBlockdecl(pos)) x = x.concat(this.getBlockdecl());
            else throwError();
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    sass.getCommentML = function() {
        var startPos = pos,
            s = tokens[pos].value.substring(2),
            l = s.length,
            x;
        pos++;
        x = [NodeType.CommentMLType, s];
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    sass.checkDeclaration = function(i) {
        return this.checkDeclaration1(i) || this.checkDeclaration2(i);
    };
    sass.getDeclaration = function() {
        return this.checkDeclaration1(pos) ? this.getDeclaration1() : this.getDeclaration2();
    };
    sass.checkDeclaration1 = function(i) {
        var start = i,
        l;
        if (i >= tokensLength) return 0;
        if (l = this.checkProperty(i)) i += l;
        else return 0;
        if (l = this.checkPropertyDelim(i)) i++;
        else return 0;
        if (l = this.checkValue(i)) i += l;
        else return 0;
        return i - start;
    };
    sass.getDeclaration1 = function() {
        var startPos = pos,
        x = [NodeType.DeclarationType];
        x.push(this.getProperty());
        x.push(this.getPropertyDelim());
        x.push(this.getValue());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    sass.checkDeclaration2 = function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkPropertyDelim(i)) i++;
        else return 0;
        if (l = this.checkProperty(i)) i += l;
        else return 0;
        if (l = this.checkValue(i)) i += l;
        else return 0;
        return i - start;
    };
    sass.getDeclaration2 = function() {
        var startPos = pos,
            x = [NodeType.DeclarationType];
        x.push(this.getPropertyDelim());
        x.push(this.getProperty());
        x.push(this.getValue());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    sass.checkDeclDelim = function(i) {
        if (i >= tokensLength) return 0;
        return (tokens[i].type === TokenType.Newline ||
            tokens[i].type === TokenType.Semicolon) ? 1 : 0;
    };
    sass.checkFilterv = function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkProgid(i)) i += l;
        else return 0;
        while (l = this.checkProgid(i)) {
            i += l;
        }
        tokens[start].last_progid = i;
        if (this.checkDeclDelim(i)) return i - start;
        if (i < tokensLength && (l = this.checkSC(i))) i += l;
        if (i < tokensLength && (l = this.checkImportant(i))) i += l;
        return i - start;
    };
    sass.getFilterv = function() {
        var startPos = pos,
            x = [NodeType.FiltervType],
            last_progid = tokens[pos].last_progid;
        while (pos < last_progid) {
            x.push(this.getProgid());
        }
        if (this.checkDeclDelim(pos)) return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
        if (this.checkSC(pos)) x = x.concat(this.getSC());
        if (pos < tokensLength && this.checkImportant(pos)) x.push(this.getImportant());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    sass.checkInclude = function(i) {
        var l;
        if (i >= tokensLength) return 0;
        if (l = this.checkInclude1(i)) tokens[i].include_type = 1;
        else if (l = this.checkInclude2(i)) tokens[i].include_type = 2;
        else if (l = this.checkInclude3(i)) tokens[i].include_type = 3;
        else if (l = this.checkInclude4(i)) tokens[i].include_type = 4;
        else if (l = this.checkInclude5(i)) tokens[i].include_type = 5;
        else if (l = this.checkInclude6(i)) tokens[i].include_type = 6;
        else if (l = this.checkInclude7(i)) tokens[i].include_type = 7;
        else if (l = this.checkInclude8(i)) tokens[i].include_type = 8;
        return l;
    };
    sass.getInclude = function() {
        switch (tokens[pos].include_type) {
            case 1: return this.getInclude1();
            case 2: return this.getInclude2();
            case 3: return this.getInclude3();
            case 4: return this.getInclude4();
            case 5: return this.getInclude5();
            case 6: return this.getInclude6();
            case 7: return this.getInclude7();
            case 8: return this.getInclude8();
        }
    };
    sass.checkInclude5 = function(i) {
        var start = i,
        l;
        if (tokens[i].type === TokenType.PlusSign) i++;
        else return 0;
        if (l = this.checkIncludeSelector(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkArguments(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkBlock(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    };
    sass.getInclude5 = function() {
        var startPos = pos,
            x = [NodeType.IncludeType];
        x.push(this.getOperator());
        x.push(this.getIncludeSelector());
        x = x.concat(this.getSC());
        x.push(this.getArguments());
        x = x.concat(this.getSC());
        x.push(this.getBlock());
        x = x.concat(this.getSC());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    sass.checkInclude6 = function(i) {
        var start = i,
        l;
        if (tokens[i].type === TokenType.PlusSign) i++;
        else return 0;
        if (l = this.checkIncludeSelector(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkArguments(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    };
    sass.getInclude6 = function() {
        var startPos = pos,
            x = [NodeType.IncludeType];
        x.push(this.getOperator());
        x.push(this.getIncludeSelector());
        x = x.concat(this.getSC());
        x.push(this.getArguments());
        x = x.concat(this.getSC());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    sass.checkInclude7 = function(i) {
        var start = i,
            l;
        if (tokens[i].type === TokenType.PlusSign) i++;
        else return 0;
        if (l = this.checkIncludeSelector(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkBlock(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    };
    sass.getInclude7 = function() {
        var startPos = pos,
            x = [NodeType.IncludeType];
        x.push(this.getOperator());
        x.push(this.getIncludeSelector());
        x = x.concat(this.getSC());
        x.push(this.getBlock());
        x = x.concat(this.getSC());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    sass.checkInclude8 = function(i) {
        var start = i,
            l;
        if (tokens[i].type === TokenType.PlusSign) i++;
        else return 0;
        if (l = this.checkIncludeSelector(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    };
    sass.getInclude8 = function() {
        var startPos = pos,
            x = [NodeType.IncludeType];
        x.push(this.getOperator());
        x.push(this.getIncludeSelector());
        x = x.concat(this.getSC());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    sass.checkMixin = function(i) {
        return this.checkMixin1(i) || this.checkMixin2(i);
    };
    sass.getMixin = function() {
        return this.checkMixin1(pos) ? this.getMixin1() : this.getMixin2();
    };
    sass.checkMixin1 = function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if ((l = this.checkAtkeyword(i)) && tokens[i + 1].value === 'mixin') i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkIdent(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkBlock(i)) i += l;
        else {
            if (l = this.checkArguments(i)) i += l;
            if (l = this.checkSC(i)) i += l;
            if (l = this.checkBlock(i)) i += l;
            else return 0;
        }
        return i - start;
    };
    sass.getMixin1 = function() {
        var startPos = pos,
            x = [NodeType.MixinType, this.getAtkeyword()];
        x = x.concat(this.getSC());
        if (this.checkIdent(pos)) x.push(this.getIdent());
        x = x.concat(this.getSC());
        if (this.checkBlock(pos)) x.push(this.getBlock());
        else {
            if (this.checkArguments(pos)) x.push(this.getArguments());
            x = x.concat(this.getSC());
            x.push(this.getBlock());
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    sass.checkMixin2 = function(i) {
        var start = i,
        l;
        if (i >= tokensLength) return 0;
        if (tokens[i].type === TokenType.EqualsSign) i++;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkIdent(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkBlock(i)) i += l;
        else {
            if (l = this.checkArguments(i)) i += l;
            if (l = this.checkSC(i)) i += l;
            if (l = this.checkBlock(i)) i += l;
            else return 0;
        }
        return i - start;
    };
    sass.getMixin2 = function() {
        var startPos = pos,
            x = [NodeType.MixinType, this.getOperator()];
        x = x.concat(this.getSC());
        if (this.checkIdent(pos)) x.push(this.getIdent());
        x = x.concat(this.getSC());
        if (this.checkBlock(pos)) x.push(this.getBlock());
        else {
            if (this.checkArguments(pos)) x.push(this.getArguments());
            x = x.concat(this.getSC());
            x.push(this.getBlock());
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    sass.checkProgid = function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkSC(i)) i += l;
        if (joinValues2(i, 6) === 'progid:DXImageTransform.Microsoft.') i += 6;
        else return 0;
        if (l = this.checkIdent(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (tokens[i].type === TokenType.LeftParenthesis) {
            tokens[start].progid_end = tokens[i].right;
            i = tokens[i].right + 1;
        } else return 0;
        return i - start;
    };
    sass.getProgid = function() {
        var startPos = pos,
            progid_end = tokens[pos].progid_end,
            x;
        x = [NodeType.ProgidType]
            .concat(this.getSC())
            .concat([this._getProgid(progid_end)]);
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    sass.checkSC = function(i) {
        if (!tokens[i]) return 0;
        var l,
            lsc = 0,
            ln = tokens[i].ln;
        while (i < tokensLength) {
            if (tokens[i].ln !== ln) break;
            if (!(l = this.checkS(i)) &&
                !(l = this.checkCommentML(i)) &&
                !(l = this.checkCommentSL(i))) break;
            i += l;
            lsc += l;
        }
        return lsc || 0;
    };
    sass.getSC = function() {
        var sc = [],
            ln;
        if (pos >= tokensLength) return sc;
        ln = tokens[pos].ln;
        while (pos < tokensLength) {
            if (tokens[pos].ln !== ln) break;
            else if (this.checkS(pos)) sc.push(this.getS());
            else if (this.checkCommentML(pos)) sc.push(this.getCommentML());
            else if (this.checkCommentSL(pos)) sc.push(this.getCommentSL());
            else break;
        }
        return sc;
    };
    sass.checkSelector = function(i) {
        var start = i,
            l, ln;
        if (i >= tokensLength) return 0;
        ln = tokens[i].ln;
        while (i < tokensLength) {
            if (tokens[i].ln !== ln) break;
            if ((l = this.checkDeclDelim(i) && this.checkBlock(i + l)) || this.checkSC(i)) i += l;
            if (l = this.checkSimpleSelector(i) || this.checkDelim(i))  i += l;
            else break;
        }
        tokens[start].selector_end = i - 1;
        return i - start;
    };
    sass.getSelector = function() {
        var startPos = pos,
            x = [NodeType.SelectorType],
            selector_end = tokens[pos].selector_end,
            ln = tokens[pos].ln;
        while (pos <= selector_end) {
            if (tokens[pos].ln !== ln) break;
            if ((l = this.checkDeclDelim(pos)) && this.checkBlock(pos + l)) x.push(this.getDeclDelim());
            else if (this.checkSC(pos)) x = x.concat(this.getSC());
            x.push(this.checkDelim(pos) ? this.getDelim() : this.getSimpleSelector());
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    sass.checkSimpleSelector = function(i) {
        if (i >= tokensLength) return 0;
        var start = i,
            l,
            ln = tokens[i].ln;
        while (i < tokensLength) {
            if (tokens[i].ln !== ln) break;
            if (l = this.checkSimpleSelector1(i)) i += l;
            else break;
        }
        return (i - start) || 0;
    };
    sass.getSimpleSelector = function() {
        var startPos = pos,
            x = [NodeType.SimpleselectorType],
            t,
            ln = tokens[pos].ln;
        while (pos < tokensLength) {
            if (tokens[pos].ln !== ln ||
                !this.checkSimpleSelector1(pos)) break;
            t = this.getSimpleSelector1();
            if ((needInfo && typeof t[1] === 'string') || typeof t[0] === 'string') x.push(t);
            else x = x.concat(t);
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    sass.checkValue = function(i) {
        var start = i,
            l;
        while (i < tokensLength) {
            if (this.checkDeclDelim(i)) break;
            if (l = this._checkValue(i)) i += l;
            if (!l || this.checkBlock(i - l)) break;
        }
        return i - start;
    };
    sass.getValue = function() {
        var startPos = pos,
            x = [NodeType.ValueType],
            t, _pos;
        while (pos < tokensLength) {
            _pos = pos;
            if (this.checkDeclDelim(pos)) break;
            if (!this._checkValue(pos)) break;
            t = this._getValue();
            if ((needInfo && typeof t[1] === 'string') || typeof t[0] === 'string') x.push(t);
            else x = x.concat(t);
            if (this.checkBlock(_pos)) break;
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    sass._checkValue = function(i) {
        return this.checkS(i) ||
            this.checkCommentML(i) ||
            this.checkCommentSL(i) ||
            this.checkVhash(i) ||
            this.checkAny(i) ||
            this.checkOperator(i) ||
            this.checkImportant(i);
    };
    sass._getValue = function() {
        if (this.checkS(pos)) return this.getS();
        if (this.checkCommentML(pos)) return this.getCommentML();
        if (this.checkCommentSL(pos)) return this.getCommentSL();
        else if (this.checkVhash(pos)) return this.getVhash();
        else if (this.checkAny(pos)) return this.getAny();
        else if (this.checkOperator(pos)) return this.getOperator();
        else if (this.checkImportant(pos)) return this.getImportant();
    };
    sass.markSC = function() {
        var ws = -1,
        sc = -1,
        t;
        for (var i = 0; i < tokensLength; i++) {
            t = tokens[i];
            switch (t.type) {
                case TokenType.Space:
                case TokenType.Tab:
                    t.ws = true;
                    t.sc = true;
                    if (ws === -1) ws = i;
                    if (sc === -1) sc = i;
                    break;
                case TokenType.Newline:
                    t.ws = true;
                    t.sc = true;
                    ws = ws === -1 ? i : ws;
                    sc = sc === -1 ? i : ws;
                    tokens[ws].ws_last = i;
                    tokens[sc].sc_last = i;
                    ws = -1;
                    sc = -1;
                    break;
                case TokenType.CommentML:
                case TokenType.CommentSL:
                    if (ws !== -1) {
                        tokens[ws].ws_last = i - 1;
                        ws = -1;
                    }
                    t.sc = true;
                    break;
                default:
                    if (ws !== -1) {
                        tokens[ws].ws_last = i - 1;
                        ws = -1;
                    }
                    if (sc !== -1) {
                        tokens[sc].sc_last = i - 1;
                        sc = -1;
                    }
            }
        }
        if (ws !== -1) tokens[ws].ws_last = i - 1;
        if (sc !== -1) tokens[sc].sc_last = i - 1;
    };
    sass.markBlocks = function() {
        var blocks = [],
            currentLN = 1,
            currentIL = 0,
            prevIL = 0,
            i = 0,
            l = tokens.length,
            iw;
        for (; i != l; i++) {
            if (!tokens[i - 1]) continue;
            if (tokens[i].ln == currentLN) continue;
            else currentLN = tokens[i].ln;
            prevIL = currentIL;
            if (tokens[i].type !== TokenType.Space) currentIL = 0;
            else {
                if (!iw) iw = tokens[i].value.length;
                prevIL = currentIL;
                currentIL = tokens[i].value.length / iw;
            }
            if (prevIL === currentIL) continue;
            else if (currentIL > prevIL) {
                blocks.push(i);
                continue;
            } else {
                var il = prevIL;
                while (blocks.length > 0 && il !== currentIL) {
                    tokens[blocks.pop()].block_end = i - 1;
                    il--;
                }
            }
        }
        while (blocks.length > 0) {
            tokens[blocks.pop()].block_end = i - 1;
        }
    };
    sass.parseMLComment = function(css) {
        var start = pos;
        var il = 0;
        for (var _pos = pos - 1; _pos > -1; _pos--) {
            if (css.charAt(_pos) === ' ') il++;
            else break;
        }
        for (pos = pos + 2; pos < css.length; pos++) {
            if (css.charAt(pos) === '\n') {
                var _il = 0;
                for (var _pos = pos + 1; _pos < css.length; _pos++) {
                    if (css.charAt(_pos) === ' ') _il++;
                    else break;
                }
                if (_il > il) {
                    pos = _pos;
                } else break;
            }
        }
        pushToken(TokenType.CommentML, css.substring(start, pos + 1));
    };
    sass.parseSLComment = function(css) {
        var start = pos;
        var il = 0;
        var onlyToken = false;
        for (var _pos = pos - 1; _pos > -1; _pos--) {
            if (css.charAt(_pos) === ' ') il++;
            else if (css.charAt(_pos) === '\n') {
                onlyToken = true;
                break;
            } else break;
        }
        if (_pos === -1) onlyToken = true;
        if (!onlyToken) {
            for (pos = pos + 2; pos < css.length; pos++) {
                if (css.charAt(pos) === '\n' || css.charAt(pos) === '\r') {
                    break;
                }
            }
        } else {
            for (pos = pos + 2; pos < css.length; pos++) {
                if (css.charAt(pos) === '\n') {
                    var _il = 0;
                    for (var _pos = pos + 1; _pos < css.length; _pos++) {
                        if (css.charAt(_pos) === ' ') _il++;
                        else break;
                    }
                    if (_il > il) {
                        pos = _pos;
                    } else break;
                }
            }
        }
        pushToken(TokenType.CommentSL, css.substring(start, pos));
        pos--;
    };
    syntaxes.sass = sass;
})();
(function() {
    var less = Object.create(syntaxes.css);
    less.checkAny = function(i) {
        return this.checkBraces(i) ||
            this.checkString(i) ||
            this.checkVariablesList(i) ||
            this.checkVariable(i) ||
            this.checkPercentage(i) ||
            this.checkDimension(i) ||
            this.checkNumber(i) ||
            this.checkUri(i) ||
            this.checkFunctionExpression(i) ||
            this.checkFunction(i) ||
            this.checkIdent(i) ||
            this.checkClass(i) ||
            this.checkUnary(i);
    };
    less.getAny = function() {
        if (this.checkBraces(pos)) return this.getBraces();
        else if (this.checkString(pos)) return this.getString();
        else if (this.checkVariablesList(pos)) return this.getVariablesList();
        else if (this.checkVariable(pos)) return this.getVariable();
        else if (this.checkPercentage(pos)) return this.getPercentage();
        else if (this.checkDimension(pos)) return this.getDimension();
        else if (this.checkNumber(pos)) return this.getNumber();
        else if (this.checkUri(pos)) return this.getUri();
        else if (this.checkFunctionExpression(pos)) return this.getFunctionExpression();
        else if (this.checkFunction(pos)) return this.getFunction();
        else if (this.checkIdent(pos)) return this.getIdent();
        else if (this.checkClass(pos)) return this.getClass();
        else if (this.checkUnary(pos)) return this.getUnary();
    };
    less.checkArguments = function (i) {
        var start = i,
            l;
        if (i >= tokensLength ||
            tokens[i++].type !== TokenType.LeftParenthesis) return 0;
        while (i < tokens[start].right) {
            if (l = this.checkArgument(i)) i +=l;
            else return 0;
        }
        return tokens[start].right - start + 1;
    };
    less.getArguments = function() {
        var startPos = pos,
            arguments = [],
            x;
        pos++;
        while (x = this.getArgument()) {
            if ((needInfo && typeof x[1] === 'string') || typeof x[0] === 'string') arguments.push(x);
            else arguments = arguments.concat(x);
        }
        pos++;
        x = [NodeType.ArgumentsType].concat(arguments);
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkArgument = function(i) {
        return this.checkDeclaration(i) ||
            this.checkVariablesList(i) ||
            this.checkVariable(i) ||
            this.checkSC(i) ||
            this.checkDelim(i) ||
            this.checkDeclDelim(i) ||
            this.checkString(i) ||
            this.checkPercentage(i) ||
            this.checkDimension(i) ||
            this.checkNumber(i) ||
            this.checkUri(i) ||
            this.checkIdent(i) ||
            this.checkVhash(i);
    };
    less.getArgument = function() {
        if (this.checkDeclaration(pos)) return this.getDeclaration();
        else if (this.checkVariablesList(pos)) return this.getVariablesList();
        else if (this.checkVariable(pos)) return this.getVariable();
        else if (this.checkSC(pos)) return this.getSC();
        else if (this.checkDelim(pos)) return this.getDelim();
        else if (this.checkDeclDelim(pos)) return this.getDeclDelim();
        else if (this.checkString(pos)) return this.getString();
        else if (this.checkPercentage(pos)) return this.getPercentage();
        else if (this.checkDimension(pos)) return this.getDimension();
        else if (this.checkNumber(pos)) return this.getNumber();
        else if (this.checkUri(pos)) return this.getUri();
        else if (this.checkIdent(pos)) return this.getIdent();
        else if (this.checkVhash(pos)) return this.getVhash();
    };
    less.checkBlockdecl1 = function(i) {
        var start = i,
            l;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkCondition(i)) tokens[i].bd_kind = 1;
        else if (l = this.checkInclude(i)) tokens[i].bd_kind = 2;
        else if (l = this.checkFilter(i)) tokens[i].bd_kind = 3;
        else if (l = this.checkDeclaration(i)) tokens[i].bd_kind = 4;
        else if (l = this.checkAtrule(i)) tokens[i].bd_kind = 5;
        else if (l = this.checkRuleset(i)) tokens[i].bd_kind = 6;
        else return 0;
        i += l;
        if (i < tokensLength && (l = this.checkDeclDelim(i))) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        else return 0;
        return i - start;
    }
    less.getBlockdecl1 = function() {
        var sc = this.getSC(),
            x;
        switch (tokens[pos].bd_kind) {
            case 1:
                x = this.getCondition();
                break;
            case 2:
                x = this.getInclude();
                break;
            case 3:
                x = this.getFilter();
                break;
            case 4:
                x = this.getDeclaration();
                break;
            case 5:
                x = this.getAtrule();
                break;
            case 6:
                x = this.getRuleset();
                break;
        }
        return sc
            .concat([x])
            .concat([this.getDeclDelim()])
            .concat(this.getSC());
    };
    less.checkBlockdecl2 = function(i) {
        var start = i,
            l;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkCondition(i)) tokens[i].bd_kind = 1;
        else if (l = this.checkInclude(i)) tokens[i].bd_kind = 2;
        else if (l = this.checkFilter(i)) tokens[i].bd_kind = 3;
        else if (l = this.checkDeclaration(i)) tokens[i].bd_kind = 4;
        else if (l = this.checkAtrule(i)) tokens[i].bd_kind = 5;
        else if (l = this.checkRuleset(i)) tokens[i].bd_kind = 6;
        else return 0;
        i += l;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    };
    less.getBlockdecl2 = function() {
        var sc = this.getSC(),
            x;
        switch (tokens[pos].bd_kind) {
            case 1:
                x = this.getCondition();
                break;
            case 2:
                x = this.getInclude();
                break;
            case 3:
                x = this.getFilter();
                break;
            case 4:
                x = this.getDeclaration();
                break;
            case 5:
                x = this.getAtrule();
                break;
            case 6:
                x = this.getRuleset();
                break;
        }
        return sc
            .concat([x])
            .concat(this.getSC());
    };
    less.checkClass = function(i) {
        var l;
        if (i >= tokensLength) return 0;
        if (tokens[i].class_l) return tokens[i].class_l;
        if (tokens[i++].type === TokenType.FullStop &&
            (l = this.checkInterpolatedVariable(i) || this.checkIdent(i))) {
            tokens[i].class_l = l + 1;
            return l + 1;
        }
        return 0;
    };
    less.getClass = function() {
        var startPos = pos,
            x = [NodeType.ClassType];
        pos++;
        x.push(this.checkInterpolatedVariable(pos) ? this.getInterpolatedVariable() : this.getIdent());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkCommentSL = function(i) {
        return i < tokensLength && tokens[i].type === TokenType.CommentSL ? 1 : 0;
    };
    less.getCommentSL = function() {
        var startPos = pos,
            x;
        x = [NodeType.CommentSLType, tokens[pos++].value.substring(2)];
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkCondition = function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if ((l = this.checkIdent(i)) && tokens[i].value === 'when') i += l;
        else return 0;
        while (i < tokensLength) {
            if (l = this.checkBlock(i)) break;
            if (l = this.checkFunction(i) |
                this.checkBraces(i) ||
                this.checkVariable(i) ||
                this.checkIdent(i) ||
                this.checkSC(i) ||
                this.checkNumber(i) ||
                this.checkDelim(i) ||
                this.checkOperator(i) ||
                this.checkCombinator(i) ||
                this.checkString(i)) i += l;
            else return 0;
        }
        return i - start;
    };
    less.getCondition = function() {
        var startPos = pos,
            x = [NodeType.ConditionType];
        x.push(this.getIdent());
        while (pos < tokensLength) {
            if (this.checkBlock(pos)) break;
            else if (this.checkFunction(pos)) x.push(this.getFunction());
            else if (this.checkBraces(pos)) x.push(this.getBraces());
            else if (this.checkVariable(pos)) x.push(this.getVariable());
            else if (this.checkIdent(pos)) x.push(this.getIdent());
            else if (this.checkNumber(pos)) x.push(this.getNumber());
            else if (this.checkDelim(pos)) x.push(this.getDelim());
            else if (this.checkOperator(pos)) x.push(this.getOperator());
            else if (this.checkCombinator(pos)) x.push(this.getCombinator());
            else if (this.checkSC(pos)) x = x.concat(this.getSC());
            else if (this.checkString(pos)) x.push(this.getString());
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkEscapedString = function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (tokens[i].type === TokenType.Tilde && (l = this.checkString(i + 1))) return i + l - start;
        else return 0;
    };
    less.getEscapedString = function() {
       var startPos = pos,
            x = [NodeType.EscapedStringType];
        pos++;
        x.push(tokens[pos++].value);
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkFilterv = function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkProgid(i) || this.checkEscapedString(i)) i += l;
        else return 0;
        while (l = this.checkProgid(i) || this.checkEscapedString(i)) {
            i += l;
        }
        tokens[start].last_progid = i;
        if (i < tokensLength && (l = this.checkSC(i))) i += l;
        if (i < tokensLength && (l = this.checkImportant(i))) i += l;
        return i - start;
    };
    less.getFilterv = function() {
        var startPos = pos,
            x = [NodeType.FiltervType],
            last_progid = tokens[pos].last_progid;
        x = x.concat(this.getSC());
        while (pos < last_progid) {
            x.push(this.checkProgid(pos) ? this.getProgid() : this.getEscapedString());
        }
        if (this.checkSC(pos)) x = x.concat(this.getSC());
        if (pos < tokensLength && this.checkImportant(pos)) x.push(this.getImportant());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    },
    less.checkIdent = function(i) {
        var start = i,
            wasIdent,
            l;
        if (i >= tokensLength) return 0;
        if (tokens[i].type === TokenType.LowLine) return this.checkIdentLowLine(i);
        if (tokens[i].type === TokenType.HyphenMinus ||
            tokens[i].type === TokenType.Identifier ||
            tokens[i].type === TokenType.DollarSign ||
            tokens[i].type === TokenType.Asterisk) i++;
        else return 0;
        wasIdent = tokens[i - 1].type === TokenType.Identifier;
        for (; i < tokensLength; i++) {
            if (l = this.checkInterpolatedVariable(i)) i += l;
            if (i >= tokensLength) break;
            if (tokens[i].type !== TokenType.HyphenMinus &&
                tokens[i].type !== TokenType.LowLine) {
                if (tokens[i].type !== TokenType.Identifier &&
                    (tokens[i].type !== TokenType.DecimalNumber || !wasIdent)) break;
                else wasIdent = true;
            }
        }
        if (!wasIdent && tokens[start].type !== TokenType.Asterisk) return 0;
        tokens[start].ident_last = i - 1;
        return i - start;
    };
    less.checkInclude = function(i) {
        var l;
        if (i >= tokensLength) return 0;
        if (l = this.checkInclude1(i)) tokens[i].include_type = 1;
        else if (l = this.checkInclude2(i)) tokens[i].include_type = 2;
        return l;
    };
    less.getInclude = function() {
        switch (tokens[pos].include_type) {
            case 1: return this.getInclude1();
            case 2: return this.getInclude2();
        }
    };
    less.checkInclude1 = function(i) {
        var start = i,
            l;
        if (l = this.checkClass(i) || this.checkShash(i)) i += l;
        else return 0;
        while (i < tokensLength) {
            if (l = this.checkClass(i) || this.checkShash(i) || this.checkSC(i)) i += l;
            else if (tokens[i].type == TokenType.GreaterThanSign) i++;
            else break;
        }
        if (l = this.checkArguments(i)) i += l;
        else return 0;
        if (i < tokensLength && (l = this.checkSC(i))) i += l;
        if (i < tokensLength && (l = this.checkImportant(i))) i += l;
        return i - start;
    };
    less.getInclude1 = function() {
        var startPos = pos,
            x = [NodeType.IncludeType];
        x.push(this.checkClass(pos) ? this.getClass() : this.getShash());
        while (pos < tokensLength) {
            if (this.checkClass(pos)) x.push(this.getClass());
            else if (this.checkShash(pos)) x.push(this.getShash());
            else if (this.checkSC(pos)) x = x.concat(this.getSC());
            else if (this.checkOperator(pos)) x.push(this.getOperator());
            else break;
        }
        x.push(this.getArguments());
        x = x.concat(this.getSC());
        if (this.checkImportant(pos)) x.push(this.getImportant());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkInclude2 = function(i) {
        var start = i,
            l;
        if (l = this.checkClass(i) || this.checkShash(i)) i += l;
        else return 0;
        while (i < tokensLength) {
            if (l = this.checkClass(i) || this.checkShash(i) || this.checkSC(i)) i += l;
            else if (tokens[i].type == TokenType.GreaterThanSign) i++;
            else break;
        }
        return i - start;
    };
    less.getInclude2 = function() {
        var startPos = pos,
            x = [NodeType.IncludeType];
        x.push(this.checkClass(pos) ? this.getClass() : this.getShash());
        while (pos < tokensLength) {
            if (this.checkClass(pos)) x.push(this.getClass());
            else if (this.checkShash(pos)) x.push(this.getShash());
            else if (this.checkSC(pos)) x = x.concat(this.getSC());
            else if (this.checkOperator(pos)) x.push(this.getOperator());
            else break;
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkIncludeSelector = function(i) {
        var start = i,
            l;
        while (i < tokensLength) {
            if (l = this.checkSimpleSelector2(i)) i += l;
            else break;
        }
        return i - start;
    };
    less.getIncludeSelector = function() {
        var startPos = pos,
            x = [NodeType.SimpleselectorType],
            t;
        while (pos < tokensLength && this.checkSimpleSelector2(pos)) {
            t = this.getSimpleSelector2();
            if ((needInfo && typeof t[1] === 'string') || typeof t[0] === 'string') x.push(t);
            else x = x.concat(t);
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkInterpolatedVariable = function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (tokens[i].type !== TokenType.CommercialAt ||
            !tokens[i + 1] || tokens[i + 1].type !== TokenType.LeftCurlyBracket) return 0;
        i += 2;
        if (l = this.checkIdent(i)) i += l;
        else return 0;
        return tokens[i].type === TokenType.RightCurlyBracket ? i - start + 1 : 0;
    };
    less.getInterpolatedVariable = function() {
        var startPos = pos,
            x = [NodeType.InterpolatedVariableType];
        pos += 2;
        x.push(this.getIdent());
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkMixin = function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkClass(i) || this.checkShash(i)) i +=l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkArguments(i)) i += l;
        if (l = this.checkSC(i)) i += l;
        if (l = this.checkBlock(i)) i += l;
        else return 0;
        return i - start;
    };
    less.getMixin = function() {
        var startPos = pos,
            x = [NodeType.MixinType];
        x.push(this.checkClass(pos) ? this.getClass() : this.getShash());
        x = x.concat(this.getSC());
        if (this.checkArguments(pos)) x.push(this.getArguments());
        x = x.concat(this.getSC());
        if (this.checkBlock(pos)) x.push(this.getBlock());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkOperator = function(i) {
        if (i >= tokensLength) return 0;
        switch(tokens[i].type) {
            case TokenType.Solidus:
            case TokenType.Comma:
            case TokenType.Colon:
            case TokenType.EqualsSign:
            case TokenType.LessThanSign:
            case TokenType.GreaterThanSign:
            case TokenType.Asterisk:
                return 1;
        }
        return 0;
    };
    less.checkParentSelector = function(i) {
        return i < tokensLength && tokens[i].type === TokenType.Ampersand ? 1 : 0;
    };
    less.getParentSelector = function() {
        var startPos = pos,
            x = [NodeType.ParentSelectorType, '&'];
        pos++;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkProperty = function(i) {
        var start = i,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkVariable(i) || this.checkIdent(i)) i += l;
        else return 0;
        if (l = this.checkSC(i)) i += l;
        return i - start;
    };
    less.getProperty = function() {
        var startPos = pos,
            x = [NodeType.PropertyType];
        if (this.checkVariable(pos)) x.push(this.getVariable());
        else x.push(this.getIdent());
        x = x.concat(this.getSC());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkPseudoe = function(i) {
        var l;
        if (i >= tokensLength || tokens[i++].type !== TokenType.Colon ||
            i >= tokensLength || tokens[i++].type !== TokenType.Colon) return 0;
        return (l = this.checkInterpolatedVariable(i) || this.checkIdent(i)) ? l + 2 : 0;
    };
    less.getPseudoe = function() {
        var startPos = pos,
            x = [NodeType.PseudoeType];
        pos += 2;
        x.push(this.checkInterpolatedVariable(pos) ? this.getInterpolatedVariable() : this.getIdent());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkPseudoc = function(i) {
        var l;
        if (i >= tokensLength || tokens[i++].type !== TokenType.Colon) return 0;
        return (l = this.checkInterpolatedVariable(i) || this.checkFunction(i) || this.checkIdent(i)) ? l + 1 : 0;
    };
    less.getPseudoc = function() {
        var startPos = pos,
            x = [NodeType.PseudocType];
        pos ++;
        if (this.checkInterpolatedVariable(pos)) x.push(this.getInterpolatedVariable());
        else if (this.checkFunction(pos)) x.push(this.getFunction());
        else x.push(this.getIdent());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkSC = function(i) {
        if (i >= tokensLength) return 0;
        var l,
            lsc = 0,
            ln = tokens[i].ln;
        while (i < tokensLength) {
            if (!(l = this.checkS(i)) &&
                !(l = this.checkCommentML(i)) &&
                !(l = this.checkCommentSL(i))) break;
            i += l;
            lsc += l;
        }
        return lsc || 0;
    };
    less.getSC = function() {
        var sc = [],
            ln;
        if (pos >= tokensLength) return sc;
        ln = tokens[pos].ln;
        while (pos < tokensLength) {
            if (this.checkS(pos)) sc.push(this.getS());
            else if (this.checkCommentML(pos)) sc.push(this.getCommentML());
            else if (this.checkCommentSL(pos)) sc.push(this.getCommentSL());
            else break;
        }
        return sc;
    };
    less.checkSimpleSelector1 = function(i) {
        return this.checkParentSelector(i) ||
            this.checkNthselector(i) ||
            this.checkCombinator(i) ||
            this.checkAttrib(i) ||
            this.checkPseudo(i) ||
            this.checkShash(i) ||
            this.checkAny(i) ||
            this.checkSC(i) ||
            this.checkNamespace(i);
    };
    less.getSimpleSelector1 = function() {
        if (this.checkParentSelector(pos)) return this.getParentSelector();
        else if (this.checkNthselector(pos)) return this.getNthselector();
        else if (this.checkCombinator(pos)) return this.getCombinator();
        else if (this.checkAttrib(pos)) return this.getAttrib();
        else if (this.checkPseudo(pos)) return this.getPseudo();
        else if (this.checkShash(pos)) return this.getShash();
        else if (this.checkAny(pos)) return this.getAny();
        else if (this.checkSC(pos)) return this.getSC();
        else if (this.checkNamespace(pos)) return this.getNamespace();
    };
    less.checkSimpleSelector2 = function(i) {
        return this.checkParentSelector(i) ||
            this.checkNthselector(i) ||
            this.checkAttrib(i) ||
            this.checkPseudo(i) ||
            this.checkShash(i) ||
            this.checkIdent(i) ||
            this.checkClass(i);
    };
    less.getSimpleSelector2 = function() {
        if (this.checkParentSelector(pos)) return this.getParentSelector();
        else if (this.checkNthselector(pos)) return this.getNthselector();
        else if (this.checkAttrib(pos)) return this.getAttrib();
        else if (this.checkPseudo(pos)) return this.getPseudo();
        else if (this.checkShash(pos)) return this.getShash();
        else if (this.checkIdent(pos)) return this.getIdent();
        else if (this.checkClass(pos)) return this.getClass();
    };
    less.checkStylesheet = function(i) {
        var start = i,
            l;
        while (i < tokensLength) {
            if (l = this.checkSC(i) ||
                this.checkDeclaration(i) ||
                this.checkDeclDelim(i) ||
                this.checkInclude(i) ||
                this.checkMixin(i) ||
                this.checkAtrule(i) ||
                this.checkRuleset(i)) i += l;
            else throwError(i);
        }
        return i - start;
    };
    less.getStylesheet = function() {
        var startPos = pos,
            x = [NodeType.StylesheetType];
        while (pos < tokensLength) {
            if (this.checkSC(pos)) x = x.concat(this.getSC());
            else if (this.checkRuleset(pos)) x.push(this.getRuleset());
            else if (this.checkInclude(pos)) x.push(this.getInclude());
            else if (this.checkMixin(pos)) x.push(this.getMixin());
            else if (this.checkAtrule(pos)) x.push(this.getAtrule());
            else if (this.checkDeclaration(pos)) x.push(this.getDeclaration());
            else if (this.checkDeclDelim(pos)) x.push(this.getDeclDelim());
            else throwError();
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkValue = function(i) {
        var start = i,
            l;
        while (i < tokensLength) {
            if (l = this._checkValue(i)) i += l;
            if (!l || this.checkBlock(i - l)) break;
        }
        return i - start;
    };
    less._checkValue = function(i) {
        return this.checkSC(i) ||
            this.checkEscapedString(i) ||
            this.checkInterpolatedVariable(i) ||
            this.checkVariable(i) ||
            this.checkVhash(i) ||
            this.checkBlock(i) ||
            this.checkAny(i) ||
            this.checkAtkeyword(i) ||
            this.checkOperator(i) ||
            this.checkImportant(i);
    };
    less.getValue = function() {
        var startPos = pos,
            x = [NodeType.ValueType],
            t, _pos;
        while (pos < tokensLength) {
            _pos = pos;
            if (!this._checkValue(pos)) break;
            t = this._getValue();
            if ((needInfo && typeof t[1] === 'string') || typeof t[0] === 'string') x.push(t);
            else x = x.concat(t);
            if (this.checkBlock(_pos)) break;
        }
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less._getValue = function() {
        if (this.checkSC(pos)) return this.getSC();
        else if (this.checkEscapedString(pos)) return this.getEscapedString();
        else if (this.checkInterpolatedVariable(pos)) return this.getInterpolatedVariable();
        else if (this.checkVariable(pos)) return this.getVariable();
        else if (this.checkVhash(pos)) return this.getVhash();
        else if (this.checkBlock(pos)) return this.getBlock();
        else if (this.checkAny(pos)) return this.getAny();
        else if (this.checkAtkeyword(pos)) return this.getAtkeyword();
        else if (this.checkOperator(pos)) return this.getOperator();
        else if (this.checkImportant(pos)) return this.getImportant();
    };
    less.checkVariable = function(i) {
        var l;
        if (i >= tokensLength || tokens[i].type !== TokenType.CommercialAt) return 0;
        if (tokens[i - 1] &&
            tokens[i - 1].type === TokenType.CommercialAt &&
            tokens[i - 2] &&
            tokens[i - 2].type === TokenType.CommercialAt) return 0;
        return (l = this.checkVariable(i + 1) || this.checkIdent(i + 1)) ? l + 1 : 0;
    };
    less.getVariable = function() {
        var startPos = pos,
            x = [NodeType.VariableType];
        pos++;
        if (this.checkVariable(pos)) x.push(this.getVariable());
        else x.push(this.getIdent());
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.checkVariablesList = function(i) {
        var d = 0,
            l;
        if (i >= tokensLength) return 0;
        if (l = this.checkVariable(i)) i+= l;
        else return 0;
        while (tokens[i] && tokens[i].type === TokenType.FullStop) {
            d++;
            i++;
        }
        return d === 3 ? l + d : 0;
    };
    less.getVariablesList = function() {
        var startPos = pos,
            x = [NodeType.VariablesListType, this.getVariable()];
        pos += 3;
        return needInfo ? (x.unshift(getInfo(startPos)), x) : x;
    };
    less.markSC = function() {
        var ws = -1,
        sc = -1,
        t;
        for (var i = 0; i < tokensLength; i++) {
            t = tokens[i];
            switch (t.type) {
                case TokenType.Space:
                case TokenType.Tab:
                case TokenType.Newline:
                    t.ws = true;
                    t.sc = true;
                    if (ws === -1) ws = i;
                    if (sc === -1) sc = i;
                    break;
                case TokenType.CommentML:
                case TokenType.CommentSL:
                    if (ws !== -1) {
                        tokens[ws].ws_last = i - 1;
                        ws = -1;
                    }
                    t.sc = true;
                    break;
                default:
                    if (ws !== -1) {
                        tokens[ws].ws_last = i - 1;
                        ws = -1;
                    }
                    if (sc !== -1) {
                        tokens[sc].sc_last = i - 1;
                        sc = -1;
                    }
            }
        }
        if (ws !== -1) tokens[ws].ws_last = i - 1;
        if (sc !== -1) tokens[sc].sc_last = i - 1;
    };
    syntaxes.less = less;
})();
    return function(options) {
        var css, rule, syntax;
        if (!options) throw new Error('Please, pass a string to parse');
        css = typeof options === 'string'? options : options.css;
        if (!css) throw new Error('String can not be empty');
        rule = options.rule || 'stylesheet';
        needInfo = options.needInfo || false;
        syntax = options.syntax || 'css';
        if (!syntaxes[syntax]) throw new Error('Syntax "' + _syntax +
                                              '" is not currently supported, sorry');
        s = syntaxes[syntax];
        getTokens(css, syntax);
        tokensLength = tokens.length;
        pos = 0;
        s.markBrackets();
        s.markSC();
        s.markBlocks && s.markBlocks();
        return rules[rule]();
    }
}());
exports.cssToAST = cssToAST;
