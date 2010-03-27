describe 'Commands'
	before_each
		stack = []
		STDIN = []
		STDOUT = []
	end
	
	describe 'label (:)'
	  it 'should do nothing'
	    Commands[':'](stack)
	    
	    stack.should.eql []
	  end
	end

	describe 'push'
		it 'should push a single integer onto an empty stack'
			Commands['push'](stack, '14')
			
			stack.should.eql [14]
		end
		
		it 'should push multiple integers onto an empty stack'
			Commands['push'](stack, '100 0 1')
			
			stack.should.eql [100, 0, 1]
		end
		
		it 'should push multiple integers onto a non-empty stack'
			stack.push(1)
			stack.push(2)
			
			Commands['push'](stack, '3 4')
			
			stack.should.eql [1, 2, 3, 4]
		end
		
		it 'should return undefined'
			Commands['push'](stack, '1').should.be_undefined
		end
		
		it 'should error if missing arguments'
			-{ Commands['push'](stack) }.should.throw_error SyntaxError, 'Invalid argument(s)'
		end
		
		it 'should error on negative integers'
			-{ Commands['push'](stack, '-1') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		end

		it 'should error if commas are included'
			-{ Commands['push'](stack, '5,10') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		end
		
		it 'should error if decimals are included'
			-{ Commands['push'](stack, '2.5') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		end
		
		it 'should error if no arguments are included'
			-{ Commands['push'](stack, '') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		end
		
		it 'should error if values are non-numeric'
			-{ Commands['push'](stack, 'dog') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		end
	end
	
	describe 'pop'
		before_each
		  stack.push(10)
		end
	
		it 'should discard top value on stack'
			stack.should.eql [10]
			
			Commands['pop'](stack)
			
			stack.should.eql []
		end
		
		it 'should discard top X values from stack if positive integer is given'
			stack.push(20)
			stack.push(30)
			
			Commands['pop'](stack, '2')
			
			stack.should.eql [10]
		end
		
		it 'should error if argument is not a single positive numeric value'
			-{ Commands['pop'](stack, 'a') }.should.throw_error SyntaxError, 'Invalid argument(s)'
			-{ Commands['pop'](stack, '5.6') }.should.throw_error SyntaxError, 'Invalid argument(s)'
			-{ Commands['pop'](stack, '-1') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		end
		
		it 'should error if pop is called on an empty stack'
			stack.pop()
			-{ Commands['pop'](stack) }.should.throw_error EvalError, 'Stack does not have enough values'
		end
		
		it 'should error if multiple pops are more than stack height'
		  stack.push(200)
		  stack.push(200)
		  stack.push(200)
		  
		  -{ Commands['pop'](stack, '5') }.should.throw_error EvalError, 'Stack does not have enough values'
		end
		
		it 'should return undefined'
			Commands['pop'](stack).should.be_undefined
		end
	end
	
	describe 'duplicate'
		it 'should copy of top value'
		  stack.push(1)
		  stack.push(2)
		  
		  stack.should.eql [1,2]
		  
		  Commands['duplicate'](stack)
		  
		  stack.should.eql [1,2,2]
		end
		
		it 'should error if stack is empty'
		  -{ Commands['duplicate'](stack) }.should.throw_error EvalError, 'Stack does not have enough values'
		end
				
		it 'should return undefined'
		  stack.push(100)
		  
		  Commands['duplicate'](stack).should.be_undefined
		end
	end
	
	describe 'roll'
		before_each
		  stack = [1, 2, 3, 4, 5]
		end
		
		it 'should roll top stack values to a depth of the first arg, the second arg number of times'
		  Commands['roll'](stack, '4 2')
		  
		  stack.should.eql [1, 4, 5, 2, 3]
		end
		
		it 'should error if the stack is shorter than the requested depth'
		  -{ Commands['roll'](stack, '10 1') }.should.throw_error EvalError, 'Stack does not have enough values'
		end

		it 'should handle negative turns by rolling in the opposite direction'
		  Commands['roll'](stack, '3 -1')
		  
		  stack.should.eql [1, 2, 4, 5, 3]
		end
		
		it 'should error if the depth is negative'
		  -{ Commands['roll'](stack, '-1 1') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		end
		
		it 'should error if invalid arguments are given (e.g. missing, commas, too many, letters, and decimals)'
		  -{ Commands['roll'](stack, '') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		  -{ Commands['roll'](stack, ' ') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		  -{ Commands['roll'](stack, '1, 1') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		  -{ Commands['roll'](stack, '1 1 3') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		  -{ Commands['roll'](stack, '1 a') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		  -{ Commands['roll'](stack, '1 2.5') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		end
		
		it 'should return undefined'
		  Commands['roll'](stack, '2 1').should.be_undefined
		end
	end
	
	describe 'in'
		before_each
		  STDIN.push('H')
		end
	
	  it 'should pop a character from STDIN'
	    Commands['in'](stack, '', STDIN, STDOUT)
	    
	    STDIN.should.eql []
	  end
	  
	  it 'should push the ASCII value of that character onto the stack'
	    Commands['in'](stack, '', STDIN, STDOUT)
	    
	    stack.should.eql [72]
	  end
	  
	  it 'should return undefined'
	    Commands['in'](stack, '', STDIN, STDOUT).should.be_undefined
	  end
	end
	
	describe 'out'
		it 'should pop the top value from the stack'
		  stack.push(32)
		  
		  Commands['out'](stack, '', STDIN, STDOUT)
		  
		  stack.should.eql []
		end
		
		it 'should \'push\' the ASCII character associated with the top value onto STDOUT'
			stack.push(32)
		  
		  Commands['out'](stack, '', STDIN, STDOUT)

			STDOUT.should.eql [' ']
		end
		
		it 'should error if the value is < 1'
			stack.push(-1)  
		
			-{ Commands['out'](stack, '', STDIN, STDOUT) }.should.throw_error EvalError, 'Can not output negative values'
		end
		
		it 'should error if the stack is empty'
		  -{ Commands['out'](stack, '', STDIN, STDOUT) }.should.throw_error EvalError, 'Stack does not have enough values'
		end
		
		it 'should return undefined'
		  stack.push(1)
		  
		  Commands['out'](stack, '', STDIN, STDOUT).should.be_undefined
		end
	end
	
	describe 'add'
	  before_each
	  	stack.push(100)
	    stack.push(5)
	    stack.push(10)
	  end
	  
	  it 'should pop top 2 values and result of their addition'
	    Commands['add'](stack)
	    
	    stack.should.eql [100, 15]
	  end

		it 'should error if the stack is empty'
		  stack = []
		  
		  -{ Commands['add'](stack) }.should.throw_error EvalError, 'Stack does not have enough values'
		end
		
		it 'should error if stack has only one value'
		  stack = [10]
		  
		  -{ Commands['add'](stack) }.should.throw_error EvalError, 'Stack does not have enough values'
		end

	  it 'should return undefined'
	    Commands['add'](stack).should.be_undefined
	  end
	end
	
	describe 'subtract'
	  before_each
	  	stack.push(10)
	    stack.push(200)
	    stack.push(30)
	  end
	  
	  it 'should pop top 2 values and result of their subtraction (second top - top)'
	    Commands['subtract'](stack)
	    
	    stack.should.eql [10, 170]
	  end

		it 'should error if the stack is empty'
		  stack = []
		  
		  -{ Commands['subtract'](stack) }.should.throw_error EvalError, 'Stack does not have enough values'
		end	
			
		it 'should error if stack has only one value'
		  stack = [10]
		  
		  -{ Commands['subtract'](stack) }.should.throw_error EvalError, 'Stack does not have enough values'
		end

	  it 'should return undefined'
	    Commands['subtract'](stack).should.be_undefined
	  end
	end
	
	describe 'multiply'
	  before_each
	  	stack.push(10)
	    stack.push(200)
	    stack.push(30)
	  end
	  
	  it 'should pop top 2 values and result of their multiplication'
	    Commands['multiply'](stack)
	    
	    stack.should.eql [10, 6000]
	  end

		it 'should error if the stack is empty'
		  stack = []
		  
		  -{ Commands['multiply'](stack) }.should.throw_error EvalError, 'Stack does not have enough values'
		end
				
		it 'should error if stack has only one value'
		  stack = [10]
		  
		  -{ Commands['multiply'](stack) }.should.throw_error EvalError, 'Stack does not have enough values'
		end

	  it 'should return undefined'
	    Commands['multiply'](stack).should.be_undefined
	  end
	end
	
	describe 'divide'
	  before_each
	  	stack.push(10)
	    stack.push(200)
	    stack.push(50)
	  end
	  
	  it 'should pop top 2 values and result of their division (second top / top)'
	    Commands['divide'](stack)
	    
	    stack.should.eql [10, 4]
	  end
	  
	  it 'should perform integer division (drop decimal)'
	    stack.push(26)
	    
	    // 50/26 = 1.92... = 1
	    Commands['divide'](stack)
	    
	    stack.should.eql [10, 200, 1]
	  end

		it 'should error if the stack is empty'
		  stack = []
		  
		  -{ Commands['divide'](stack) }.should.throw_error EvalError, 'Stack does not have enough values'
		end
				
		it 'should error if stack has only one value'
		  stack = [10]
		  
		  -{ Commands['divide'](stack) }.should.throw_error EvalError, 'Stack does not have enough values'
		end

	  it 'should return undefined'
	    Commands['divide'](stack).should.be_undefined
	  end
	end
	
	describe 'mod'
	  before_each
	  	stack.push(10)
	    stack.push(200)
	    stack.push(33)
	  end
	  
	  it 'should pop top 2 values and push the remainder of their division (second top % top)'
	    Commands['mod'](stack)
	    
	    stack.should.eql [10, 2]
	  end
	  
	  it 'should return zero if there is no remainder'
	  	stack.push(11)
	  	
	    Commands['mod'](stack)
	    
	    stack.should.eql [10, 200, 0]
	  end

		it 'should error if the stack is empty'
		  stack = []
		  
		  -{ Commands['mod'](stack) }.should.throw_error EvalError, 'Stack does not have enough values'
		end
				
		it 'should error if stack has only one value'
		  stack = [10]
		  
		  -{ Commands['mod'](stack) }.should.throw_error EvalError, 'Stack does not have enough values'
		end

	  it 'should return undefined'
	    Commands['mod'](stack).should.be_undefined
	  end
	end
	
	describe 'not'
	  it 'should replace top value with 0 if top value was non-zero'
	    stack.push(5)
	    
	    Commands['not'](stack)
	    
	    stack.should.eql [0]
	  end
	  
	  it 'should replace top value with 1 if top value was zero'
	    stack.push(0)
	    
	    Commands['not'](stack)
	    
	    stack.should.eql [1]
	  end
	  
		it 'should error if the stack is empty'
		  -{ Commands['not'](stack) }.should.throw_error EvalError, 'Stack does not have enough values'
		end

	  it 'should return undefined'
	  	stack.push(2)
	  	
	    Commands['not'](stack).should.be_undefined
	  end
	end
	
	describe 'greater'
	  it 'should pop top 2 values and push 1 if second-top is > top'
	  	stack = [2, 5, 3]
	  
	    Commands['greater'](stack)
	    
	    stack.should.eql [2, 1]
	  end

	  it 'should pop top 2 values and push 0 if second-top is <= top'
	  	stack = [2, 3, 5]
	  
	    Commands['greater'](stack)
	    
	    stack.should.eql [2, 0]
	  end
	  
		it 'should error if the stack is empty'
		  stack = []
		  
		  -{ Commands['greater'](stack) }.should.throw_error EvalError, 'Stack does not have enough values'
		end
				
		it 'should error if stack has only one value'
		  stack = [10]
		  
		  -{ Commands['greater'](stack) }.should.throw_error EvalError, 'Stack does not have enough values'
		end

	  it 'should return undefined'
	  	stack = [1, 2]
	  	
	    Commands['greater'](stack).should.be_undefined
	  end
	end
	
	describe 'end'
	  it 'should return internal program end label'
	    Commands['end']().should.eql '_END_'
	  end
	end
	
	describe 'goto'
	  it 'should pop the top value from the stack'
	    stack.push(50)
	    
	    Commands['goto'](stack, 'a b')
	    
	    stack.should.eql []
	  end
	  
	  it 'should error if the stack is empty'
	    -{ Commands['goto'](stack, 'b c') }.should.throw_error EvalError, 'Stack does not have enough values'
	  end

		it 'should error if more than two arguments are given'
		  -{ Commands['goto'](stack, 'b c d') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		end
		
		it 'should error if fewer than two arguments are given'
		  -{ Commands['goto'](stack, 'a') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		  -{ Commands['goto'](stack, ' ') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		  -{ Commands['goto'](stack) }.should.throw_error SyntaxError, 'Invalid argument(s)'
		end
		
		it 'should error if non alpha-numeric characters are found within the arguments'
		  -{ Commands['goto'](stack, '-b c!') }.should.throw_error SyntaxError, 'Invalid argument(s)'
		end
	  
	  it 'should return the first label as a string if the top value = 1 MOD 4'
	    stack.push(5)
	    
	    Commands['goto'](stack, 'a b').should.eql 'a'
	  end
	  
	  it 'should return the second label as a string if the top value = 3 MOD 4'
	    stack.push(7)
	    
	    Commands['goto'](stack, 'a b').should.eql 'b'
	  end
	  
	  it 'should should return undefined if the top value = 0 or 2 MOD 4'
	  	stack.push(16)
	    Commands['goto'](stack, 'a b').should.be_undefined

	  	stack.push(18)
	    Commands['goto'](stack, 'a b').should.be_undefined
	  end
	  
	  it 'should handle negative numbers in the normal way mod 4 (-1 = 1 MOD 4)'
	    stack.push(-1)
	    Commands['goto'](stack, 'a b').should.eql 'a'
	    
	    stack.push(-2)
	    Commands['goto'](stack, 'a b').should.be_undefined
	    
	    stack.push(-3)
	    Commands['goto'](stack, 'a b').should.eql 'b'
	  end
	end
	
	describe 'assert'
	  it 'should pop all values from the stack, leaving it empty'
	    stack = [1,2,3,4,5]
	    
	    Commands['assert'](stack, '5 4 3 2 1')
	    
	    stack.should.eql []
	  end
	  
	  it 'should error if there are no arguments and the stack is not empty'
	    stack.push(1)
	    
	    -{ Commands['assert'](stack) }.should.throw_error EvalError, 'Invalid stack: wrong number of values'
	  end
	  
	  it 'should do nothing and return undefined if no arguments are given and stack is empty'
	    Commands['assert'](stack).should.be_undefined
	  end
	  
	  it 'should do nothing and return undefined if all arguments match stack values'
	    stack.push(1)
	    stack.push(2)
	    stack.push(3)
	    
	    Commands['assert'](stack, '3 2 1').should.be_undefined
	  end
	  
	  it 'should error if the number of arguments > stack size'
	    stack.push(1)
	    
	    -{ Commands['assert'](stack, '2 1') }.should.throw_error EvalError, 'Invalid stack: wrong number of values'
	  end
	  
	  it 'should error if the top value on the stack was not equal to the first argument'
	    stack.push(1)
	    
	    -{ Commands['assert'](stack, '2') }.should.throw_error EvalError, 'Invalid stack: wrong values'	    
	  end
	  
	  it 'should error if any arguments were not on the stack in the correct order (top first)'
	    stack.push(1)
	    stack.push(2)
	    
	    -{ Commands['assert'](stack, '2 3') }.should.throw_error EvalError, 'Invalid stack: wrong values'
	  end
	end
end