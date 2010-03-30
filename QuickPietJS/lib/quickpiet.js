QuickPietJS = {}

QuickPietJS.Run = function(command_textarea, stdin_textarea, stdout_textarea) {
	try {
		var cmds = new QuickPietJS.stdio.textarea(command_textarea)
		var stdin = new QuickPietJS.stdio.textarea(stdin_textarea)
		var stdout = new QuickPietJS.stdio.textarea(stdout_textarea)
		var stack = []
		var proc = new QuickPietJS.CommandProcessor()
		
		var split_commands = proc.SplitCommands(proc.GrabCleanInputLines(cmds))
		
		proc.Executor(proc.BindCommandArguments(Commands, stack, stdin, stdout), split_commands, proc.BuildLabelMap(split_commands))
	}
	catch(e) {
		alert(e)
	}
}

QuickPietJS.stdio = {}

QuickPietJS.stdio.textarea = function(element) {
	this.element = element;
}

QuickPietJS.stdio.textarea.prototype.pop = function() {
	var buffer = this.element.val()

	// untested	
	if(buffer.length == 0) {
		buffer = prompt('Your program requests additional input data.  Please type in more data below').replace(/\\n/, String.fromCharCode(10))
	}
	
	this.element.val(buffer.substring(1))
	
	return buffer[0]
}

QuickPietJS.stdio.textarea.prototype.push = function(value) {
	this.element.val(this.element.val() + value)
}

QuickPietJS.stdio.textarea.prototype.grab = function() {
	return this.element.val()
}

QuickPietJS.CommandProcessor = function() { }
QuickPietJS.CommandProcessor.prototype.GrabCleanInputLines = function(buffer) {
	var value = buffer.grab()
	var lines = value.split('\n')
	
	lines = jQuery.map(lines, function(line) {
		return jQuery.trim(line)
	})	
	
	lines = jQuery.grep(lines, function(line) {
		return line && (line.length > 0) && (line[0] != '#')
	})
	
	return lines
}

QuickPietJS.CommandProcessor.prototype.SplitCommands = function(lines) {
	var result = []
	
	jQuery.each(lines, function(index, line) {
		line = line.replace(/^\:/, ': ')
		
		var first_space = line.indexOf(' ')
		
		if(first_space != -1) {
			var command = line.substring(0, first_space)
			var args = line.substring(first_space + 1)

			result.push([command, args])
		}
		else {
			result.push([line, ''])
		}
	})
	
	return result
}

QuickPietJS.CommandProcessor.prototype.BuildLabelMap = function(split_lines) {
	var map = { '_END_' : -1 }	
	
	jQuery.each(split_lines, function(index, split_line) {
		if(split_line[0] == ':') {
			map[split_line[1]] = index
		}
	})
	
	return map
}

QuickPietJS.CommandProcessor.prototype.BindCommandArguments = function(commands, stack, STDIN, STDOUT) {
	var bound_commands = {}

	jQuery.each(commands, function(command_name, command_function) {
		if(command_name[0] != '_') {
			bound_commands[command_name] = function(args) {
				if(console) {
					var info = '[' + command_name + '|' + args + ':'
					
					for(var i = 0; i < stack.length; i++) {
						info = info + stack[i]
						
						if((i+1) < stack.length) {
							info = info + ','	
						}
					}
					
					info = info + ']'
					
					console.log(info)
				}
		
				return command_function(stack, args, STDIN, STDOUT)	
			}
		}	
	})

	return bound_commands
}

QuickPietJS.CommandProcessor.prototype.Executor = function(commands, split_commands, label_map) {
	var command_index = 0
	var num_commands = split_commands.length
	
	while(command_index >= 0 && command_index < num_commands) {
		var current_split_command = split_commands[command_index]
		try {
			var command_result = commands[current_split_command[0]](current_split_command[1])
		}
		catch(e) {
			alert(command_index + '::' + e + '::[' + current_split_command + ']')
			throw new Error('Error while running program, exiting.')
		}
		command_index = command_result && label_map[command_result] || (command_index + 1)
	}
}
