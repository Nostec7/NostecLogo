/**
 * The script is copyright free, created by Angel J Lopez
 * and further developed by Paulius Legeckas
*/
// vocabularies
var english = ['forward', 'fw', 'backwards', 'bw', 'left', 'lt', 'right', 'rt', 'home',
				'clearscreen', 'clrscr', 'repeat', 'penup', 'pu', 'pendown', 'pd',
				'end', 'to', 'fotward.width', 'fw.width', 'backwards.width', 'bw.width',
    			'choose.pen.width', 'cpw'];
var lietuviu = ['pirmyn', 'pr', 'atgal', 'at', 'kairėn', 'kr','dešinėn', 'dš', 'namo',
				'valyk.vežliuko.lauką', 'vvl', 'kartok', 'eisim', 'es', 'piešim', 'pš',
				'taškas', 'tai', 'priekin.storiu', 'pr.storiu', 'atgal.storiu', 'at.storiu',
				'pasirink.pieštuko.storį', 'pps'];
var vocabulary = lietuviu;



var turtleRots = 0;
var logoLineWidth = 1;
(function(exports, module, top)
{


	var isPenDown = true;
	Array.prototype.toPrintString = function()
	{
		var result = '';
		var l = this.length;
		
		for (var k = 0; k < l; k++)
		{
			if (k)
				result += ' ';

			if (this[k] instanceof Array)
				result += '[ ' + this[k].toPrintString() + ' ]';
			else
				result += this[k];
		}
		
		return result;
	}
	
    function Context(parent)
    {
		this.variables = [];
		this.procedures = [];
		this.procedures.map = null;
		this.parent = parent;
    }

    Context.prototype.setVariable = function(name, value)
    {
		if (this.parent != null && !this.variables.hasOwnProperty(name))
			this.parent.setVariable(name, value);
		else
			this.variables[name] = value;
    }
	
	Context.prototype.defineVariable = function(name)
	{
		this.variables[name] = null;
	}

    Context.prototype.getVariable = function(name)
    {
		if (this.parent != null && !this.variables.hasOwnProperty(name))
			return this.parent.getVariable(name);
			
        return this.variables[name];
    }
	
	Context.prototype.setProcedure = function(name, value)
	{
		this.procedures[name] = value;
	}
	
	Context.prototype.getProcedure = function(name)
	{
		if (!this.procedures.hasOwnProperty(name) && this.parent != null)
			return this.parent.getProcedure(name);
			
		return this.procedures[name];
	}

	function ProcedureReference(name)
	{
		this.name = name;
	}
	
	ProcedureReference.prototype.evaluate = function(context)
	{
		return context.getProcedure(this.name);
	}
	
	function Constant(value)
	{
		this.value = value;
	}
	
	Constant.prototype.evaluate = function(context)
	{
		return this.value;
	}
	
	function VariableReference(name)
	{
		this.name = name;
	}
	
	VariableReference.prototype.evaluate = function(context)
	{
		return context.getVariable(this.name);
	}
	
	function CompositeExpression(list)
	{
		this.list = list;
	}
	
	CompositeExpression.prototype.evaluate = function(context)
	{
		var ip = 0;
		var l = this.list.length;
		var self = this;
		
		while (ip < l)
		{
			var result = evaluateElement();
			
			if (result && result instanceof ReturnValue) 
				return result;
		}
			
		return result;
		
		function specialEvaluateElement(refip)
		{
			ip = refip.ip;
			var result = evaluateElement();
			refip.ip = ip;
			return result;
		}
		
		function evaluateElement()
		{
            try {
			var element = self.list[ip++];

			if (element.evaluate)
				element = element.evaluate(context);

                    if (!element.apply)
                        if (element.special) {
                            var refip = {ip: ip, evaluate: specialEvaluateElement, context: context};
                            var result = element.special(self.list, refip);
                            ip = refip.ip;
                            return result;
                        }
                        else if (element.process) {
                            var args = [];
                            var l = element.length;

                            for (var k = 0; k < l; k++)
                                args.push(evaluateElement());

                            return element.process(context, args);
                        }
                        else
                            return element;

			if (!element.length)
				return element.apply(context);


			var args = [];
			var l = element.length;

			for (var k = 0; k < l; k++)
				args.push(evaluateElement());


			return element.apply(context, args);
            }

            catch(err) {
                console.log("Command error : " + err);
				setText("Error: there is no such command : ", true);
            }
		}
	}
	
	function compileList(list)
	{
		var result = [];
		var l = list.length;
		
		for (var k = 0; k < l; k++)
		{
			var element = list[k];

			if (element instanceof Array)
				;
			else if (isProcedureReference(element))
				element = new ProcedureReference(element);
			else if (isVariableReference(element))
				element = new VariableReference(toVariableName(element));
			else if (isWord(element))
				element = toWord(element);
				
			result.push(element);
		}
		
		return result;
	}
	
	function isProcedureReference(element)
	{
		var letter = element[0];
		
		if (letter >= 'a' && letter <= 'z')
			return true;
		if (letter >= 'A' && letter <= 'Z')
			return true;
			
		return false;
	}
	
	function isVariableReference(element)
	{
		return element[0] == ':';		
	}
	
	function toVariableName(element)
	{
		return element.slice(1);
	}
	
	function isWord(element)
	{
		return element[0] == '"';
	}
	
	function toWord(element)
	{
		return element.slice(1);
	}
	
	function evaluateList(list, context)
	{
		return (new CompositeExpression(compileList(list))).evaluate(context);
	}
	
	// Procedure
	
	function Procedure(argnames, body)
	{
		this.argnames = argnames;
		this.body = body;
		this.length = argnames ? argnames.length : 0;
	}
	
	Procedure.prototype.process = function(context, args)
	{
		var newctx = new Context(context);
		
		if (this.argnames && this.argnames.length)
			for (var n in this.argnames)
				newctx.setVariable(this.argnames[n], args[n]);
				
		var result  = (new CompositeExpression(this.body)).evaluate(newctx);
		
		return (result && result instanceof ReturnValue) ? result.returnValue : null;
	}
	
	// to processor
	
	var to = {};
	
	to.special = function(list, refip)
	{
		var name = list[refip.ip].name;		
		var argnames = [];
		
		for (var k = refip.ip+1; list[k] instanceof VariableReference; k++)
			argnames.push(list[k].name);
			
		var initial = k;
		
		for (; !(list[k] instanceof ProcedureReference) || list[k].name != vocabulary[16]; k++)
			;
		
		refip.ip = k + 1;
		
		var body = list.slice(initial, k);		
		
		var procedure = new Procedure(argnames, body);
		topcontext.setProcedure(name, procedure);
	}
	
	// while processor
	
	var wh = { };
	
	wh.special = function(list, refip)
	{
		return loopCondition(list, refip, true);
	}
	
	// untile processor
	
	var until = { };
	
	until.special = function(list, refip)
	{
		return loopCondition(list, refip, false);
	}
	
	function loopCondition(list, refip, condition)
	{
		var initialip = refip.ip;
		var expr = refip.evaluate(refip);
		
		var blockip = refip.ip;
		refip.ip = blockip + 1;
		var result = null;
		
		while (true) {
			if (condition && !expr)
				break;
				
			if (!condition && expr)
				break;
				
			var block = list[blockip];
			result = evaluateBlock(block, refip.context);
			
			if (result && result instanceof ReturnValue)
				break;
			
			refip.ip = initialip;
			expr = refip.evaluate(refip);
			refip.ip = blockip + 1;
		}
		
		if (result && result instanceof ReturnValue)
			return result;
	}
	
	// Lexer
	
	function Lexer(text) 
	{
		var position = 0;
		var length = text.length;
		var lasttoken = null;
		
		var separators = '()[]';
		var operators = '+-*/=<>';
		
		this.nextToken = function() {
			if (lasttoken != null) {
				var value = lasttoken;
				lasttoken = null;
				return value;
			}
		
			skipSpaces();
			
			var char = nextChar();
			
			if (char == null)
				return null;
			
			if (isLetter(char))
				return nextName(char);
				
			if (isDigit(char))
				return nextNumber(char);
				
			if (char == '"')
				return nextWord();

			if (char == ':')
				return nextVariable();
				
			if (char == '-' && isDigit(peekChar()))
				return nextNumber(char);
				
			return new Token(char, TokenType.Separator);
		}
		
		this.pushToken = function(token) 
		{
			lasttoken = token;
		}
		
		function nextChar()
		{
			if (position > length)
				return null;
				
			return text[position++];
		}
		
		function peekChar()
		{
			if (position > length)
				return null;
				
			return text[position];
		}
		
		function skipSpaces()
		{
			while (position < length && text[position] <= ' ')
				position++;
		}
		
		function nextName(char)
		{
			var name = char;
			
			while ((char = nextChar()) != null && char > ' ' && separators.indexOf(char) < 0 && operators.indexOf(char) < 0)
				name += char;
				
			if (char != null)
				position--;
				
			if (name == 'true')
				return new Token(true, TokenType.Constant);
			if (name == 'false')
				return new Token(false, TokenType.Constant);
				
			return new Token(name, TokenType.Name);
		}
		
		function nextVariable()
		{
			var name = '';
			
			while ((char = nextChar()) != null && char > ' ' && separators.indexOf(char) < 0 && operators.indexOf(char) < 0)
				name += char;
				
			if (char != null)
				position--;
				
			return new Token(name, TokenType.Variable);
		}
		
		function nextWord()
		{
			var word = '';
			
			while ((char = nextChar()) != null && char > ' ' && separators.indexOf(char) < 0)
				word += char;
				
			if (char != null)
				position--;
				
			return new Token(word, TokenType.Word);
		}
		
		function nextNumber(char)
		{
			var number = char;
			
			while ((char = nextChar()) != null && isDigit(char))
				number += char;
				
			if (char == '.')
				return nextFloatNumber(number+'.');
				
			if (char != null)
				position--;
				
			return new Token(parseInt(number), TokenType.Number);
		}
		
		function nextFloatNumber(number)
		{
			var char;
			
			while ((char = nextChar()) != null && isDigit(char))
				number += char;
				
			if (char != null)
				position--;
				
			return new Token(parseFloat(number), TokenType.Number);
		}
		
		function isLetter(char)
		{
			if (char >= 'a' && char <= 'z')
				return true;
				
			if (char >= 'A' && char <= 'Z')
				return true;
				
			return false;
		}
		
		function isDigit(char)
		{
			if (char >= '0' && char <= '9')
				return true;
				
			return false;
		}
	}
	
	function Token(value, type)
	{
		this.value = value;
		this.type = type;
	}
	
	var TokenType = { Name: 0, Number:1, Separator:2, Word:3, Variable:4, Constant:5 };
	
	// Parser
	
	function Parser(lexer) 
	{
		this.parse = parse;
		
		function parse(upto) {
			var result = [];
			
			for (var token = lexer.nextToken(); token != null; token = lexer.nextToken())
			{
				if (upto != null && token.type == TokenType.Separator && token.value == upto)
					return result;

				result.push(upto && upto == ']' ? parsePlainElement(token) : parseElement(token));
			}
			
			if (upto != null)
				throw "Expected '" + upto + "'";
			
			return result;
		}
		
		function parseElement(token)
		{
			if (token.type == TokenType.Word)
				return token.value;
				
			if (token.type == TokenType.Number)
				return token.value;

			if (token.type == TokenType.Constant)
				return token.value;
				
			if (token.type == TokenType.Name)
				return new ProcedureReference(token.value);
				
			if (token.type == TokenType.Variable)
				return new VariableReference(token.value);
				
			if (token.type == TokenType.Separator && token.value == '[')
				return parse(']');
		}
		
		function parsePlainElement(token)
		{
			if (token.type == TokenType.Word)
				return '"' + token.value;
				
			if (token.type == TokenType.Number)
				return token.value;
				
			if (token.type == TokenType.Name)
				return token.value;
			
			if (token.type == TokenType.Constant)
				return token.value;
				
			if (token.type == TokenType.Variable)
				return ':' + token.value;

			if (token.type == TokenType.Separator && token.value == '[')
				return parse(']');
				
			throw "Unexpected '" + token.value + "'";
		}
	}
	
	function compileText(text)
	{
		var lexer = new Lexer(text);
		var parser = new Parser(lexer);
		return parser.parse();
	}
	
	function evaluateText(text, context)
	{
		var list = compileText(text);
		return (new CompositeExpression(list)).evaluate(context ? context : topcontext);
	}
	
	var topcontext = new Context();
	
	// Return value
	
	function ReturnValue(value)
	{
		this.returnValue = value;
	}
	
	// Evaluate (and compile) block
	
	function evaluateBlock(block, context)
	{
		if (!block.compiled)
			block.compiled = compileList(block);

		return (new CompositeExpression(block.compiled)).evaluate(new Context(context));
	}
	
	// Primitives
	
	topcontext.setProcedure('make', function(name, value) {
		this.setVariable(name, value);
	});
	
	topcontext.setProcedure('sum', function(x, y) {
		return x+y;
	});
	
	topcontext.setProcedure('difference', function(x, y) {
		return x-y;
	});
	
	topcontext.setProcedure('product', function(x, y) {
		return x*y;
	});
	
	topcontext.setProcedure('quotient', function(x, y) {
		return x/y;
	});
	
	topcontext.setProcedure('power', function(x, y) {
		return Math.pow(x, y);
	});
	
	topcontext.setProcedure('remainder', function(x, y) {
		return x % y;
	});
	
	topcontext.setProcedure('modulo', function(x, y) {
		var result = x % y;
		
		if ((y < 0 && result > 0) || (y > 0 && result < 0))
			result = -result;
			
		return result;
	});
	
	topcontext.setProcedure('minus', function(x) {
		return -x;
	});
	
	topcontext.setProcedure('abs', function(x) {
		return Math.abs(x);
	});
	
	topcontext.setProcedure('round', function(x) {
		return Math.round(x);
	});
	
	topcontext.setProcedure('int', function(x) {
		if (x < 0)		
			return Math.ceil(x);
		else
			return Math.floor(x);
	});
	
	topcontext.setProcedure('floor', function(x) {
		return Math.floor(x);
	});
	
	topcontext.setProcedure('ceil', function(x) {
		return Math.ceil(x);
	});
	
	topcontext.setProcedure('sqrt', function(x) {
		return Math.sqrt(x);
	});
	
	topcontext.setProcedure('exp', function(x) {
		return Math.exp(x);
	});
	
	topcontext.setProcedure('ln', function(x) {
		return Math.log(x);
	});
	
	topcontext.setProcedure('log10', function(x) {
		return Math.log(x) / Math.log(10);
	});	
	
	topcontext.setProcedure('radsin', function(x) {
		return Math.sin(x);
	});	

	topcontext.setProcedure('radcos', function(x) {
		return Math.cos(x);
	});	

	topcontext.setProcedure('radtan', function(x) {
		return Math.tan(x);
	});	

	function deg2rad(d) { 
		if (d == 90)
			return Math.PI / 2;
		if (d == 180)
			return Math.PI;
			
		return d / 180 * Math.PI;
	}
	
	function rad2deg(r) { return r * 180 / Math.PI; }
	
	topcontext.setProcedure('sin', function(x) {
		return Math.sin(deg2rad(x));
	});	

	topcontext.setProcedure('cos', function(x) {
		return Math.cos(deg2rad(x));
	});	

	topcontext.setProcedure('tan', function(x) {
		return Math.tan(deg2rad(x));
	});	

	topcontext.setProcedure('arcsin', function(x) {
		return rad2deg(Math.asin(x));
	});	

	topcontext.setProcedure('arccos', function(x) {
		return rad2deg(Math.acos(x));
	});	

	topcontext.setProcedure('arctan', function(x) {
		return rad2deg(Math.atan(x));
	});	

	topcontext.setProcedure('radarcsin', function(x) {
		return Math.asin(x);
	});	

	topcontext.setProcedure('radarccos', function(x) {
		return Math.acos(x);
	});	

	topcontext.setProcedure('radarctan', function(x) {
		return Math.atan(x);
	});	
	
	topcontext.setProcedure('iseq', function(from, to) {
		from = parseInt(from);
		to = parseInt(to);
		
		var result = [];
		
		if (to >= from)
			for (var k = from; k <= to; k++)
				result.push(k);
		else
			for (var k = from; k >= to; k--)
				result.push(k);
		
		return result;
	});	
	
	topcontext.setProcedure('rseq', function(from, to, count) {
		var result = [];
		var step = Math.abs((to-from)/count);
		
		if (to >= from)
			for (var k = from; k <= to; k += step)
				result.push(k);
		else
			for (var k = from; k >= to; k -= step)
				result.push(k);
		
		return result;
	});	
	
	topcontext.setProcedure('word', function(x, y) {
		return x+ ' ' + y;
	});
	
	topcontext.setProcedure(vocabulary[17], to); // tai
	topcontext.setProcedure('while', wh); //
	topcontext.setProcedure('until', until);
	
	topcontext.setProcedure('apply', function(name, args) {
		var proc = this.getProcedure(name);

		if (proc.process)
			return proc.process(this, args);
			
		return proc.apply(this, args);
	});
	
	topcontext.setProcedure('invoke', function(name, arg) {
		var proc = this.getProcedure(name);

		if (proc.process)
			return proc.process(this, [arg]);
			
		return proc.apply(this, [arg]);
	});
	
	topcontext.setProcedure('foreach', function(name, list) {
		var proc = this.getProcedure(name);
		var isproc = (proc.process != null);
		
		for (var k = 0; k < list.length; k++)
			if (isproc)
				proc.process(this, [list[k]]);
			else
				proc.apply(this, [list[k]]);
	});
	
	topcontext.setProcedure('map', function(name, list) {
		var proc = this.getProcedure(name);
		var isproc = (proc.process != null);
		var result = [];
		
		for (var k = 0; k < list.length; k++)
			if (isproc)
				result.push(proc.process(this, [list[k]]));
			else
				result.push(proc.apply(this, [list[k]]));
		
		return result;
	});
	
	topcontext.setProcedure('filter', function(name, list) {
		var proc = this.getProcedure(name);
		var isproc = (proc.process != null);
		var result = [];
		var eval;
		
		for (var k = 0; k < list.length; k++)
		{
			if (isproc)
				eval = proc.process(this, [list[k]]);
			else
				eval = proc.apply(this, [list[k]]);
				
			if (eval)
				result.push(list[k]);
		}
		
		return result;
	});
	
	topcontext.setProcedure('find', function(name, list) {
		var proc = this.getProcedure(name);
		var isproc = (proc.process != null);
		var eval;
		
		for (var k = 0; k < list.length; k++)
		{
			if (isproc)
				eval = proc.process(this, [list[k]]);
			else
				eval = proc.apply(this, [list[k]]);
				
			if (eval)
				return list[k];
		}
		
		return [];
	});

	topcontext.setProcedure('reduce', function(name, list) {
		var proc = this.getProcedure(name);
		var isproc = (proc.process != null);
		var result = list[0];
		
		for (var k = 1; k < list.length; k++)
		{
			var y = list[k];
			
			if (isproc)
				result = proc.process(this, [result, y]);
			else
				result = proc.apply(this, [result, y]);
		}
		
		return result;
	});
	
	topcontext.setProcedure('thing', function(name) {
		return this.getVariable(name);
	});
	
	topcontext.setProcedure('numberp', function(value) {
		return typeof value == 'number';
	});
	
	function equalArrays(value1, value2)
	{
		if (value1.length != value2.length)
			return false;
			
		var l = value1.length;
		
		for (var k = 0; k < l; k++)
			if (value1[k] instanceof Array && value2[k] instanceof Array)
			{
				if (!equalArrays(value1[k], value2[k]))
					return false;
			}
			else if (value1[k] != value2[k])
				return false;
				
		return true;
	}

	topcontext.setProcedure('equalp', function(value1, value2) {
		if (value1 instanceof Array && value2 instanceof Array)
			return equalArrays(value1, value2);
		
		return value1 == value2;
	});

	topcontext.setProcedure('notequalp', function(value1, value2) {
		if (value1 instanceof Array && value2 instanceof Array)
			return !equalArrays(value1, value2);
		
		return value1 != value2;
	});
	
	topcontext.setProcedure('emptyp', function(value) {
		if (value instanceof Array)
			return value.length == 0;
			
		if (value == '')
			return true;
			
		return false;
	});

	topcontext.setProcedure('beforep', function(value1, value2) {
		return value1.toString() < value2.toString();
	});
	
	topcontext.setProcedure('memberp', function(value, list) {
		var l = list.length;
		var isarray = (value instanceof Array);
		
		for (var k = 0; k < l; k++)
			if (isarray)
			{
				if (list[k] instanceof Array && equalArrays(value, list[k]))
					return true;
			}
			else if (value == list[k])
				return true;

		return false;
	});
	
	topcontext.setProcedure('substringp', function(value1, value2) {
		value1 = value1.toString();
		value2 = value2.toString();
		
		return value2.indexOf(value1) >= 0;
	});
	
	topcontext.setProcedure('count', function(value) {
		return value.length;
	});
	
	topcontext.setProcedure('ascii', function(value) {
		return value.charCodeAt(0);
	});
	
	topcontext.setProcedure('char', function(value) {
		return String.fromCharCode(value);
	});
	
	topcontext.setProcedure('wordp', function(value) {
		if (value instanceof Array)
			return false;

		return typeof value != 'number';
	});
	
	topcontext.setProcedure('listp', function(value) {
		return value instanceof Array;
	});
	
	topcontext.setProcedure('output', function(value) {
		return new ReturnValue(value);
	});

	topcontext.setProcedure('stop', function() {
		return new ReturnValue(null);
	});
	
	var outputs = [];
	
	topcontext.setProcedure('print', function(value) {
		if (value instanceof Array)
			value = value.toPrintString();
			
		var result = value + "\r\n";
		for (var n in outputs)
			outputs[n](result);
	});
	
	topcontext.setProcedure('show', function(value) {
		if (value instanceof Array)
			value = "[ " + value.toPrintString() + " ]";
			
		var result = value + "\r\n";
		for (var n in outputs)
			outputs[n](result);
	});	

	topcontext.setProcedure('list', function(value1, value2) {
		return [value1, value2];
	});	
	
	topcontext.setProcedure('sentence', function(value1, value2) {
		var result;
		
		if (value1 instanceof Array)
			result = value1;
		else
			result = [value1];

		if (value2 instanceof Array)
			result = result.concat(value2);
		else
			result.push(value2);
			
		return result;
	});	
	
	topcontext.setProcedure('word', function(value1, value2) {
		if (value1 instanceof Array || value2 instanceof Array)
			throw 'word cannot process arrays';
			
		return value1 + ' ' + value2;
	});	
	
	topcontext.setProcedure('fput', function(value1, value2) {
		var result = [value1];
		return result.concat(value2);
	});	
	
	topcontext.setProcedure('lput', function(value1, value2) {
		var result = [].concat(value2);
		result.push(value1);
		return result;
	});	
	
	topcontext.setProcedure('combine', function(value1, value2) {
		if (value2 instanceof Array)
		{
			var result = [value1];
			return result.concat(value2);
		}
		
		if (value1 instanceof Array)
			throw 'combine cannot process array as first parameter';
		
		return value1 + ' ' + value2;
	});	
	
	topcontext.setProcedure('type', function(value) {
		if (value instanceof Array)
			value = value.toPrintString();
			
		for (var n in outputs)
			outputs[n](value);
	});
	
	topcontext.setProcedure('if', function(condition, block) { // jei
		if (!condition)
			return;

		return evaluateBlock(block, this);
	});

	topcontext.setProcedure('ifalse', function(condition, block) {
		if (condition)
			return;
			
		return evaluateBlock(block, this);
	});

	topcontext.setProcedure('ifelse', function(condition, blockthen, blockelse) {
		var block = condition ? blockthen : blockelse;
			
		return evaluateBlock(block, this);
	});
	
	topcontext.setProcedure('test', function(condition) {
		if (condition)
			this.lasttest = true;
		else
			this.lasttest = false;
	});

	topcontext.setProcedure('iftrue', function(block) {
		if (!this.lasttest)
			return;
			
		return evaluateBlock(block, this);
	});

	topcontext.setProcedure('iffalse', function(block) {
		if (this.lasttest)
			return;
			
		return evaluateBlock(block, this);
	});
	
	topcontext.setProcedure('run', function(block) {
		if (this.lasttest)
			return;
			
		return evaluateBlock(block, this);
	});
	
	topcontext.setProcedure('runresult', function(block) {
		if (this.lasttest)
			return;
			
		if (!block.compiled)
			block.compiled = compileList(block);
		
		var result = evaluateBlock(block, this);
		
		if (result == null || result.returnValue == null)
			return [];
		
		return [result.returnValue];
	});

	topcontext.setProcedure(vocabulary[11], function(count, block) { // kartok
		for (var k = 0; k < count; k++) 
		{
			var forctx = new Context(this);
			forctx.defineVariable('_repcount');
			forctx.setVariable('_repcount', k+1);
			
			var result = evaluateBlock(block, forctx);
			
			if (result && result instanceof ReturnValue)
				return result.returnValue;
		}
	});

	topcontext.setProcedure('forever', function(block) {
		var k = 0;
		
		while (true) 
		{
			var forctx = new Context(this);
			forctx.defineVariable('_repcount');
			forctx.setVariable('_repcount', k+1);
			k++;
			
			var result = evaluateBlock(block, forctx);
			
			if (result && result instanceof ReturnValue)
				return result.returnValue;
		}
	});

	topcontext.setProcedure('local', function(name) {
		this.defineVariable(name);
	});

	topcontext.setProcedure('localmake', function(name, value) {
		this.defineVariable(name);
		this.setVariable(name, value);
	});
	
	topcontext.setProcedure('ignore', function(value) {
	});

	topcontext.setProcedure('repcount', function() {
		return this.getVariable('_repcount');
	});
	
	topcontext.setProcedure('for', function(list, block) {
		var name = list[0];
		var from = list[1];
		var to = list[2];
		
		var step = list.length > 3 ? list[3] : 1;
		
		for (var k = from; k <= to; k += step)
		{
			var forctx = new Context(this);
			forctx.defineVariable(name);
			forctx.setVariable(name, k);
			
			var result = evaluateBlock(block, forctx);
			
			if (result && result instanceof ReturnValue)
				return result.returnValue;
		}
	});
	
	topcontext.setProcedure(vocabulary[0], function(distance) { // pirmyn

		if(isPenDown == true){
            if(logoLineWidth > 1 && logoLineWidth <= 20){
                for(var i = 0; i < 24; i++) {
                    //turtle.backward(0.1);
                    lineWidths.push(logoLineWidth-2);
                    turtle.forward(0.1);
                    turtle.left(15);
                }
                turtle.forward(distance);
                lineWidths.push(logoLineWidth);
                for(var i = 0; i < 24; i++) {
                    //turtle.backward(0.01);
                    lineWidths.push(logoLineWidth-2);
                    turtle.forward(0.1);
                    turtle.left(15);
                }
            } else{
                turtle.forward(distance);
                lineWidths.push(logoLineWidth);
			}
            for(var i = 0; i < 49; i++){
                //lineColors.push(logoLineColor); //pushina kad issilygintu id
			}

		} else{
            turtle.forward(distance);
            //lineWidths.push(logoLineWidth-2);
        }


	});
    topcontext.setProcedure(vocabulary[1], function(distance) { // pr
        if(isPenDown == true){
            if(logoLineWidth > 1 && logoLineWidth <= 20){
                for(var i = 0; i < 24; i++) {
                    //turtle.backward(0.1);
                    lineWidths.push(logoLineWidth-2);
                    turtle.forward(0.1);
                    turtle.left(15);
                }
                turtle.forward(distance);
                lineWidths.push(logoLineWidth);
                for(var i = 0; i < 24; i++) {
                    //turtle.backward(0.01);
                    lineWidths.push(logoLineWidth-2);
                    turtle.forward(0.1);
                    turtle.left(15);
                }
            } else{
                turtle.forward(distance);
                lineWidths.push(logoLineWidth);
            }
            for(var i = 0; i < 49; i++){
                //lineColors.push(logoLineColor); //pushina kad issilygintu id
            }

        } else{
            turtle.forward(distance);
            //lineWidths.push(logoLineWidth-2);
        }
    });
    topcontext.setProcedure(vocabulary[22], function(width) { // pasirink.pieštuko.storį
		logoLineWidth = width;
    });
    topcontext.setProcedure(vocabulary[23], function(width) { // pps
        logoLineWidth = width;
    });
    topcontext.setProcedure(vocabulary[18], function(distance, width) { // priekin.storiu
        turtle.forward(distance);
        if(isPenDown == true){
            lineWidths.push(width);
        }
    });
    topcontext.setProcedure(vocabulary[19], function(distance, width) { // pr.storiu
        turtle.forward(distance);
        if(isPenDown == true){
            lineWidths.push(width);
        }
    });
	
	topcontext.setProcedure(vocabulary[2], function(distance) { // atgal


        if(isPenDown == true){
            if(logoLineWidth > 1 && logoLineWidth <= 20){
                for(var i = 0; i < 24; i++) {
                    //turtle.backward(0.1);
                    lineWidths.push(logoLineWidth-2);
                    turtle.backward(0.1);
                    turtle.left(15);
                }
                turtle.backward(distance);
                lineWidths.push(logoLineWidth);
                for(var i = 0; i < 24; i++) {
                    //turtle.backward(0.01);
                    lineWidths.push(logoLineWidth-2);
                    turtle.backward(0.1);
                    turtle.left(15);
                }
            } else{
                turtle.backward(distance);
                lineWidths.push(logoLineWidth);
            }
            for(var i = 0; i < 49; i++){
                //lineColors.push(logoLineColor); //pushina kad issilygintu id
            }

        } else{
            turtle.backward(distance);
            //lineWidths.push(logoLineWidth-2);
        }



	});
    topcontext.setProcedure(vocabulary[3], function(distance) { // at
        if(isPenDown == true){
            if(logoLineWidth > 1 && logoLineWidth <= 20){
                for(var i = 0; i < 24; i++) {
                    //turtle.backward(0.1);
                    lineWidths.push(logoLineWidth-2);
                    turtle.backward(0.1);
                    turtle.left(15);
                }
                turtle.backward(distance);
                lineWidths.push(logoLineWidth);
                for(var i = 0; i < 24; i++) {
                    //turtle.backward(0.01);
                    lineWidths.push(logoLineWidth-2);
                    turtle.backward(0.1);
                    turtle.left(15);
                }
            } else{
                turtle.backward(distance);
                lineWidths.push(logoLineWidth);
            }
            for(var i = 0; i < 49; i++){
                //lineColors.push(logoLineColor); //pushina kad issilygintu id
            }

        } else{
            turtle.backward(distance);
            //lineWidths.push(logoLineWidth-2);
        }
    });
    topcontext.setProcedure(vocabulary[20], function(distance, width) { // atgal.storiu
        turtle.backward(distance);
        if(isPenDown == true) {
            lineWidths.push(width);
        }
    });
    topcontext.setProcedure(vocabulary[21], function(distance, width) { // at.storiu
        turtle.backward(distance);
        if(isPenDown == true) {
            lineWidths.push(width);
        }
    });
	
	topcontext.setProcedure(vocabulary[4], function(degrees) { // kairen
		turtle.left(degrees);
	});
    topcontext.setProcedure(vocabulary[5], function(degrees) { // kr
        turtle.left(degrees);
    });
	
	topcontext.setProcedure(vocabulary[6], function(degrees) { // desinen
		turtle.right(degrees);
	});
    topcontext.setProcedure(vocabulary[7], function(degrees) { // ds
        turtle.right(degrees);
    });
	
	topcontext.setProcedure(vocabulary[8], function() { // namo
		turtle.home();
	});
	
	topcontext.setProcedure('xcor', function() {
		return turtle.xcoordinate();
	});
	
	topcontext.setProcedure('ycor', function() {
		return turtle.ycoordinate();
	});
	
	topcontext.setProcedure('pos', function() {
		return turtle.position();
	});
	
	topcontext.setProcedure('heading', function() {
		return turtle.heading();
	});
	
	topcontext.setProcedure('setheading', function(degrees) {
		turtle.setHeading(degrees);
	});
	
	topcontext.setProcedure('setx', function(x) {
		turtle.setX(x);
	});

	topcontext.setProcedure('sety', function(y) {
		turtle.setY(y);
	});
	
	topcontext.setProcedure('setxy', function(x, y) {
		turtle.setX(x);
		turtle.setY(y);
	});
	
	topcontext.setProcedure('setpos', function(position) {
		turtle.setX(position[0]);
		turtle.setY(position[1]);
	});
	
	topcontext.setProcedure(vocabulary[12], function() { //eisim
		turtle.penUp();
	});
    topcontext.setProcedure(vocabulary[13], function() { //es
        turtle.penUp();
    });
	
	topcontext.setProcedure(vocabulary[14], function() { //piesim
		turtle.penDown();
	});
    topcontext.setProcedure(vocabulary[15], function() { //ps
        turtle.penDown();
    });
    topcontext.setProcedure(vocabulary[9], function() { // valyk
		lineStartingPossY.length = 0;
		lineStartingPossX.length = 0;
		lineWidths.length = 0;
		lineEndingPossY.length = 0;
		lineEndingPossX.length = 0;
		lineColors.length = 0;
		return;
    });
    topcontext.setProcedure(vocabulary[10], function() { // vvl
        lineStartingPossY.length = 0;
        lineStartingPossX.length = 0;
        lineWidths.length = 0;
        lineEndingPossY.length = 0;
        lineEndingPossX.length = 0;
        lineColors.length = 0;
        return;
    });
	
	// Turtle
	
	function Turtle() {
		this.degrees = 90;
		this.pen = true;
		this.x = 0;
		this.y = 0;
	};
	
	Turtle.prototype.forward = function(distance) {
		if (this.degrees == 0)
			this.x += distance;
		else if (this.degrees == 90)
			this.y += distance;
		else if (this.degrees == 180)
			this.x -= distance;
		else if (this.degrees == 270)
			this.y -= distance;
		else {
			var radians = this.degrees * 2 * Math.PI / 360;
			this.x += Math.cos(radians) * distance;
			this.y += Math.sin(radians) * distance;
		}
		
		if (this.onmove)
			this.onmove(this.x, this.y);
	};

	Turtle.prototype.backward = function(distance) {
		this.forward(-distance);
	};

	Turtle.prototype.left = function(degrees) {
		this.degrees += degrees;
		turtleRots -= degrees;
		this.degrees = this.degrees % 360;
	};
	
	Turtle.prototype.right = function(degrees) {
		this.degrees -= degrees;
		turtleRots += degrees;
		this.degrees = this.degrees % 360;
	};
	
	Turtle.prototype.penDown = function() {
        isPenDown = true;
		this.pen = true;
		
		if (this.onpen)
			this.onpen(this.pen);
	};


	Turtle.prototype.penUp = function() {
		isPenDown = false;
		this.pen = false;
		
		if (this.onpen)
			this.onpen(this.pen);
	};
	
	Turtle.prototype.onMove = function(onmove) {
		this.onmove = onmove;
	};
	
	Turtle.prototype.onPen = function(onpen) {
		this.onpen = onpen;
	};
	
	Turtle.prototype.heading = function() {
		turtleRots = (-90 + this.degrees) % 360;
		return (-90 + this.degrees) % 360;
	};
	
	Turtle.prototype.position = function() {
		return [this.x, this.y];
	};
	
	Turtle.prototype.xcoordinate = function() {
		return this.x;
	};
	
	Turtle.prototype.ycoordinate = function() {
		return this.y;
	};
	
	Turtle.prototype.home = function() {
		this.degrees = 90;
		turtleRots = 0;
		this.pen = true;
		this.x = 0;
		this.y = 0;
		
		if (this.onmove)
			this.onmove(this.x, this.y);
	};

	Turtle.prototype.setHeading = function(degrees) {
		turtleRots = (0 + degrees) % 360;
		this.degrees = (0 + degrees) % 360;
	};
	
	Turtle.prototype.setXY = function(x, y) {
		this.x = x;
		this.y = y;
		
		if (this.onmove)
			this.onmove(this.x, this.y);
	};
	
	Turtle.prototype.setX = function(x) {
		this.x = x;
		
		if (this.onmove)
			this.onmove(this.x, this.y);
	};
	
	Turtle.prototype.setY = function(y) {
		this.y = y;
		
		if (this.onmove)
			this.onmove(this.x, this.y);
	};
	
	var turtle = new Turtle();
	
	// Exports

    exports.TopContext = topcontext;
	exports.Turtle = turtle;
	
	if (top.testing) {
		exports.Context = Context;
		exports.CompositeExpression = CompositeExpression;
		exports.VariableReference = VariableReference;
		exports.ProcedureReference = ProcedureReference;
		exports.Constant = Constant;
	}
	
	exports.compileList = compileList;
	exports.evaluateList = evaluateList;
	exports.compileText = compileText;
	exports.evaluateText = evaluateText;
	
	exports.registerOutput = function(callback)
	{
		outputs.push(callback);
	}

})(typeof exports == "undefined" ? (this['logo'] = {}) : exports,
   typeof module == "undefined" ? { testing: this['testing']} : module,
   typeof global == "undefined" ? this : global);

