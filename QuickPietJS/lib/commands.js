Commands = {
	push : function(stack, args) {
		if(!args || args.length == 0 || args.match(/[^0-9\s]/)) {
			throw new SyntaxError("Invalid argument(s)")	
		}
		
		jQuery.each(args.split(' '), function(index, value) {
			stack.push(parseInt(value))
		})
	},
	
	pop : function(stack, args) {
		var pops_count = 1
		
		if(args && args.length > 0) {
			args = jQuery.trim(args)
			
			if(args.length == 0 || args.match(/[^0-9\s]/) || parseInt(args) == NaN) {
				throw new SyntaxError('Invalid argument(s)')	
			}
			else {
				pops_count = parseInt(args)	
			}
		}
		
		this._enforce_min_stack_size(stack, pops_count)

		for(var i = 0; i < pops_count; i++) {
			stack.pop()
		}
	},
	
	duplicate : function(stack) {
		this._enforce_non_empty_stack(stack)
		
		var val = stack.pop()
		stack.push(val)
		stack.push(val)
	},
	
	roll : function(stack, args) {
		args = jQuery.trim(args)
		
		if(!args || args.match(/[^0-9\-\s]/)) {
			throw new SyntaxError('Invalid argument(s)')
		}
		
		var args_array = args.split(' ')
		
		if(args_array.length != 2) {
			throw new SyntaxError('Invalid argument(s)')
		}
		
		var depth = parseInt(args_array[0])
		var turns = parseInt(args_array[1])
		
		if(depth < 1) {
			throw new SyntaxError('Invalid argument(s)')
		}
		
		this._enforce_min_stack_size(stack, depth)
		
		var depth_index = stack.length - depth
		
		if(turns >= 0) {
			for(var turn = 0; turn < turns; turn++) {
				stack.splice(depth_index, 0, stack.pop())
			}
		}
		else {
			turns = turns * -1
			
			for(var turn = 0; turn < turns; turn++) {
				stack.push(stack.splice(depth_index, 1)[0])
			}
		}
	},
	
	// Done as a string b/c of issue in Chrome
	'in' : function(stack, args, STDIN, STDOUT) {
		stack.push(STDIN.pop().charCodeAt(0))
	},
	
	// Done as a string b/c of issue in Chrome
	'out' : function(stack, args, STDIN, STDOUT) {
		this._enforce_non_empty_stack(stack)
		
		var numeric_value = stack.pop()
		
		if(numeric_value < 1) {
			throw new EvalError('Can not output negative values')
		}
		
		STDOUT.push(String.fromCharCode(numeric_value))
	},
	
	add : function(stack) {
		this._enforce_min_stack_size(stack, 2)
		
		stack.push(stack.pop() + stack.pop())
	},
	
	subtract : function(stack) {
		this._enforce_min_stack_size(stack, 2)
		
		var top = stack.pop()
		var second_top = stack.pop()
		stack.push(second_top - top)
	},
	
	multiply : function(stack) {
		this._enforce_min_stack_size(stack, 2)
		
		stack.push(stack.pop() * stack.pop())
	},
	
	divide : function(stack) {
		this._enforce_min_stack_size(stack, 2)
		
		var top = stack.pop()
		var second_top = stack.pop()
		stack.push(parseInt(second_top / top))
	},
	
	mod : function(stack) {
		this._enforce_min_stack_size(stack, 2)
		
		var top = stack.pop()
		var second_top = stack.pop()
		stack.push(parseInt(second_top % top))
	},
	
	not : function(stack) {
		this._enforce_non_empty_stack(stack)
		
		stack.push(stack.pop() == 0 ? 1 : 0)
	},
	
	greater : function(stack) {
		this._enforce_min_stack_size(stack, 2)
		
		stack.push(stack.pop() < stack.pop() ? 1 : 0)
	},
	
	end : function() {
		return '_END_'	
	},
	
	goto : function(stack, args) {
		args = jQuery.trim(args)
		
		if(!args || args.length < 2 || args.match(/[^a-zA-Z0-9\s]/)) {
			throw new SyntaxError('Invalid argument(s)')
		}
		
		var arguments = args.split(' ')
		
		if(arguments.length != 2) {
			throw new SyntaxError('Invalid argument(s)')
		}
		
		this._enforce_non_empty_stack(stack)
		
		var switch_value = stack.pop() % 4
		switch_value = switch_value < 0 ? switch_value * (-1) : switch_value
		
		if(switch_value == 1) {
			return arguments[0]
		}
		else if(switch_value == 3) {
			return arguments[1]
		}
	},
	
	assert : function(stack, args) {
		var check_values = jQuery.trim(args).split(' ')
		var num_check_values = check_values.length
		
		if((!args && stack.length != 0) || (num_check_values != stack.length && args)) {
			throw new EvalError('Invalid stack: wrong number of values')
		}
		
		for(var index = 0; index < num_check_values && args; index++) {
			var stack_value = stack.pop()
			var check_value = parseInt(check_values[index])
			
			if(stack_value != check_value) {
				throw new EvalError('Invalid stack: wrong values')
			}
		}
	},

	_enforce_non_empty_stack : function(stack) {
		this._enforce_min_stack_size(stack, 1)
	},
	
	_enforce_min_stack_size : function(stack, min_size) {
		if(stack.length < min_size) {
			throw new EvalError('Stack does not have enough values')
		}
	}
}