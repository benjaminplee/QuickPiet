describe 'QuickPietJS'

	describe 'Run'
		it 'should glue everything together'
		  'this code'.should.be 'tested'
		end
	end

	describe 'CommandProcessor'
		before_each
		  command_processor = new QuickPietJS.CommandProcessor()
		end
		
		describe 'BuildLabelMap'
		  it 'should not add any mappings if no labels are found'
		    split_commands = [['a', 'b'], ['c', 'def'], ['g', '']]
		    
				command_processor.BuildLabelMap(split_commands)['_END_'].should.eql -1
		  end
		  
		  it 'should return map of label text to index without symbol'
		    split_commands = [[':', 'a'], ['c', 'def'], ['g', '']]
		    
				command_processor.BuildLabelMap(split_commands)['a'].should.eql 0
				command_processor.BuildLabelMap(split_commands)['_END_'].should.eql -1
		  end
		  
		  it 'should map all labels found'
		    split_commands = [[':', 'a'], ['c', 'def'], [':', 'ghi']]
		    
				command_processor.BuildLabelMap(split_commands)['a'].should.eql 0
				command_processor.BuildLabelMap(split_commands)['ghi'].should.eql 2
				command_processor.BuildLabelMap(split_commands)['_END_'].should.eql -1
		  end
		  
		  it 'should map explicit end label _END_ to -1'
		    split_commands = []
		    
				command_processor.BuildLabelMap(split_commands)['_END_'].should.eql -1
		  end
		end
		
		describe 'SplitCommands'
		  it 'should return new array with lines split on first space'
		    lines = ['a b', 'c def', 'g']
		    
		    command_processor.SplitCommands(lines).should.eql [['a', 'b'], ['c', 'def'], ['g', '']]
		  end
		  
		  it 'should split label commands on first character'
		    lines = ['a b', ':label', 'g h']
		    
		    command_processor.SplitCommands(lines).should.eql [['a', 'b'], [':', 'label'], ['g', 'h']]
		  end
		  
		  it 'should leave spaces in arguments'
		    lines = ['a b', 'c d e f', 'g h']
		    
		    command_processor.SplitCommands(lines).should.eql [['a', 'b'], ['c', 'd e f'], ['g', 'h']]
		  end
		end
		
		describe 'BindCommandArguments'
		  it 'should bind common arguments to actual functions'
		  	var cmds = {
		  		forward : function(stack, args, stdin, stdout) {
		  			return stack + args + stdin + stdout
		  		},
		  		
		  		reverse : function(stack, args, stdin, stdout) {
		  			return stdout + stdin + args + stack
		  		}	
	  		}
		  
		    var bound_cmds = command_processor.BindCommandArguments(cmds, 'a', 'c', 'd')
		    
		    bound_cmds['forward']('b').should.eql 'abcd'
		    bound_cmds['reverse']('b').should.eql 'dcba'
		  end
		  
		  it 'should not bind private functions starting with an underscore \'_\''
		  	var cmds = {
		  		forward : function(stack, args, stdin, stdout) {
		  			return stack + args + stdin + stdout
		  		},
		  		
		  		_reverse : function(stack, args, stdin, stdout) {
		  			return stdout + stdin + args + stack
		  		}	
	  		}
		  
		    var bound_cmds = command_processor.BindCommandArguments(cmds, 'a', 'c', 'd')
		    
		    bound_cmds['_reverse'].should.be_undefined
		  end
		end
		
		describe 'Executor'
		  it 'should do a lot of stuff I can\'t immediately think of how to test'
		    'hacked together for the time being'.should.be 'done the right way instead'
		  end
		end
	
	  describe 'GrabCleanInputLines'
	  	before_each
	  	  buffer = {
	  	  	value : "",
	  	  
	  	  	grab : function() {
	  	  		return this.value
  	  		}
  	  	}
	  	end
	  
	    it 'should split command input by newlines'
	      buffer.value = '1\n2\n3\n'
	      
	      var lines = command_processor.GrabCleanInputLines(buffer)
	      
	      lines.length.should.be 3
	      lines[0].should.eql '1'
	      lines[1].should.eql '2'
	      lines[2].should.eql '3'
	    end
	    
	    it 'should not care if the last line has a newline after it'
	      buffer.value = 'a\nb\nc'
	      
	      var lines = command_processor.GrabCleanInputLines(buffer)
	      
	      lines.length.should.be 3
	      lines[0].should.eql 'a'
	      lines[1].should.eql 'b'
	      lines[2].should.eql 'c'
	    end
	    
	    it 'should filter out blank lines'
	      buffer.value = '1\n\n\n2\n       \n3\n\t\n'
	      
	      var lines = command_processor.GrabCleanInputLines(buffer)
	      
	      lines.length.should.be 3
	      lines[0].should.eql '1'
	      lines[1].should.eql '2'
	      lines[2].should.eql '3'
	    end
	    
	    it 'should filter out comments'
	      buffer.value = '# a \n1\n#b\n2\n3\n'
	      
	      var lines = command_processor.GrabCleanInputLines(buffer)
	      
	      lines.length.should.be 3
	      lines[0].should.eql '1'
	      lines[1].should.eql '2'
	      lines[2].should.eql '3'
	    end
	  end
	end

	describe 'STDIO'
	  describe 'textarea'
	  	before_each
				io_buffer = $(fixture('io'))
		  	textarea = new QuickPietJS.stdio.textarea(io_buffer)
			end
	  
	  	describe 'grab'
	  	  it 'should return all characters from the buffer'
	  	    textarea.grab().should.eql 'dog'
	  	  end
	  	end
	  
	  	describe 'pop'
	  	  it 'should return the first character from the textarea'
	  	    textarea.pop().should.eql 'd'
	  	  end
	  	  
	  	  it 'should remove returned character from textarea'
	  	  	io_buffer.val().should.eql 'dog'
	  	  
	  	  	textarea.pop()
	  	  	
	  	  	io_buffer.val().should.eql 'og'
	  	  end
	  	  
	  	  it 'should error if the buffer is empty'
	  	    io_buffer.val('')
	  	    
	  	    -{ textarea.pop() }.should.throw_error EvalError, 'Can not pop from empty buffer'
	  	  end
	  	end
	  	
	  	describe 'push'
	  	  it 'should append the given character to the textarea value'
	  	  	io_buffer.val().should.eql 'dog'
	  	  
	  	  	textarea.push('!')
	  	  	
	  	  	io_buffer.val().should.eql 'dog!'
	  	  end
	  	end
	  end
	end
end